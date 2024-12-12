import config from '../config';
import { Session } from './Session';

export class ApiError extends Error {
    constructor(
        public status: number,
        public message: string,
        public code?: string
    ) {
        super(message);
        this.name = 'ApiError';
    }
}

interface RequestOptions extends RequestInit {
    timeout?: number;
    retries?: number;
}

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function fetchWithTimeout(url: string, options: RequestOptions = {}): Promise<Response> {
    const { timeout = config.apiTimeout } = options;

    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);

    try {
        const response = await fetch(url, {
            ...options,
            signal: controller.signal
        });
        return response;
    } finally {
        clearTimeout(id);
    }
}

async function handleResponse(response: Response) {
    if (!response.ok) {
        let errorMessage = 'An error occurred';
        let errorCode;
        
        const contentType = response.headers.get('content-type');
        
        try {
            if (contentType && contentType.includes('application/json')) {
                const errorData = await response.json();
                errorMessage = errorData.message || errorMessage;
                errorCode = errorData.code;
            } else {
                errorMessage = await response.text() || response.statusText;
            }
        } catch (e) {
            console.error('Erro ao processar resposta:', e);
            errorMessage = response.statusText;
        }

        throw new ApiError(response.status, errorMessage, errorCode);
    }

    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
        return response.json();
    }
    
    return response.text();
}

export async function apiRequest<T>(
    endpoint: string,
    options: RequestOptions = {}
): Promise<T> {
    const url = `${config.apiUrl}${endpoint}`;
    const retries = options.retries ?? config.retryAttempts;
    
    // Add default headers
    const headers = new Headers(options.headers || {});
    if (!headers.has('Content-Type')) {
        headers.set('Content-Type', 'application/json');
    }

    // Add auth token if available
    const token = Session.getToken();
    if (token) {
        headers.set('Authorization', `Bearer ${token}`);
    }

    let lastError: Error | null = null;
    
    for (let attempt = 0; attempt <= retries; attempt++) {
        try {
            if (attempt > 0) {
                await sleep(config.retryDelay * attempt);
            }

            const response = await fetchWithTimeout(url, {
                ...options,
                headers
            });

            return await handleResponse(response);
        } catch (error) {
            lastError = error as Error;
            
            if (
                error instanceof ApiError && 
                [400, 401, 403, 404, 422].includes(error.status)
            ) {
                throw error;
            }
            
            if (attempt === retries) {
                if (error instanceof Error) {
                    if (error.name === 'AbortError') {
                        throw new ApiError(408, 'Request timeout');
                    }
                    throw error;
                }
                throw new ApiError(500, 'Unknown error occurred');
            }
        }
    }

    throw lastError || new Error('Request failed');
}

// Convenience methods
export const get = <T>(endpoint: string, options?: RequestOptions): Promise<T> => 
    apiRequest(endpoint, { ...options, method: 'GET' });

export const post = <T>(endpoint: string, data?: unknown, options?: RequestOptions): Promise<T> => 
    apiRequest(endpoint, { 
        ...options, 
        method: 'POST',
        body: data ? JSON.stringify(data) : undefined 
    });

export const put = <T>(endpoint: string, data?: unknown, options?: RequestOptions): Promise<T> => 
    apiRequest(endpoint, { 
        ...options, 
        method: 'PUT',
        body: data ? JSON.stringify(data) : undefined 
    });

export const del = <T>(endpoint: string, options?: RequestOptions): Promise<T> => 
    apiRequest(endpoint, { ...options, method: 'DELETE' }); 