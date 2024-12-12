'use client';
import { useEffect, useState } from 'react';
import { getUser, updateUser } from '@/services/Usuario';
import { getCarrinho } from '@/services/Carrinho';
import { listarPedidos, PedidoModel } from '@/services/Pedido';
import { UserResponse } from '@/services/Usuario';
import { ProdutoResponse } from '@/services/Produto';
import { Session } from '@/services/Session';
import DetalhesProduto from '@/components/DetalhesProduto';
import DetalhesPedido from '@/components/DetalhesPedido';
import Link from 'next/link';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import EditIcon from '@mui/icons-material/Edit';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import Card from '@/components/Card';
import BackButton from '@/components/BackButton';

const ProfilePage = () => {
    const [user, setUser] = useState<UserResponse | null>(null);
    const [cartItems, setCartItems] = useState<ProdutoResponse[]>([]);
    const [pedidos, setPedidos] = useState<PedidoModel[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editUser, setEditUser] = useState<UserResponse | null>(null);

    useEffect(() => {
        const fetchUserAndCartAndPedidos = async () => {
            try {
                const userId = Session.getUserId();
                if (userId) {
                    const userData = await getUser(Number(userId));
                    setUser(userData);
                    setEditUser(userData);

                    const cartData = await getCarrinho();
                    setCartItems(cartData);

                    const pedidosData = await listarPedidos(userData.cpf);
                    setPedidos(pedidosData);
                }
            } catch (err) {
                console.error(err);
                setError('Erro ao carregar o perfil do usuário, carrinho ou pedidos');
            } finally {
                setLoading(false);
            }
        };

        fetchUserAndCartAndPedidos();
    }, []);

    const handleEditProfileToggle = () => {
        setIsEditing(!isEditing);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (editUser) {
            setEditUser({ ...editUser, [e.target.name]: e.target.value });
        }
    };

    const handleSaveProfile = async () => {
        if (!editUser) return;

        try {
            await updateUser(editUser.id, editUser);
            setUser(editUser);
            setIsEditing(false);
            alert('Perfil atualizado com sucesso!');
        } catch (error) {
            console.error('Erro ao atualizar perfil:', error);
            alert('Erro ao atualizar perfil. Tente novamente.');
        }
    };

    const removeProdutoFromList = (produtoId: number) => {
        setCartItems((prevProdutos) => prevProdutos.filter(produto => produto.id !== produtoId));
    };

    const totalPrice = cartItems.reduce((total, item) => total + item.valor, 0);

    const maskCPF = (cpf: string) => {
        return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    };

    if (loading) return <div className="flex justify-center items-center h-screen">Carregando...</div>;
    if (error) return <div className="flex justify-center items-center h-screen">{error}</div>;
    if (!user) return <div className="flex justify-center items-center h-screen">Usuário não encontrado</div>;

    return (
        <div className="container mx-auto p-4">
            <div className="relative flex items-center mb-6">
                <BackButton className="absolute left-0" />
                <h1 className="flex-grow text-3xl font-bold text-center text-gray-900 dark:text-gray-100">Perfil do Usuário</h1>
            </div>
            <Card className="mb-6">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Informações Cadastrais</h2>
                    {isEditing ? (
                        <EditOutlinedIcon
                            onClick={handleEditProfileToggle}
                            className="text-blue-500 cursor-pointer hover:text-gray-600 dark:hover:text-gray-300"
                            style={{ fontSize: '1.5rem' }}
                        />
                    ) : (
                        <EditIcon
                            onClick={handleEditProfileToggle}
                            className="text-gray-500 dark:text-gray-400 cursor-pointer hover:text-gray-600 dark:hover:text-gray-300"
                            style={{ fontSize: '1.5rem' }}
                        />
                    )}
                </div>
                {isEditing ? (
                    <div>
                        <div className="mb-2">
                            <label className="block text-gray-700 dark:text-gray-300">Nome:</label>
                            <input
                                type="text"
                                name="nome"
                                value={editUser?.nome || ''}
                                onChange={handleInputChange}
                                className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                            />
                        </div>
                        <div className="mb-2">
                            <label className="block text-gray-700 dark:text-gray-300">Email:</label>
                            <input
                                type="email"
                                name="email"
                                value={editUser?.email || ''}
                                onChange={handleInputChange}
                                className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                            />
                        </div>
                        <div className="mb-2">
                            <label className="block text-gray-700 dark:text-gray-300">CPF:</label>
                            <input
                                type="text"
                                name="cpf"
                                value={editUser?.cpf || ''}
                                onChange={handleInputChange}
                                className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                            />
                        </div>
                        <button
                            onClick={handleSaveProfile}
                            className="mt-4 py-2 px-4 text-white bg-green-500 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                        >
                            Salvar
                        </button>
                    </div>
                ) : (
                    <div>
                        <p className="mb-2"><strong>Nome:</strong> {user.nome}</p>
                        <p className="mb-2"><strong>Email:</strong> {user.email}</p>
                        <p className="mb-2"><strong>CPF:</strong> {maskCPF(user.cpf)}</p>
                    </div>
                )}
            </Card>
            <Card className="mb-6">
                <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">Carrinho</h2>
                {cartItems.length === 0 ? (
                    <div className="w-full p-4 text-center bg-white border border-gray-200 rounded-lg shadow sm:p-8 dark:bg-gray-800 dark:border-gray-700">
                        <h5 className="mb-2 text-3xl font-bold text-gray-900 dark:text-white">Nenhum produto no carrinho</h5>
                        <p className="mb-5 text-base text-gray-500 sm:text-lg dark:text-gray-400">Adicione produtos ao carrinho para continuar</p>
                        <div className="items-center justify-center space-y-4 sm:flex sm:space-y-0 sm:space-x-4 rtl:space-x-reverse">
                            <Link href="/produtos" className="mt-4 flex items-center px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 dark:bg-blue-400 dark:hover:bg-blue-500">
                                Visualizar produtos <ArrowForwardIcon className="ml-2" />
                            </Link>
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {cartItems.map((produto) => (
                                <DetalhesProduto key={produto.id} produto={produto} isInCart={true} onRemove={removeProdutoFromList} />
                            ))}
                        </div>
                        <div className="text-right mt-4">
                            <strong>Total:</strong> R$ {totalPrice.toFixed(2)}
                        </div>
                    </>
                )}
            </Card>
            <Card>
                <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">Pedidos</h2>
                {pedidos.length === 0 ? (
                    <div className="w-full p-4 text-center bg-white border border-gray-200 rounded-lg shadow sm:p-8 dark:bg-gray-800 dark:border-gray-700">
                        <h5 className="mb-2 text-3xl font-bold text-gray-900 dark:text-white">Nenhum pedido encontrado</h5>
                        <p className="mb-5 text-base text-gray-500 sm:text-lg dark:text-gray-400">Você ainda não fez nenhum pedido</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {pedidos.map(pedido => (
                            <Link href={`/pedidos/${pedido.id}`} key={pedido.id}>
                                <DetalhesPedido hideActions pedido={pedido} onStatusUpdate={() => {}} />
                            </Link>
                        ))}
                    </div>
                )}
            </Card>
        </div>
    );
};

export default ProfilePage;
