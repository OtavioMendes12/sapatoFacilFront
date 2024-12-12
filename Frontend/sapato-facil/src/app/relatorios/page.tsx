'use client';

import { useEffect, useState } from 'react';
import { gerarRelatorioVendasFinalizadas, PedidoModel } from '@/services/Pedido';
import Card from '@/components/Card';
import BackButton from '@/components/BackButton';
import { ApiError } from '@/services/ApiClient';
import BarChartIcon from '@mui/icons-material/BarChart';
import TimelineIcon from '@mui/icons-material/Timeline';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';

export default function Relatorios() {
    const [vendas, setVendas] = useState<PedidoModel[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [dateRange, setDateRange] = useState({
        inicio: new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString().split('T')[0],
        fim: new Date().toISOString().split('T')[0]
    });

    const fetchVendas = async () => {
        try {
            const vendasData = await gerarRelatorioVendasFinalizadas(
                dateRange.inicio,
                dateRange.fim
            );
            setVendas(vendasData);
        } catch (err) {
            if (err instanceof ApiError) {
                setError(err.message);
            } else {
                setError('Erro ao carregar relatório de vendas');
            }
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchVendas();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dateRange]);

    const calcularTotalVendas = () => {
        return vendas.reduce((total, venda) => total + venda.total, 0);
    };

    const calcularMediaVendas = () => {
        if (vendas.length === 0) return 0;
        return calcularTotalVendas() / vendas.length;
    };

    const formatarData = (data: string) => {
        return new Date(data).toLocaleDateString('pt-BR');
    };

    const formatarMoeda = (valor: number) => {
        return valor.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        });
    };

    if (loading) return <div className="flex justify-center items-center h-screen">Carregando...</div>;
    if (error) return <div className="flex justify-center items-center h-screen">{error}</div>;

    return (
        <div className="container mx-auto p-4">
            <div className="flex items-center mb-6">
                <BackButton />
                <h1 className="text-3xl font-bold ml-8">Relatórios</h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <Card>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 dark:text-gray-400">Total de Vendas</p>
                            <p className="text-2xl font-bold">{formatarMoeda(calcularTotalVendas())}</p>
                        </div>
                        <BarChartIcon className="text-blue-500" style={{ fontSize: '40px' }} />
                    </div>
                </Card>

                <Card>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 dark:text-gray-400">Média por Venda</p>
                            <p className="text-2xl font-bold">{formatarMoeda(calcularMediaVendas())}</p>
                        </div>
                        <TimelineIcon className="text-green-500" style={{ fontSize: '40px' }} />
                    </div>
                </Card>

                <Card>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 dark:text-gray-400">Total de Pedidos</p>
                            <p className="text-2xl font-bold">{vendas.length}</p>
                        </div>
                        <ReceiptLongIcon className="text-purple-500" style={{ fontSize: '40px' }} />
                    </div>
                </Card>
            </div>

            <Card>
                <div className="mb-4 flex items-center space-x-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Data Inicial
                        </label>
                        <input
                            type="date"
                            value={dateRange.inicio}
                            onChange={(e) => setDateRange({ ...dateRange, inicio: e.target.value })}
                            className="border border-gray-300 rounded-md p-2 dark:bg-gray-700 dark:border-gray-600"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Data Final
                        </label>
                        <input
                            type="date"
                            value={dateRange.fim}
                            onChange={(e) => setDateRange({ ...dateRange, fim: e.target.value })}
                            className="border border-gray-300 rounded-md p-2 dark:bg-gray-700 dark:border-gray-600"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-50 dark:bg-gray-800">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    ID
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    Cliente
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    Data
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    Total
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    Status
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-900 dark:divide-gray-700">
                            {vendas.map((venda) => (
                                <tr key={venda.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">
                                        {venda.id}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">
                                        {venda.clienteNome}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">
                                        {formatarData(venda.dataPedido)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">
                                        {formatarMoeda(venda.total)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">
                                        {venda.status}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
} 