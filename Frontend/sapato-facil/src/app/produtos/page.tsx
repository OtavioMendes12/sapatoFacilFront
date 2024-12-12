"use client";

import { useEffect, useState } from 'react';
import { getProdutos, fetchFilteredProdutos } from '@/services/Produto';
import { getCarrinho } from '@/services/Carrinho';
import { ProdutoResponse } from '@/services/Produto';
import DetalhesProduto from '@/components/DetalhesProduto';
import FilterIcon from '@mui/icons-material/FilterAlt';
import FilterIconActive from '@mui/icons-material/FilterAltOutlined';
import BackButton from '@/components/BackButton';
import { Session } from '@/services/Session';

export default function Produtos() {
    const [produtos, setProdutos] = useState<ProdutoResponse[]>([]);
    const [cartItems, setCartItems] = useState<number[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [filterOpen, setFilterOpen] = useState(false);
    const [filterCriteria, setFilterCriteria] = useState({
        nome: '',
        genero: '',
        tamanho: '',
        precoMin: '',
        precoMax: ''
    });

    useEffect(() => {
        const fetchProdutosAndCart = async () => {
            try {
                if (Session.isTokenValid()) {
                    const [produtosData, cartData] = await Promise.all([getProdutos(), getCarrinho()]);
                    setProdutos(produtosData);
                    setCartItems(cartData.map(item => item.id));
                } else {
                    const produtosData = await getProdutos();
                    setProdutos(produtosData);
                    setCartItems([]);
                }
            } catch (err) {
                console.error(err);
                setError('Erro ao carregar os produtos');
            } finally {
                setLoading(false);
            }
        };

        fetchProdutosAndCart();
    }, []);

    const toggleFilter = () => setFilterOpen(!filterOpen);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilterCriteria({ ...filterCriteria, [name]: value });
    };

    const applyFilter = async () => {
        setLoading(true);
        try {
            const filteredProdutos = await fetchFilteredProdutos(filterCriteria);
            setProdutos(filteredProdutos);
        } catch (err) {
            console.error(err);
            setError('Erro ao aplicar o filtro');
        } finally {
            setLoading(false);
        }
    };

    const clearFilters = async () => {
        setFilterCriteria({
            nome: '',
            genero: '',
            tamanho: '',
            precoMin: '',
            precoMax: ''
        });
        setLoading(true);
        try {
            const produtosData = await getProdutos(); // Re-fetch all products
            setProdutos(produtosData);
        } catch (err) {
            console.error(err);
            setError('Erro ao carregar os produtos');
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="flex justify-center items-center h-screen">Carregando...</div>;
    if (error) return <div className="flex justify-center items-center h-screen">{error}</div>;

    return (
        <div className="container mx-auto p-4">
            <div className="flex justify-between items-center mb-6">
                <BackButton />
                <h1 className="text-3xl font-bold text-center">Lista de Produtos</h1>
                <button onClick={toggleFilter} className="text-xl">
                    {filterOpen ? <FilterIconActive className="text-blue-500" /> : <FilterIcon />}
                </button>
            </div>
            {filterOpen && (
                <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-4 mb-6">
                    <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Filtrar Produtos</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input
                            type="text"
                            name="nome"
                            placeholder="Nome"
                            value={filterCriteria.nome}
                            onChange={handleFilterChange}
                            className="border border-gray-300 dark:border-gray-700 rounded-md p-2 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
                        />
                        <input
                            type="text"
                            name="genero"
                            placeholder="Gênero"
                            value={filterCriteria.genero}
                            onChange={handleFilterChange}
                            className="border border-gray-300 dark:border-gray-700 rounded-md p-2 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
                        />
                        <input
                            type="text"
                            name="tamanho"
                            placeholder="Tamanho"
                            value={filterCriteria.tamanho}
                            onChange={handleFilterChange}
                            className="border border-gray-300 dark:border-gray-700 rounded-md p-2 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
                        />
                        <input
                            type="number"
                            name="precoMin"
                            placeholder="Preço Mínimo"
                            value={filterCriteria.precoMin}
                            onChange={handleFilterChange}
                            className="border border-gray-300 dark:border-gray-700 rounded-md p-2 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
                        />
                        <input
                            type="number"
                            name="precoMax"
                            placeholder="Preço Máximo"
                            value={filterCriteria.precoMax}
                            onChange={handleFilterChange}
                            className="border border-gray-300 dark:border-gray-700 rounded-md p-2 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
                        />
                    </div>
                    <div className="flex justify-end mt-4">
                        <button
                            onClick={applyFilter}
                            className="bg-blue-500 dark:bg-blue-600 text-white rounded-md px-4 py-2 hover:bg-blue-600 dark:hover:bg-blue-700 mr-2"
                        >
                            Aplicar Filtro
                        </button>
                        <button
                            onClick={clearFilters}
                            className="bg-gray-500 dark:bg-gray-600 text-white rounded-md px-4 py-2 hover:bg-gray-600 dark:hover:bg-gray-700"
                        >
                            Limpar Filtros
                        </button>
                    </div>
                </div>
            )}
            {produtos.length === 0 ? (
                <div className="flex justify-center items-center h-screen">Nenhum produto encontrado</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {produtos.map((produto) => (
                        <div key={produto.id} className="produto-item">
                            <DetalhesProduto produto={produto} isInCart={cartItems.includes(produto.id)} hideActions={!Session.isTokenValid()} />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
