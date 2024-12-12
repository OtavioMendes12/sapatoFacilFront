'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createProduto, Genero, ProdutoRequest, uploadImagem } from '@/services/Produto';
import { ApiError } from '@/services/ApiClient';
import Card from '@/components/Card';
import BackButton from '@/components/BackButton';
import Swal from 'sweetalert2';

export default function NovoProduto() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [produto, setProduto] = useState<ProdutoRequest>({
        nome: '',
        valor: 0,
        quantidadeEstoque: 0,
        tamanho: 0,
        genero: Genero.UNISSEX,
        cor: ''
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setProduto(prev => ({
            ...prev,
            [name]: name === 'valor' || name === 'quantidadeEstoque' || name === 'tamanho'
                ? Number(value)
                : value
        }));
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedImage(e.target.files[0]);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            // First create the product
            const novoProduto = await createProduto(produto);

            // If image was selected, upload it
            if (selectedImage) {
                try {
                    await uploadImagem(novoProduto.id, selectedImage);
                } catch (imageError) {
                    console.error('Erro ao fazer upload da imagem:', imageError);
                    // Show warning that product was created but image upload failed
                    await Swal.fire({
                        icon: 'warning',
                        title: 'Produto criado, mas houve um erro ao fazer upload da imagem',
                        text: 'O produto foi criado com sucesso, mas não foi possível fazer o upload da imagem.',
                        showConfirmButton: true
                    });
                    router.push('/produtos/gerenciar');
                    return;
                }
            }

            await Swal.fire({
                icon: 'success',
                title: 'Produto criado com sucesso!',
                showConfirmButton: false,
                timer: 1500
            });
            router.push('/produtos/gerenciar');
        } catch (err) {
            let errorMessage = 'Erro ao criar produto';
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

    return (
        <div className="container mx-auto px-4 py-8">
            <Card>
                <div className="flex items-center mb-8">
                    <BackButton />
                    <h1 className="text-3xl font-bold dark:text-white flex-1 text-center">Novo Produto</h1>
                    <div className="w-10"></div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Nome
                            </label>
                            <input
                                type="text"
                                name="nome"
                                value={produto.nome}
                                onChange={handleInputChange}
                                className="w-full p-2 border rounded bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Valor
                            </label>
                            <input
                                type="number"
                                name="valor"
                                value={produto.valor}
                                onChange={handleInputChange}
                                className="w-full p-2 border rounded bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                                min="0"
                                step="0.01"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Quantidade em Estoque
                            </label>
                            <input
                                type="number"
                                name="quantidadeEstoque"
                                value={produto.quantidadeEstoque}
                                onChange={handleInputChange}
                                className="w-full p-2 border rounded bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                                min="0"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Tamanho
                            </label>
                            <input
                                type="number"
                                name="tamanho"
                                value={produto.tamanho}
                                onChange={handleInputChange}
                                className="w-full p-2 border rounded bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                                min="1"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Gênero
                            </label>
                            <select
                                name="genero"
                                value={produto.genero}
                                onChange={handleInputChange}
                                className="w-full p-2 border rounded bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            >
                                <option value={Genero.UNISSEX}>Unissex</option>
                                <option value={Genero.MASCULINO}>Masculino</option>
                                <option value={Genero.FEMININO}>Feminino</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Cor
                            </label>
                            <input
                                type="text"
                                name="cor"
                                value={produto.cor}
                                onChange={handleInputChange}
                                className="w-full p-2 border rounded bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Imagem do Produto
                            </label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="w-full p-2 border rounded bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>

                    <div className="flex justify-end">
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 disabled:bg-blue-300"
                        >
                            {loading ? 'Criando...' : 'Criar Produto'}
                        </button>
                    </div>
                </form>
            </Card>
        </div>
    );
}