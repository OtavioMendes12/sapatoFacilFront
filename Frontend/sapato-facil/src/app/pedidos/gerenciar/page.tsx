'use client';

import { useState } from 'react';
import Link from 'next/link';
import { PedidoModel, listarPedidos, finalizarPedido } from '@/services/Pedido';
import { ApiError } from '@/services/ApiClient';
import Card from '@/components/Card';
import BackButton from '@/components/BackButton';
import Swal from 'sweetalert2';

export default function GerenciarPedidos() {
    const [pedidos, setPedidos] = useState<PedidoModel[]>([]);
    const [loading, setLoading] = useState(false);
    const [cpf, setCpf] = useState('');

    const fetchPedidos = async (searchCpf: string) => {
        setLoading(true);
        try {
            const pedidosData = await listarPedidos(searchCpf);
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

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (cpf.trim()) {
            fetchPedidos(cpf.trim());
        }
    };

    const handleFinalizarPedido = async (pedidoId: number) => {
        try {
            await finalizarPedido(pedidoId);
            await Swal.fire({
                icon: 'success',
                title: 'Pedido finalizado com sucesso!',
                showConfirmButton: false,
                timer: 1500
            });
            if (cpf.trim()) {
                fetchPedidos(cpf.trim());
            }
        } catch (err) {
            let errorMessage = 'Erro ao finalizar pedido';
            if (err instanceof ApiError) {
                errorMessage = err.message;
            }
            Swal.fire({
                icon: 'error',
                title: 'Erro',
                text: errorMessage
            });
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
                    <h1 className="text-3xl font-bold dark:text-white flex-1 text-center">Gerenciar Pedidos</h1>
                    <div className="w-10"></div>
                </div>

                <div className="flex justify-between items-center mb-6">
                    <form onSubmit={handleSearch} className="flex-1 max-w-md">
                        <div className="flex space-x-2">
                            <input
                                type="text"
                                value={cpf}
                                onChange={(e) => setCpf(e.target.value)}
                                placeholder="Buscar por CPF"
                                className="flex-1 p-2 border rounded bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <button
                                type="submit"
                                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                            >
                                Buscar
                            </button>
                        </div>
                    </form>
                    <Link
                        href="/pedidos/gerenciar/criar"
                        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 ml-4"
                    >
                        Novo Pedido
                    </Link>
                </div>

                {loading ? (
                    <div className="text-center dark:text-gray-300">Carregando pedidos...</div>
                ) : pedidos.length === 0 ? (
                    <div className="text-center dark:text-gray-300">
                        {cpf.trim() ? 'Nenhum pedido encontrado para este CPF' : 'Digite um CPF para buscar pedidos'}
                    </div>
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
                                            Pedido #{pedido.id}
                                        </h3>
                                        <p className="text-sm dark:text-gray-300">
                                            Cliente: {pedido.clienteNome}
                                        </p>
                                        <p className="text-sm dark:text-gray-300">
                                            CPF: {pedido.clienteCpf}
                                        </p>
                                        <p className="text-sm dark:text-gray-300">
                                            Data do Pedido: {formatarData(pedido.dataPedido)}
                                        </p>
                                        {pedido.dataVenda && (
                                            <p className="text-sm dark:text-gray-300">
                                                Data da Venda: {formatarData(pedido.dataVenda)}
                                            </p>
                                        )}
                                        <p className="text-sm dark:text-gray-300">
                                            Status: {pedido.status}
                                        </p>
                                        <p className="font-semibold dark:text-white">
                                            Total: R$ {pedido.total.toFixed(2)}
                                        </p>
                                        <div className="mt-2">
                                            <p className="text-sm font-medium dark:text-gray-300">
                                                Endereço de Entrega:
                                            </p>
                                            <p className="text-sm dark:text-gray-300">
                                                {pedido.entrega.rua}, {pedido.entrega.cidade} - {pedido.entrega.estado}
                                            </p>
                                            <p className="text-sm dark:text-gray-300">
                                                CEP: {pedido.entrega.cep}
                                            </p>
                                            {pedido.entrega.complemento && (
                                                <p className="text-sm dark:text-gray-300">
                                                    Complemento: {pedido.entrega.complemento}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex space-x-2">
                                        {pedido.status === 'Pendente' && (
                                            <button
                                                onClick={() => handleFinalizarPedido(pedido.id)}
                                                className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                                            >
                                                Finalizar
                                            </button>
                                        )}
                                        <Link
                                            href={`/pedidos/${pedido.id}`}
                                            className="bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600"
                                        >
                                            Detalhes
                                        </Link>
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