import { get, post, put } from './ApiClient';
import config from '../config';
import { Session } from './Session';

export enum Genero {
    MASCULINO = 'MASCULINO',
    FEMININO = 'FEMININO',
    UNISSEX = 'UNISSEX'
}

export interface ProdutoRequest {
    nome: string;
    valor: number;
    quantidadeEstoque: number;
    tamanho: number;
    genero: Genero;
    cor: string;
}

export interface ProdutoResponse {
    id: number;
    nome: string;
    valor: number;
    quantidadeEstoque: number;
    tamanho: number;
    genero: Genero;
    cor: string;
    foto: string;
}

export const getProdutos = async (): Promise<ProdutoResponse[]> => {
    return get<ProdutoResponse[]>('/public/produtos/listar');
};

export const getProdutoById = async (id: number): Promise<ProdutoResponse> => {
    return get<ProdutoResponse>(`/public/produtos/buscar/${id}`);
};

export const createProduto = async (produto: ProdutoRequest): Promise<ProdutoResponse> => {
    return post<ProdutoResponse>('/public/produtos/cadastrar', produto);
};

export const updateProduto = async (id: number, produto: ProdutoRequest): Promise<ProdutoResponse> => {
    return put<ProdutoResponse>(`/public/produtos/atualizar/${id}`, produto);
};

export const uploadImagem = async (id: number, file: File): Promise<void> => {
    const formData = new FormData();
    formData.append('file', file);

    const token = Session.getToken();
    if (!token) {
        throw new Error('Token não encontrado');
    }

    const response = await fetch(`${config.apiUrl}/public/produtos/${id}/upload-imagem`, {
        method: 'POST',
        body: formData,
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    if (!response.ok) {
        const contentType = response.headers.get('content-type');
        let errorMessage = 'Erro ao fazer upload da imagem';
        
        try {
            if (contentType && contentType.includes('application/json')) {
                const errorData = await response.json();
                errorMessage = errorData.message || errorMessage;
            } else {
                errorMessage = await response.text() || errorMessage;
            }
        } catch (e) {
            console.error(e);
            errorMessage = response.statusText || errorMessage;
        }

        throw new Error(errorMessage);
    }
};

export const fetchFilteredProdutos = async (filterCriteria: {
    nome?: string;
    genero?: string;
    tamanho?: string;
    precoMin?: string;
    precoMax?: string;
}): Promise<ProdutoResponse[]> => {
    const queryParams = new URLSearchParams();

    if (filterCriteria.nome) queryParams.append('nome', filterCriteria.nome);
    if (filterCriteria.genero) queryParams.append('genero', filterCriteria.genero);
    if (filterCriteria.tamanho) queryParams.append('tamanho', filterCriteria.tamanho);
    if (filterCriteria.precoMin) queryParams.append('precoMin', filterCriteria.precoMin);
    if (filterCriteria.precoMax) queryParams.append('precoMax', filterCriteria.precoMax);

    return get<ProdutoResponse[]>(`/public/produtos/filtrar?${queryParams.toString()}`);
};

export type { ProdutoRequest, ProdutoResponse };

