"use client";

import { useEffect, useState } from 'react';
import { getProdutos, ProdutoResponse } from '@/services/Produto';
import Link from 'next/link';
import Card from '@/components/Card';
import BackButton from '@/components/BackButton';
import ReestoqueModal from '@/components/ReestoqueModal';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import Tooltip from '@mui/material/Tooltip';
import { ApiError } from '@/services/ApiClient';

export default function GerenciarProdutos() {
    const [produtos, setProdutos] = useState<ProdutoResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isReestoqueModalOpen, setIsReestoqueModalOpen] = useState(false);
    const [selectedProdutoId, setSelectedProdutoId] = useState<number | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [produtosData] = await Promise.all([
                    getProdutos(),
                ]);
                setProdutos(produtosData);
            } catch (err) {
                if (err instanceof ApiError) {
                    setError(err.message);
                } else {
                    setError('Erro ao carregar dados');
                }
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleReestoqueClick = (produtoId: number) => {
        setSelectedProdutoId(produtoId);
        setIsReestoqueModalOpen(true);
    };

    const handleReestoqueClose = () => {
        setIsReestoqueModalOpen(false);
        setSelectedProdutoId(null);
    };

    if (loading) return <div className="flex justify-center items-center h-screen">Carregando...</div>;
    if (error) return <div className="flex justify-center items-center h-screen">{error}</div>;

    return (
        <div className="container mx-auto p-4">
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center">
                    <BackButton />
                    <h1 className="text-3xl font-bold ml-8">Gerenciar Produtos</h1>
                </div>
                <Link
                    href="/produtos/gerenciar/novo"
                    className="flex items-center space-x-2 bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
                >
                    <AddCircleOutlineIcon />
                    <span>Novo Produto</span>
                </Link>
            </div>

            <Card>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-50 dark:bg-gray-800">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    ID
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    Nome
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    Preço
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    Estoque
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    Gênero
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    Tamanho
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    Ações
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-900 dark:divide-gray-700">
                            {produtos.map((produto) => (
                                <tr key={produto.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">
                                        {produto.id}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">
                                        {produto.nome}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">
                                        R$ {produto.valor.toFixed(2)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">
                                        {produto.quantidadeEstoque}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">
                                        {produto.genero}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">
                                        {produto.tamanho}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                        <Tooltip title="Editar">
                                            <Link href={`/produtos/gerenciar/editar/${produto.id}`}>
                                                <EditIcon className="text-blue-500 hover:text-blue-700 cursor-pointer" />
                                            </Link>
                                        </Tooltip>
                                        <Tooltip title="Solicitar Reestoque">
                                            <LocalShippingIcon
                                                className="text-green-500 hover:text-green-700 cursor-pointer"
                                                onClick={() => handleReestoqueClick(produto.id)}
                                            />
                                        </Tooltip>
                                        <Tooltip title="Excluir">
                                            <DeleteIcon className="text-red-500 hover:text-red-700 cursor-pointer" />
                                        </Tooltip>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>

            {selectedProdutoId && (
                <ReestoqueModal
                    isOpen={isReestoqueModalOpen}
                    onClose={handleReestoqueClose}
                    produtoId={selectedProdutoId}
                />
            )}
        </div>
    );
}
