'use client';

import 'material-icons/iconfont/material-icons.css';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import InventoryIcon from '@mui/icons-material/Inventory';
import AssessmentIcon from '@mui/icons-material/Assessment';
import Link from "next/link";
import LoginButton from './LoginButton';
import { UserResponse } from '@/services/Usuario';
import LogoutButton from './LogoutButton';
import { useState, useEffect } from 'react';
import { fetchFilteredProdutos, ProdutoResponse } from '@/services/Produto';
import { Session } from '@/services/Session';
import { usePathname } from 'next/navigation';

const Header = () => {
	const [searchQuery, setSearchQuery] = useState('');
	const [searchResults, setSearchResults] = useState<ProdutoResponse[]>([]);
	const [debouncedQuery, setDebouncedQuery] = useState('');
	const [userData, setUserData] = useState<UserResponse | null>(null);
	const pathname = usePathname();

	useEffect(() => {
		const checkUserData = () => {
			const data = Session.getUserData();
			if (data) {
				setUserData({
					id: data.id,
					nome: data.nome,
					email: data.email,
					cpf: data.cpf,
					senha: '',
					role: data.role
				});
			} else {
				setUserData(null);
			}
		};

		// Check initial state
		checkUserData();

		// Listen for storage changes
		const handleStorageChange = (e: StorageEvent) => {
			if (e.key === 'sapato-facil-user-data' || e.key === 'sapato-facil-token') {
				checkUserData();
			}
		};

		// Listen for custom login event
		const handleLoginEvent = () => {
			checkUserData();
		};

		window.addEventListener('storage', handleStorageChange);
		window.addEventListener('login', handleLoginEvent);
		window.addEventListener('logout', handleLoginEvent);

		return () => {
			window.removeEventListener('storage', handleStorageChange);
			window.removeEventListener('login', handleLoginEvent);
			window.removeEventListener('logout', handleLoginEvent);
		};
	}, [pathname]);

	const isAdmin = userData?.role === 'ADMINISTRADOR';

	useEffect(() => {
		const handler = setTimeout(() => {
			setDebouncedQuery(searchQuery);
		}, 300);

		return () => {
			clearTimeout(handler);
		};
	}, [searchQuery]);

	useEffect(() => {
		const searchProducts = async () => {
			if (debouncedQuery.length > 2) {
				try {
					const results = await fetchFilteredProdutos({ nome: debouncedQuery });
					setSearchResults(results);
				} catch (error) {
					console.error('Erro ao buscar produtos:', error);
				}
			} else {
				setSearchResults([]);
			}
		};

		searchProducts();
	}, [debouncedQuery]);

	const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setSearchQuery(event.target.value);
	};

	return (
		<header className="bg-white shadow-md dark:bg-gray-800 relative">
			<div className="container mx-auto flex items-center p-4 relative">
				<Link href="/">
					<div className="text-2xl font-bold flex-shrink-0">Sapato Fácil</div>
				</Link>
				<div className="flex-grow flex items-center justify-center">
					<div className="relative w-full max-w-md">
						<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
							<SearchOutlinedIcon className="text-gray-500" />
						</div>
						<input
							type="text"
							placeholder="Pesquisar produtos"
							value={searchQuery}
							onChange={handleSearchChange}
							className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-full bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
						/>
						{debouncedQuery.length > 2 && (
							<div className="absolute mt-1 w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg z-10">
								{searchResults.length > 0 ? (
									searchResults.map((produto) => (
										<Link key={produto.id} href={`/produtos/${produto.id}`}>
											<div className="p-2 flex justify-between hover:bg-gray-100 dark:hover:bg-gray-800">
												<span>{produto.nome}</span>
												<span className="text-gray-500 dark:text-gray-300">R$ {produto.valor.toFixed(2)}</span>
											</div>
										</Link>
									))
								) : (
									<div className="p-2 text-center text-gray-500 dark:text-gray-300">
										Nenhum produto encontrado
									</div>
								)}
							</div>
						)}
					</div>
				</div>
				<div className="flex-shrink-0 ml-auto flex items-center space-x-4">
					{userData ? (
						<>
							{isAdmin && (
								<>
									<Link
										href="/produtos/gerenciar"
										className="flex items-center space-x-1 p-2 px-4 rounded-full bg-purple-500 text-white hover:bg-purple-600">
										<InventoryIcon style={{ fontSize: '20px' }} />
										<span>Gerenciar Produtos</span>
									</Link>
									<Link
										href="/pedidos/gerenciar"
										className="flex items-center space-x-1 p-2 px-4 rounded-full bg-purple-500 text-white hover:bg-purple-600">
										<InventoryIcon style={{ fontSize: '20px' }} />
										<span>Gerenciar Pedidos</span>
									</Link>
									<Link
										href="/reestoque/gerenciar"
										className="flex items-center space-x-1 p-2 px-4 rounded-full bg-purple-500 text-white hover:bg-purple-600">
										<InventoryIcon style={{ fontSize: '20px' }} />
										<span>Reestoque</span>
									</Link>
									<Link
										href="/relatorios"
										className="flex items-center space-x-1 p-2 px-4 rounded-full bg-indigo-500 text-white hover:bg-indigo-600">
										<AssessmentIcon style={{ fontSize: '20px' }} />
										<span>Relatórios</span>
									</Link>
								</>
							)}
							<Link
								href="/perfil"
								className="p-2 px-4 rounded-full bg-blue-500 text-white hover:bg-blue-600 flex items-center">
								Meu Perfil
							</Link>
							{!isAdmin && (
								<Link
									href="/carrinho"
									className="flex items-center justify-center w-10 h-10 rounded-full bg-green-500 text-white hover:bg-green-600"
								>
									<ShoppingCartOutlinedIcon style={{ fontSize: '24px' }} />
								</Link>
							)}
							<LogoutButton />
						</>
					) : (
						<LoginButton />
					)}
				</div>
			</div>
		</header>
	);
};

export default Header;
