'use client';

import { useState } from 'react';
import { listarPedidos, PedidoModel } from '@/services/Pedido';
import DetalhesPedido from '@/components/DetalhesPedido';
import CircularProgress from '@mui/material/CircularProgress';
import CreatePedidoModal from '@/components/CreatePedidoModal';

const PedidosPage = () => {
    const [pedidos, setPedidos] = useState<PedidoModel[]>([]);
    const [loading, setLoading] = useState(false);
    const [cpf, setCpf] = useState('');
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    const fetchPedidos = async (cpf: string) => {
        setLoading(true);
        try {
            const pedidosData = await listarPedidos(cpf);
            setPedidos(pedidosData);
        } catch (error) {
            console.error('Erro ao listar pedidos:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCpfChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setCpf(event.target.value);
    };

    const handleFetchPedidos = () => {
        if (cpf) {
            fetchPedidos(cpf);
        } else {
            console.error('CPF is required');
        }
    };

    const handlePedidoCreated = (newPedido: PedidoModel) => {
        setPedidos([...pedidos, newPedido]);
    };

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Lista de Pedidos</h1>
                <div className="mb-6 flex items-center">
                    <input
                        type="text"
                        value={cpf}
                        onChange={handleCpfChange}
                        placeholder="Digite o CPF"
                        className="mr-4 p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                        onClick={handleFetchPedidos}
                        className="py-2 px-4 text-white bg-blue-500 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        Buscar Pedidos
                    </button>
                    <button
                        onClick={() => setIsCreateModalOpen(true)}
                        className="ml-4 py-2 px-4 text-white bg-green-500 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                        Criar Pedido
                    </button>
                </div>
                {loading ? (
                    <div className="flex justify-center items-center">
                        <CircularProgress />
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {pedidos.map(pedido => (
                            <DetalhesPedido key={pedido.id} pedido={pedido} onStatusUpdate={() => {}} />
                        ))}
                    </div>
                )}
            </div>
            <CreatePedidoModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onPedidoCreated={handlePedidoCreated}
            />
        </div>
    );
};

export default PedidosPage;