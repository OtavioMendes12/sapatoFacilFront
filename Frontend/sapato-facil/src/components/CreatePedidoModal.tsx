import React, { useState, useEffect, useRef } from 'react';
import { ProdutoResponse, getProdutos } from '@/services/Produto';
import { UserResponse, getUsers } from '@/services/Usuario';
import { criarPedido, PedidoModel } from '@/services/Pedido';
import { adicionarAoCarrinho } from '@/services/Carrinho';

interface CreatePedidoModalProps {
    isOpen: boolean;
    onClose: () => void;
    onPedidoCreated: (pedido: PedidoModel) => void;
}

const CreatePedidoModal: React.FC<CreatePedidoModalProps> = ({ isOpen, onClose, onPedidoCreated }) => {
    const [produtos, setProdutos] = useState<ProdutoResponse[]>([]);
    const [clientes, setClientes] = useState<UserResponse[]>([]);
    const [selectedProdutos, setSelectedProdutos] = useState<number[]>([]);
    const [selectedCliente, setSelectedCliente] = useState<number | null>(null);
    const [entrega, setEntrega] = useState({
        rua: '',
        cidade: '',
        estado: '',
        cep: '',
        complemento: '',
        telefoneContato: ''
    });
    const modalRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const fetchProdutosAndClientes = async () => {
            try {
                const produtosData = await getProdutos();
                setProdutos(produtosData);

                const clientesData = await getUsers();
                setClientes(clientesData);
            } catch (error) {
                console.error('Erro ao carregar produtos ou clientes:', error);
            }
        };

        if (isOpen) {
            fetchProdutosAndClientes();
        }
    }, [isOpen]);

    const handleCreatePedido = async () => {
        if (selectedCliente && selectedProdutos.length > 0) {
            try {
                await Promise.all(selectedProdutos.map(produtoId => adicionarAoCarrinho(produtoId)));

                const newPedido = await criarPedido(selectedCliente, entrega);
                onPedidoCreated(newPedido);
                onClose();
            } catch (error) {
                console.error('Erro ao criar pedido:', error);
            }
        } else {
            console.error('Cliente e produtos são necessários para criar um pedido');
        }
    };

    const handleEntregaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setEntrega(prev => ({ ...prev, [name]: value }));
    };

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

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div ref={modalRef} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Criar Novo Pedido</h2>
                <div className="mb-4">
                    <label className="block text-gray-700 dark:text-gray-300 mb-2" htmlFor="cliente">Cliente</label>
                    <select
                        id="cliente"
                        value={selectedCliente || ''}
                        onChange={(e) => setSelectedCliente(Number(e.target.value))}
                        className="p-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full dark:bg-gray-700 dark:text-gray-300"
                    >
                        <option value="" disabled>Selecione um Cliente</option>
                        {clientes.map(cliente => (
                            <option key={cliente.id} value={cliente.id}>{cliente.nome}</option>
                        ))}
                    </select>
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 dark:text-gray-300 mb-2" htmlFor="produtos">Produtos</label>
                    <select
                        id="produtos"
                        multiple
                        value={selectedProdutos.join(',')}
                        onChange={(e) => setSelectedProdutos(Array.from(e.target.selectedOptions, option => Number(option.value)))}
                        className="p-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full dark:bg-gray-700 dark:text-gray-300"
                    >
                        {produtos.map(produto => (
                            <option key={produto.id} value={produto.id}>{produto.nome}</option>
                        ))}
                    </select>
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 dark:text-gray-300 mb-2" htmlFor="rua">Rua</label>
                    <input
                        type="text"
                        id="rua"
                        name="rua"
                        value={entrega.rua}
                        onChange={handleEntregaChange}
                        className="p-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full dark:bg-gray-700 dark:text-gray-300"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 dark:text-gray-300 mb-2" htmlFor="cidade">Cidade</label>
                    <input
                        type="text"
                        id="cidade"
                        name="cidade"
                        value={entrega.cidade}
                        onChange={handleEntregaChange}
                        className="p-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full dark:bg-gray-700 dark:text-gray-300"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 dark:text-gray-300 mb-2" htmlFor="estado">Estado</label>
                    <input
                        type="text"
                        id="estado"
                        name="estado"
                        value={entrega.estado}
                        onChange={handleEntregaChange}
                        className="p-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full dark:bg-gray-700 dark:text-gray-300"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 dark:text-gray-300 mb-2" htmlFor="cep">CEP</label>
                    <input
                        type="text"
                        id="cep"
                        name="cep"
                        value={entrega.cep}
                        onChange={handleEntregaChange}
                        className="p-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full dark:bg-gray-700 dark:text-gray-300"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 dark:text-gray-300 mb-2" htmlFor="complemento">Complemento</label>
                    <input
                        type="text"
                        id="complemento"
                        name="complemento"
                        value={entrega.complemento}
                        onChange={handleEntregaChange}
                        className="p-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full dark:bg-gray-700 dark:text-gray-300"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 dark:text-gray-300 mb-2" htmlFor="telefoneContato">Telefone de Contato</label>
                    <input
                        type="text"
                        id="telefoneContato"
                        name="telefoneContato"
                        value={entrega.telefoneContato}
                        onChange={handleEntregaChange}
                        className="p-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full dark:bg-gray-700 dark:text-gray-300"
                    />
                </div>
                <div className="flex justify-end">
                    <button
                        onClick={handleCreatePedido}
                        className="py-2 px-4 text-white bg-green-500 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                        Criar Pedido
                    </button>
                    <button
                        onClick={onClose}
                        className="ml-2 py-2 px-4 text-white bg-red-500 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                    >
                        Cancelar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CreatePedidoModal;