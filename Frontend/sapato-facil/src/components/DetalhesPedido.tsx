import { useState } from 'react';
import { PedidoModel, finalizarPedido } from '@/services/Pedido';
import CircularProgress from '@mui/material/CircularProgress';
import Swal from 'sweetalert2';

interface DetalhesPedidoProps {
    pedido: PedidoModel;
    hideActions?: boolean;
    onStatusUpdate: (pedidoId: number, newStatus: string) => void;
}

const DetalhesPedido = ({ pedido, hideActions = false, onStatusUpdate }: DetalhesPedidoProps) => {
    const [loading, setLoading] = useState(false);

    const handleFinalizePedido = async () => {
        setLoading(true);
        try {
            const updatedPedido = await finalizarPedido(pedido.id);
            Swal.fire({
                icon: 'success',
                title: 'Pedido finalizado com sucesso!',
                showConfirmButton: false,
                timer: 1500
            });
            onStatusUpdate(pedido.id, updatedPedido.status);
        } catch (error) {
            console.error('Erro ao finalizar pedido:', error);
            Swal.fire({
                icon: 'error',
                title: 'Erro ao finalizar pedido. Tente novamente.',
                showConfirmButton: true
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 p-5">
            <h5 className="text-xl font-semibold tracking-tight text-gray-900 dark:text-white">Pedido ID: {pedido.id}</h5>
            <p className="text-gray-700 dark:text-gray-300">Cliente: {pedido.clienteNome}</p>
            <p className="text-gray-700 dark:text-gray-300">Total: R$ {pedido.total.toFixed(2)}</p>
            <p className="text-gray-700 dark:text-gray-300">Status: {pedido.status}</p>
            {!hideActions && (
                <button
                    onClick={handleFinalizePedido}
                    className="py-2 px-4 mt-2 text-white bg-blue-500 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center justify-center"
                    disabled={loading}
                >
                    {loading ? (
                        <CircularProgress size={24} className="text-white" />
                    ) : (
                    'Finalizar'
                    )}
                </button>
            )}
        </div>
    );
};

export default DetalhesPedido;
