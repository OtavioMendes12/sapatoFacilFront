'use client';

import { useState, useEffect } from 'react';
import { listarReestoquePedidos, ReestoquePedido } from '@/services/Reestoque';
import { ApiError } from '@/services/ApiClient';
import Card from '@/components/Card';
import BackButton from '@/components/BackButton';
import Swal from 'sweetalert2';

export default function GerenciarReestoque() {
    const [pedidos, setPedidos] = useState<ReestoquePedido[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPedidos();
    }, []);

    const fetchPedidos = async () => {
        try {
            const pedidosData = await listarReestoquePedidos();
            setPedidos(pedidosData);
        } catch (err) {
            if (err instanceof ApiError) {
                Swal.fire({
                    icon: 'error',
                    title: 'Erro',
                    text: err.message
                });
            }
        } finally {
            setLoading(false);
        }
    };

    const formatarData = (data: string) => {
        return new Date(data).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <Card>
                <div className="flex items-center mb-8">
                    <BackButton />
                    <h1 className="text-3xl font-bold dark:text-white flex-1 text-center">Gerenciar Reestoque</h1>
                    <div className="w-10"></div>
                </div>

                {loading ? (
                    <div className="text-center dark:text-gray-300">Carregando pedidos de reestoque...</div>
                ) : pedidos.length === 0 ? (
                    <div className="text-center dark:text-gray-300">Nenhum pedido de reestoque encontrado</div>
                ) : (
                    <div className="space-y-4">
                        {pedidos.map(pedido => (
                            <div
                                key={pedido.id}
                                className="border dark:border-gray-600 rounded-lg p-4 dark:bg-gray-700"
                            >
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="font-semibold dark:text-white">
                                            Pedido de Reestoque #{pedido.id}
                                        </h3>
                                        <p className="text-sm dark:text-gray-300">
                                            Produto: {pedido.produto.nome}
                                        </p>
                                        <p className="text-sm dark:text-gray-300">
                                            Quantidade Solicitada: {pedido.quantidadeSolicitada}
                                        </p>
                                        <p className="text-sm dark:text-gray-300">
                                            Data da Solicitação: {formatarData(pedido.dataSolicitacao)}
                                        </p>
                                        <div className="mt-2">
                                            <span className="text-sm font-medium dark:text-gray-300">
                                                Detalhes do Produto:
                                            </span>
                                            <ul className="list-disc list-inside text-sm dark:text-gray-300 ml-4">
                                                <li>Tamanho: {pedido.produto.tamanho}</li>
                                                <li>Cor: {pedido.produto.cor}</li>
                                                <li>Gênero: {pedido.produto.genero}</li>
                                                <li>Estoque Atual: {pedido.produto.quantidadeEstoque}</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </Card>
        </div>
    );
} 