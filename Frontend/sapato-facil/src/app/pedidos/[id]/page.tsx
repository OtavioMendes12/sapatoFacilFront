/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useState } from 'react';
import { listarPedidos, PedidoModel } from '@/services/Pedido';
import DetalhesProduto from '@/components/DetalhesProduto'; 
import { Session } from '@/services/Session';
import BackButton from '@/components/BackButton';

interface PedidoProps {
    params: { id: string };
}

const PedidoDetalhesPage = ({ params }: PedidoProps) => {
    const { id } = params;
    const [pedido, setPedido] = useState<PedidoModel | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const cpf = Session.getUserData()?.cpf;
        if (id && cpf) {
            const fetchPedido = async () => {
                try {
                    const pedidosData = await listarPedidos(cpf);
                    setPedido(pedidosData.find(p => p.id === parseInt(id as string)) || null);
                } catch (err) {
                    console.error(err);
                    setError('Erro ao carregar o pedido');
                } finally {
                    setLoading(false);
                }
            };

            fetchPedido();
        } else {
            setLoading(false);
            setError('CPF não encontrado na sessão');
        }
    }, [id]);

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('pt-BR', { dateStyle: 'medium' }).format(date);
    };

    if (loading) return <div className="flex justify-center items-center h-screen">Carregando...</div>;
    if (error) return <div className="flex justify-center items-center h-screen">{error}</div>;
    if (!pedido) return <div className="flex justify-center items-center h-screen">Pedido não encontrado</div>;

    return (
        <div className="container mx-auto p-4">
            <div className="relative flex items-center mb-6">
                <BackButton className="absolute left-0" />
                <h1 className="flex-grow text-3xl font-bold text-center text-gray-900 dark:text-gray-100">Detalhes do Pedido</h1>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-2">Pedido ID: {pedido.id}</h2>
                <p><strong>Cliente:</strong> {pedido.clienteNome}</p>
                <p><strong>Data do Pedido:</strong> {formatDate(pedido.dataPedido)}</p>
                <p><strong>Status:</strong> {pedido.status}</p>
                <p><strong>Total:</strong> R$ {pedido.total.toFixed(2)}</p>
                <h3 className="text-lg font-semibold mt-4">Produtos</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {pedido.produtos.map(produto => (
                        <DetalhesProduto hideActions key={produto.id} produto={produto} isInCart={false} onRemove={() => {}} />
                    ))}
                </div>
                <div className="mt-6">
                    <h3 className="text-lg font-semibold">QR Code para Pagamento</h3>
                    <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSiUBG3HpwTJ4YK3HplXtz4kpR_uUaVmbYbAg&s" alt="QR Code" />
                </div>
            </div>
        </div>
    );
};

export default PedidoDetalhesPage;
