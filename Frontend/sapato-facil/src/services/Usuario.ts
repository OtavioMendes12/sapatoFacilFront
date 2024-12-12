import { get, post, put, del } from './ApiClient';

export interface UserRequest {
    id?: number;
    cpf?: string;
    nome?: string;
    email?: string;
    password?: string;
    isAdm?: boolean;
}

export interface RegisterResponse {
    sucesso: boolean;
    mensagem?: string;
    token?: string;
}

export interface UserResponse {
    id: number;
    cpf: string;
    nome: string;
    email: string;
    senha: string;
    role: string;
}

export const createUser = async (userRequest: UserRequest): Promise<RegisterResponse> => {
    return post<RegisterResponse>('/public/usuarios/cadastrar', userRequest);
};

export const getUser = async (id: number): Promise<UserResponse> => {
    return get<UserResponse>(`/public/usuarios/buscar/${id}`);
};

export const getUsers = async (): Promise<UserResponse[]> => {
    return get<UserResponse[]>('/public/usuarios/listar');
};

export const updateUser = async (id: number, userRequest: UserRequest): Promise<UserResponse> => {
    return put<UserResponse>('/public/usuarios/atualizar', userRequest);
};

export const deleteUser = async (id: number): Promise<UserResponse> => {
    return del<UserResponse>(`/public/usuarios/${id}`);
};
