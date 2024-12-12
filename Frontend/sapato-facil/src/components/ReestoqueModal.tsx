'use client';
import { useState, useRef, useEffect } from "react";
import Swal from 'sweetalert2';
import { solicitarReestoque, listarReestoquePedidos, ReestoqueRequest, ReestoquePedido } from '../services/Reestoque';

interface ReestoqueModalProps {
    isOpen: boolean;
    onClose: () => void;
    produtoId: number;
}

const ReestoqueModal = ({ isOpen, onClose, produtoId }: ReestoqueModalProps) => {
    const [quantidade, setQuantidade] = useState<number>(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [existingReestoque, setExistingReestoque] = useState<ReestoquePedido | null>(null);
    const modalRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
                onClose();
                setQuantidade(0);
                setExistingReestoque(null);
            }
        };

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
            fetchExistingReestoque();
        } else {
            document.removeEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen, onClose]);

    const fetchExistingReestoque = async () => {
        try {
            const reestoques = await listarReestoquePedidos();
            const reestoque = reestoques.find(r => r.produtoId === produtoId);
            setExistingReestoque(reestoque || null);
        } catch (err) {
            console.error('Erro ao buscar reestoque:', err);
        }
    };

    if (!isOpen) return null;

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setLoading(true);
        setError(null);

        const reestoqueRequest: ReestoqueRequest = {
            produtoId,
            quantidade,
        };

        try {
            await solicitarReestoque(reestoqueRequest);
            Swal.fire({
                icon: 'success',
                title: 'Reestoque solicitado com sucesso!',
                showConfirmButton: false,
                timer: 1500,
                timerProgressBar: true
            }).then(() => {
                onClose();
            });
        } catch (err) {
            setError((err as Error).message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div ref={modalRef} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-2xl font-bold mb-4">Reestoque</h2>
                {existingReestoque ? (
                    <div>
                        <p>Produto ID: {existingReestoque.produtoId}</p>
                        <p>Quantidade: {existingReestoque.quantidade}</p>
                        <p>Status: {existingReestoque.status}</p>
                        <p>Data de Solicitação: {existingReestoque.dataSolicitacao}</p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label className="block text-gray-700 dark:text-gray-300 mb-2" htmlFor="quantidade">Quantidade</label>
                            <input
                                type="number"
                                id="quantidade"
                                name="quantidade"
                                className="w-full p-2 border border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
                                value={quantidade}
                                onChange={(e) => setQuantidade(Number(e.target.value))}
                                required
                            />
                        </div>
                        {error && <div className="text-red-500 mb-4">{error}</div>}
                        <div className="flex justify-end">
                            <button
                                type="button"
                                onClick={onClose}
                                className="mr-4 px-4 py-2 bg-gray-200 dark:bg-gray-600 rounded"
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 bg-blue-500 text-white rounded"
                                disabled={loading}
                            >
                                {loading ? 'Carregando...' : 'Solicitar'}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

export default ReestoqueModal; 