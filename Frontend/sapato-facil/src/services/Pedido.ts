import { get, post } from './ApiClient';
import { ProdutoResponse } from './Produto';

export interface EntregaModel {
    id?: number;
    rua: string;
    cidade: string;
    estado: string;
    cep: string;
    complemento: string;
    telefoneContato: string;
}

export interface PedidoModel {
    id: number;
    clienteNome: string;
    clienteCpf: string;
    produtos: ProdutoResponse[];
    entrega: EntregaModel;
    dataPedido: string;
    dataVenda: string | null;
    total: number;
    status: string;
}

export const criarPedido = async (clienteId: number, entregaModel: EntregaModel): Promise<PedidoModel> => {
    return post<PedidoModel>(`/private/pedidos/criar/${clienteId}`, entregaModel);
};

export const gerarRelatorioVendasFinalizadas = async (inicio: string, fim: string): Promise<PedidoModel[]> => {
    return get<PedidoModel[]>(`/private/pedidos/relatorio-vendas-finalizadas?inicio=${inicio}&fim=${fim}`);
};

export const listarPedidos = async (cpf: string): Promise<PedidoModel[]> => {
    return get<PedidoModel[]>(`/private/pedidos/listar/${cpf}`);
};

export const alterarEntrega = async (pedidoId: number, entregaModel: EntregaModel): Promise<PedidoModel> => {
    return post<PedidoModel>(`/private/pedidos/alterarEntrega/${pedidoId}`, entregaModel);
};

export const finalizarPedido = async (pedidoId: number): Promise<PedidoModel> => {
    return post<PedidoModel>(`/private/pedidos/finalizar/${pedidoId}`, null);
};
