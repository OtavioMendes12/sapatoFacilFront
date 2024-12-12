/* eslint-disable @next/next/no-img-element */
import { useState } from 'react';
import { ProdutoResponse } from '@/services/Produto';
import { adicionarAoCarrinho, removerDoCarrinho } from '@/services/Carrinho';
import Link from 'next/link';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckIcon from '@mui/icons-material/Check';
import CircularProgress from '@mui/material/CircularProgress';
import Swal from 'sweetalert2';
import config from '@/config';

interface DetalhesProdutoProps {
    produto: ProdutoResponse;
    isInCart: boolean;
    hideActions?: boolean;
    onRemove: (produtoId: number) => void;
}

const DetalhesProduto = ({ produto, isInCart: isInCartInicial, hideActions = false, onRemove = () => {} }: DetalhesProdutoProps) => {
    const [isInCart, setIsInCart] = useState(isInCartInicial);
    const [isHovered, setIsHovered] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleAddToCart = async () => {
        setLoading(true);
        try {
            await adicionarAoCarrinho(produto.id);
            Swal.fire({
                icon: 'success',
                title: 'Produto adicionado ao carrinho!',
                showConfirmButton: false,
                timer: 1500
            });
            setIsInCart(true);
        } catch (error) {
            console.error('Erro ao adicionar produto ao carrinho:', error);
            Swal.fire({
                icon: 'error',
                title: 'Erro ao adicionar produto ao carrinho. Tente novamente.',
                showConfirmButton: true
            });
        } finally {
            setLoading(false);
        }
    };

    const handleRemoveFromCart = async () => {
        setLoading(true);
        try {
            await removerDoCarrinho(produto.id);
            Swal.fire({
                icon: 'success',
                title: 'Produto removido do carrinho!',
                showConfirmButton: false,
                timer: 1500
            });
            setIsInCart(false);
            onRemove(produto.id);
        } catch (error) {
            console.error('Erro ao remover produto do carrinho:', error);
            Swal.fire({
                icon: 'error',
                title: 'Erro ao remover produto do carrinho. Tente novamente.',
                showConfirmButton: true
            });
        } finally {
            setLoading(false);
        }
    };

    const imageUrl = `${config.apiUrl}/public/produtos/${produto.id}/foto`;

    return (
        <div className="max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
            <a href="#">
                <img className="p-8 rounded-t-lg" src={imageUrl} alt={produto.nome} />
            </a>
            <div className="px-5 pb-5">
                <Link href={`/produtos/${produto.id}`}>
                    <h5 className="text-xl font-semibold tracking-tight text-gray-900 dark:text-white">{produto.nome}</h5>
                </Link>
                <div className="flex items-center mt-2.5 mb-5">
                    <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded dark:bg-blue-200 dark:text-blue-800">{produto.genero}</span>
                </div>

                <div className="flex flex-col justify-between">
                    <span className="text-3xl font-bold text-gray-900 dark:text-white">R$ {produto.valor.toFixed(2)}</span>
                    {!hideActions && (
                        <button
                            onClick={isInCart ? handleRemoveFromCart : handleAddToCart}
                            onMouseEnter={() => setIsHovered(true)}
                            onMouseLeave={() => setIsHovered(false)}
                            className={`py-2 px-4 mt-2 text-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center justify-center ${isInCart ? (isHovered ? 'bg-red-500' : 'bg-green-500') : 'bg-blue-500'}`}
                            disabled={loading}
                        >
                            {loading ? (
                                <CircularProgress size={24} className="text-white" />
                            ) : isInCart ? (
                                isHovered ? (
                                    <>
                                        <DeleteIcon className="mr-2" />
                                        Remover do Carrinho
                                    </>
                                ) : (
                                    <>
                                        <CheckIcon className="mr-2" />
                                        Adicionado ao Carrinho
                                    </>
                                )
                            ) : (
                                'Adicionar ao Carrinho'
                            )}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DetalhesProduto;
