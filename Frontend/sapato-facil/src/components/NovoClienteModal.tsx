'use client';

import { useState } from 'react';
import { createUser, UserResponse } from '@/services/Usuario';
import { ApiError } from '@/services/ApiClient';
import Swal from 'sweetalert2';

interface NovoClienteModalProps {
    onClose: () => void;
    onClienteCreated: (cliente: UserResponse) => void;
}

export default function NovoClienteModal({ onClose, onClienteCreated }: NovoClienteModalProps) {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        nome: '',
        cpf: '',
        email: '',
        password: '',
        roleEnum: 'CLIENTE'
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            formData.roleEnum = 'CLIENTE';
            const response = await createUser(formData);
            if (response.sucesso) {
                const novoCliente: UserResponse = {
                    id: response.id!,
                    nome: formData.nome,
                    cpf: formData.cpf,
                    email: formData.email,
                    senha: '',
                    role: 'CLIENTE'
                };
                onClienteCreated(novoCliente);
                Swal.fire({
                    icon: 'success',
                    title: 'Cliente criado com sucesso!',
                    showConfirmButton: false,
                    timer: 1500
                });
            } else {
                throw new Error(response.mensagem || 'Erro ao criar cliente');
            }
        } catch (err) {
            let errorMessage = 'Erro ao criar cliente';
            if (err instanceof ApiError) {
                errorMessage = err.message;
            } else if (err instanceof Error) {
                errorMessage = err.message;
            }
            Swal.fire({
                icon: 'error',
                title: 'Erro',
                text: errorMessage
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-8 max-w-md w-full">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold">Novo Cliente</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        ✕
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Nome
                        </label>
                        <input
                            type="text"
                            name="nome"
                            value={formData.nome}
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            CPF
                        </label>
                        <input
                            type="text"
                            name="cpf"
                            value={formData.cpf}
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Email
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Senha
                        </label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
                            required
                        />
                    </div>

                    <div className="flex justify-end space-x-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 border rounded text-gray-600 hover:bg-gray-100"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-blue-300"
                        >
                            {loading ? 'Criando...' : 'Criar Cliente'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
} 