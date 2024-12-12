import { get, post } from './ApiClient';
import { ProdutoResponse } from './Produto';

export interface ReestoqueRequest {
    produtoId: number;
    quantidade: number;
}

export interface ReestoquePedido {
    id: number;
    produto: ProdutoResponse;
    produtoId?: number;
    quantidade: number;
    quantidadeSolicitada?: number;
    dataSolicitacao: string;
}

export const solicitarReestoque = async (reestoqueRequest: ReestoqueRequest): Promise<ReestoquePedido> => {
    return post<ReestoquePedido>('/public/reestoque/solicitar', reestoqueRequest);
};

export const listarReestoquePedidos = async (): Promise<ReestoquePedido[]> => {
    return get<ReestoquePedido[]>('/public/reestoque/listar');
};

export type { ReestoqueRequest, ReestoquePedido }; 