import { get, post, del } from './ApiClient';
import { ProdutoResponse } from './Produto';
import { Session } from './Session';

export type CarrinhoResponse = Array<ProdutoResponse>;

export const getCarrinho = async (): Promise<CarrinhoResponse> => {
    const cpf = Session.getUserData()?.cpf;
    if (!cpf) {
        throw new Error('User CPF not found in session');
    }
    return get<CarrinhoResponse>(`/private/carrinho/listar/${cpf}`);
};

export const adicionarAoCarrinho = async (produtoId: number): Promise<boolean> => {
    const userId = Session.getUserData()?.id;
    if (!userId) {
        throw new Error('User ID not found in session');
    }
    await post<void>(`/private/carrinho/adicionar/${userId}/${produtoId}`);
    return true;
};

export const removerDoCarrinho = async (produtoId: number): Promise<boolean> => {
    const cpf = Session.getUserData()?.cpf;
    if (!cpf) {
        throw new Error('User CPF not found in session');
    }
    await del<void>(`/private/carrinho/remover/${cpf}/${produtoId}`);
    return true;
};
