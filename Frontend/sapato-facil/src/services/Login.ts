import { post } from './ApiClient';
import { Session } from './Session';
import { createUser } from './Usuario';

export interface LoginRequest {
    id?: number;
    cpf?: string;
    nome?: string;
    email?: string;
    password?: string;
    isAdm?: boolean;
}

export interface LoginResponse {
    sucesso: boolean;
    mensagem?: string;
    token?: string;
}

export interface RegisterRequest {
    cpf?: string;
    nome?: string;
    email?: string;
    password?: string;
    roleEnum?: string;
}

export interface RegisterResponse {
    sucesso: boolean;
    mensagem?: string;
}

export const login = async (loginRequest: LoginRequest): Promise<LoginResponse> => {
    const response = await post<LoginResponse>('/public/usuarios/login', loginRequest);
    if (response.token) {
        Session.saveToken(response.token);
        if (typeof window !== 'undefined') {
            window.dispatchEvent(new Event('login'));
        }
    }
    return response;
};

export const register = async (registerRequest: RegisterRequest): Promise<RegisterResponse> => {
    registerRequest.roleEnum = 'CLIENTE';
    const response = await createUser(registerRequest);
    if (!response.token) {
        console.error(response);
        throw new Error('Erro ao efetuar o cadastro');
    }
    if (response.token) {
        Session.saveToken(response.token);
        if (typeof window !== 'undefined') {
            window.dispatchEvent(new Event('login'));
        }
    }
    return response;
};

export type { LoginRequest, LoginResponse, RegisterRequest, RegisterResponse };