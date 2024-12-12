'use client';
import React, { useState, useEffect, useRef } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import { criarPedido } from '../services/Pedido'; // Ensure this import is correct
import { Session } from '../services/Session'; // Import session to get user ID

interface EntregaFormData {
    rua: string;
    cidade: string;
    estado: string;
    cep: string;
    complemento: string;
    telefoneContato: string;
}

interface EntregaModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (formData: EntregaFormData) => void;
}

const EntregaModal: React.FC<EntregaModalProps> = ({ isOpen, onClose, onSubmit }) => {
    const [formData, setFormData] = useState<EntregaFormData>({
        rua: '',
        cidade: '',
        estado: '',
        cep: '',
        complemento: '',
        telefoneContato: '',
    });

    const [isFetching, setIsFetching] = useState(false);
    const [apiError, setApiError] = useState<string | null>(null);
    const [fieldsDisabled, setFieldsDisabled] = useState(true);
    const [loading, setLoading] = useState(false);

    const modalRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        } else {
            document.removeEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen, onClose]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });

        if (name === 'cep' && value.length === 8) {
            setIsFetching(true);
            setApiError(null);
            setFieldsDisabled(true);
            fetch(`https://viacep.com.br/ws/${value}/json/`)
                .then(response => response.json())
                .then(data => {
                    if (!data.erro) {
                        setFormData(prevData => ({
                            ...prevData,
                            rua: data.logradouro || '',
                            cidade: data.localidade || '',
                            estado: data.uf || '',
                        }));
                    } else {
                        setApiError('CEP não encontrado.');
                    }
                })
                .catch(() => {
                    setApiError('Erro ao buscar CEP.');
                })
                .finally(() => {
                    setIsFetching(false);
                    setFieldsDisabled(false);
                });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const clienteId = Session.getUserId(); // Retrieve the user ID from the session
            await criarPedido(Number(clienteId), formData); // Use the user ID as clienteId
            onSubmit(formData);
            onClose();
        } catch (error) {
            console.error('Erro ao enviar pedido:', error);
            // Optionally, show a notification to the user
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div ref={modalRef} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Informações de Entrega</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-gray-700 dark:text-gray-300">CEP</label>
                        <input
                            type="text"
                            name="cep"
                            value={formData.cep}
                            onChange={handleChange}
                            maxLength={8}
                            className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
                            required
                        />
                    </div>
                    {isFetching && <div className="text-center"><CircularProgress size={24} className="text-blue-500" /></div>}
                    <div>
                        <label className="block text-gray-700 dark:text-gray-300">Rua</label>
                        <input
                            type="text"
                            name="rua"
                            value={formData.rua}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
                            disabled={fieldsDisabled}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 dark:text-gray-300">Cidade</label>
                        <input
                            type="text"
                            name="cidade"
                            value={formData.cidade}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
                            disabled={fieldsDisabled}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 dark:text-gray-300">Estado</label>
                        <input
                            type="text"
                            name="estado"
                            value={formData.estado}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
                            disabled={fieldsDisabled}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 dark:text-gray-300">Complemento</label>
                        <input
                            type="text"
                            name="complemento"
                            value={formData.complemento}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
                            disabled={fieldsDisabled}
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 dark:text-gray-300">Telefone de Contato</label>
                        <input
                            type="text"
                            name="telefoneContato"
                            value={formData.telefoneContato}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
                            required
                        />
                    </div>
                    {apiError && <div className="text-red-500">{apiError}</div>}
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
                            className="px-4 py-2 bg-blue-500 text-white rounded flex items-center justify-center"
                            disabled={fieldsDisabled || loading}
                        >
                            {loading ? <CircularProgress size={24} className="text-white" /> : 'Enviar'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EntregaModal;
