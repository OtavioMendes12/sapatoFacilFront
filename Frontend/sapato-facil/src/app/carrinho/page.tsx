"use client";

import { useEffect, useState } from 'react';
import { getCarrinho } from '@/services/Carrinho';
import { ProdutoResponse } from '@/services/Produto';
import DetalhesProduto from '@/components/DetalhesProduto';
import Card from '@/components/Card';
import EntregaModal from '@/components/EntregaModal';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import Link from 'next/link';
import BackButton from '@/components/BackButton';

export default function Carrinho() {
    const [produtos, setProdutos] = useState<ProdutoResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isEntregaModalOpen, setIsEntregaModalOpen] = useState(false);

    useEffect(() => {
        async function fetchProdutos() {
            try {
                const produtosData = await getCarrinho();
                setProdutos(produtosData);
            } catch (err) {
                console.error(err);
                setError('Erro ao carregar os produtos');
            } finally {
                setLoading(false);
            }
        }

        fetchProdutos();
    }, []);

    const removeProdutoFromList = (produtoId: number) => {
        setProdutos((prevProdutos) => prevProdutos.filter(produto => produto.id !== produtoId));
    };

    const totalPrice = produtos.reduce((total, item) => total + item.valor, 0);

    const handleFinalizeOrder = () => {
        setIsEntregaModalOpen(true);
    };

    const handleEntregaSubmit = () => {
        setIsEntregaModalOpen(false);
    };

    if (loading) return <div className="flex justify-center items-center h-screen">Carregando...</div>;
    if (error) return <div className="flex justify-center items-center h-screen">{error}</div>;

    return (
        <div className="container mx-auto p-4">
            <div className="relative flex items-center mb-6">
                <BackButton className="absolute left-0" />
                <h1 className="flex-grow text-3xl font-bold text-center text-gray-900 dark:text-gray-100">Carrinho</h1>
            </div>
            <Card className='p-4'>
                <div className="flex flex-row w-full justify-between">
                    {produtos.length === 0 && (
                        <div className="flex-grow col-span-2 p-4 text-center bg-white border border-gray-200 rounded-lg shadow sm:p-8 dark:bg-gray-800 dark:border-gray-700">
                            <h5 className="mb-2 text-3xl font-bold text-gray-900 dark:text-white">Nenhum produto no carrinho</h5>
                            <p className="mb-5 text-base text-gray-500 sm:text-lg dark:text-gray-400">Adicione produtos ao carrinho para continuar</p>
                            <div className="items-center justify-center space-y-4 sm:flex sm:space-y-0 sm:space-x-4 rtl:space-x-reverse">
                                <Link href="/produtos" className="mt-4 flex items-center px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 dark:bg-blue-400 dark:hover:bg-blue-500">
                                    Visualizar produtos <ArrowForwardIcon className="ml-2" />
                                </Link>
                            </div>
                        </div>
                    )}
                    {produtos.length > 0 && (
                        <>
                            <div className="grid grid-cols-2 gap-6">
                                {produtos.map((produto) => (
                                    <DetalhesProduto key={produto.id} produto={produto} isInCart={true} onRemove={removeProdutoFromList} />
                                ))}
                            </div>
                            <div className="w-px bg-gray-300 dark:bg-gray-700 mx-4"></div>
                            <div className="flex flex-col p-4 bg-white dark:bg-gray-800 flex-grow">
                                <div className="flex justify-between">
                                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">Quantidade de itens:</h2>
                                    <span className="text-2xl font-bold text-gray-900 dark:text-white">{produtos.length}</span>
                                </div>
                                <div className="flex justify-between">
                                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">Total:</h2>
                                    <span className="text-2xl font-bold text-gray-900 dark:text-white">R$ {totalPrice.toFixed(2)}</span>
                                </div>
                                <div className="mt-4 flex justify-center">
                                    <button 
                                        className="px-6 py-2 bg-blue-500 text-white font-bold rounded hover:bg-blue-600 dark:bg-blue-400 dark:hover:bg-blue-500"
                                        onClick={handleFinalizeOrder}
                                    >
                                        Finalizar Pedido
                                    </button>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </Card>
            <EntregaModal 
                isOpen={isEntregaModalOpen} 
                onClose={() => setIsEntregaModalOpen(false)} 
                onSubmit={handleEntregaSubmit} 
            />
        </div>
    );
}
