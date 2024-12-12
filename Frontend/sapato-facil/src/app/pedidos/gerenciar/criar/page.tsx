'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getUsers, UserResponse } from '@/services/Usuario';
import { getProdutos, ProdutoResponse } from '@/services/Produto';
import { criarPedido, EntregaModel } from '@/services/Pedido';
import { ApiError } from '@/services/ApiClient';
import Card from '@/components/Card';
import BackButton from '@/components/BackButton';
import NovoClienteModal from '@/components/NovoClienteModal';
import Swal from 'sweetalert2';

interface SelectedProduct {
    produto: ProdutoResponse;
    quantidade: number;
}

export default function CriarPedidoManual() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [clientes, setClientes] = useState<UserResponse[]>([]);
    const [produtos, setProdutos] = useState<ProdutoResponse[]>([]);
    const [selectedClientId, setSelectedClientId] = useState<number | ''>('');
    const [selectedProducts, setSelectedProducts] = useState<SelectedProduct[]>([]);
    const [showNovoClienteModal, setShowNovoClienteModal] = useState(false);
    const [entrega, setEntrega] = useState<EntregaModel>({
        rua: '',
        cidade: '',
        estado: '',
        cep: '',
        complemento: '',
        telefoneContato: ''
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [clientesData, produtosData] = await Promise.all([
                    getUsers(),
                    getProdutos()
                ]);
                setClientes(clientesData);
                setProdutos(produtosData);
            } catch (err) {
                if (err instanceof ApiError) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Erro',
                        text: err.message
                    });
                }
            }
        };

        fetchData();
    }, []);

    const handleAddProduct = (produtoId: number) => {
        const produto = produtos.find(p => p.id === produtoId);
        if (!produto) return;

        setSelectedProducts(prev => {
            const existing = prev.find(p => p.produto.id === produtoId);
            if (existing) {
                return prev.map(p => 
                    p.produto.id === produtoId 
                        ? { ...p, quantidade: p.quantidade + 1 }
                        : p
                );
            }
            return [...prev, { produto, quantidade: 1 }];
        });
    };

    const handleRemoveProduct = (produtoId: number) => {
        setSelectedProducts(prev => prev.filter(p => p.produto.id !== produtoId));
    };

    const handleQuantityChange = (produtoId: number, quantidade: number) => {
        if (quantidade < 1) return;
        setSelectedProducts(prev => 
            prev.map(p => 
                p.produto.id === produtoId 
                    ? { ...p, quantidade }
                    : p
            )
        );
    };

    const handleEntregaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setEntrega(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedClientId) {
            Swal.fire({
                icon: 'error',
                title: 'Erro',
                text: 'Selecione um cliente'
            });
            return;
        }

        if (selectedProducts.length === 0) {
            Swal.fire({
                icon: 'error',
                title: 'Erro',
                text: 'Adicione pelo menos um produto'
            });
            return;
        }

        setLoading(true);
        try {
            await criarPedido(Number(selectedClientId), entrega);
            await Swal.fire({
                icon: 'success',
                title: 'Pedido criado com sucesso!',
                showConfirmButton: false,
                timer: 1500
            });
            router.push('/pedidos');
        } catch (err) {
            let errorMessage = 'Erro ao criar pedido';
            if (err instanceof ApiError) {
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

    const calcularTotal = () => {
        return selectedProducts.reduce((total, { produto, quantidade }) => 
            total + (produto.valor * quantidade), 0
        );
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <Card>
                <div className="flex items-center mb-8">
                    <BackButton />
                    <h1 className="text-3xl font-bold dark:text-white flex-1 text-center">Criar Pedido Manual</h1>
                    <div className="w-10"></div> {/* Spacer to balance the back button */}
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Cliente Selection */}
                    <div className="flex items-center space-x-4">
                        <div className="flex-grow">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Cliente
                            </label>
                            <select
                                value={selectedClientId}
                                onChange={(e) => setSelectedClientId(Number(e.target.value))}
                                className="w-full p-2 border rounded bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">Selecione um cliente</option>
                                {clientes.map(cliente => (
                                    <option key={cliente.id} value={cliente.id}>
                                        {cliente.nome} ({cliente.cpf})
                                    </option>
                                ))}
                            </select>
                        </div>
                        <button
                            type="button"
                            onClick={() => setShowNovoClienteModal(true)}
                            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 mt-6"
                        >
                            Novo Cliente
                        </button>
                    </div>

                    {/* Produtos Selection */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Adicionar Produtos
                        </label>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {produtos.map(produto => (
                                <div key={produto.id} className="border dark:border-gray-600 p-4 rounded dark:bg-gray-700">
                                    <h3 className="font-semibold dark:text-white">{produto.nome}</h3>
                                    <p className="dark:text-gray-300">R$ {produto.valor.toFixed(2)}</p>
                                    <p className="dark:text-gray-300">Estoque: {produto.quantidadeEstoque}</p>
                                    <button
                                        type="button"
                                        onClick={() => handleAddProduct(produto.id)}
                                        className="bg-blue-500 text-white px-3 py-1 rounded mt-2 hover:bg-blue-600"
                                    >
                                        Adicionar
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Selected Products */}
                    {selectedProducts.length > 0 && (
                        <div>
                            <h2 className="text-lg font-semibold mb-4 dark:text-white">Produtos Selecionados</h2>
                            <div className="space-y-4">
                                {selectedProducts.map(({ produto, quantidade }) => (
                                    <div key={produto.id} className="flex items-center justify-between border dark:border-gray-600 p-4 rounded dark:bg-gray-700">
                                        <div>
                                            <h3 className="font-semibold dark:text-white">{produto.nome}</h3>
                                            <p className="dark:text-gray-300">R$ {produto.valor.toFixed(2)}</p>
                                        </div>
                                        <div className="flex items-center space-x-4">
                                            <input
                                                type="number"
                                                value={quantidade}
                                                onChange={(e) => handleQuantityChange(produto.id, Number(e.target.value))}
                                                min="1"
                                                className="w-20 p-1 border rounded bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveProduct(produto.id)}
                                                className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                                            >
                                                Remover
                                            </button>
                                        </div>
                                    </div>
                                ))}
                                <div className="text-right text-xl font-bold dark:text-white">
                                    Total: R$ {calcularTotal().toFixed(2)}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Endereço de Entrega */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Rua
                            </label>
                            <input
                                type="text"
                                name="rua"
                                value={entrega.rua}
                                onChange={handleEntregaChange}
                                className="w-full p-2 border rounded bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Cidade
                            </label>
                            <input
                                type="text"
                                name="cidade"
                                value={entrega.cidade}
                                onChange={handleEntregaChange}
                                className="w-full p-2 border rounded bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Estado
                            </label>
                            <input
                                type="text"
                                name="estado"
                                value={entrega.estado}
                                onChange={handleEntregaChange}
                                className="w-full p-2 border rounded bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                CEP
                            </label>
                            <input
                                type="text"
                                name="cep"
                                value={entrega.cep}
                                onChange={handleEntregaChange}
                                className="w-full p-2 border rounded bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Complemento
                            </label>
                            <input
                                type="text"
                                name="complemento"
                                value={entrega.complemento}
                                onChange={handleEntregaChange}
                                className="w-full p-2 border rounded bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Telefone
                            </label>
                            <input
                                type="text"
                                name="telefoneContato"
                                value={entrega.telefoneContato}
                                onChange={handleEntregaChange}
                                className="w-full p-2 border rounded bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                    </div>

                    <div className="flex justify-end">
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 disabled:bg-blue-300"
                        >
                            {loading ? 'Criando...' : 'Criar Pedido'}
                        </button>
                    </div>
                </form>
            </Card>

            {showNovoClienteModal && (
                <NovoClienteModal
                    onClose={() => setShowNovoClienteModal(false)}
                    onClienteCreated={(novoCliente) => {
                        setClientes(prev => [...prev, novoCliente]);
                        setSelectedClientId(novoCliente.id);
                        setShowNovoClienteModal(false);
                    }}
                />
            )}
        </div>
    );
} 