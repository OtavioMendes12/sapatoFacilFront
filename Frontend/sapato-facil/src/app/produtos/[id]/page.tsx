"use client";
import { useEffect, useState } from 'react';
import { getProdutoById } from '../../../services/Produto';
import { ProdutoResponse } from '../../../services/Produto';
import DetalhesProduto from '../../../components/DetalhesProduto';

interface ProdutoProps {
    params: { id: string };
}

export default function Produto({ params }: ProdutoProps) {
    const { id } = params;
    const [produto, setProduto] = useState<ProdutoResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchProduto() {
            if (id) {
                try {
                    const produtoData = await getProdutoById(parseInt(id as string));
                    setProduto(produtoData);
                } catch (err) {
                    console.error(err);
                    setError('Erro ao carregar o produto');
                } finally {
                    setLoading(false);
                }
            }
        }

        fetchProduto();
    }, [id]);

    if (loading) return <div className="flex justify-center items-center h-screen">Carregando...</div>;
    if (error) return <div className="flex justify-center items-center h-screen">{error}</div>;
    if (!produto) return <div className="flex justify-center items-center h-screen">Produto não encontrado</div>;

    return (
        <div className="flex justify-center items-center h-screen">
            {produto && <DetalhesProduto produto={produto} />}
        </div>
    );
}