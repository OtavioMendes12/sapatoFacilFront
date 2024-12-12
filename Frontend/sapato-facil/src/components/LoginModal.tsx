'use client';
import { useState, useEffect, useRef } from "react";
import InputMask from 'react-input-mask';
import { login, register, LoginRequest, RegisterRequest } from '../services/Login';
import Swal from 'sweetalert2';

interface LoginModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const LoginModal = ({ isOpen, onClose }: LoginModalProps) => {
    const [isLogin, setIsLogin] = useState(true);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordsMatch, setPasswordsMatch] = useState(true);
    const modalRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
                onClose();
                setIsLogin(true);
                setPassword('');
                setConfirmPassword('');
                setPasswordsMatch(true);
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

    useEffect(() => {
        if (!isLogin) {
            setPasswordsMatch(confirmPassword === '' || password === confirmPassword);
        }
    }, [password, confirmPassword, isLogin]);

    if (!isOpen) return null;

    const toggleForm = () => {
        setIsLogin(!isLogin);
        setError(null);
        setPassword('');
        setConfirmPassword('');
        setPasswordsMatch(true);
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setLoading(true);
        setError(null);

        const formData = new FormData(event.target as HTMLFormElement);
        const data = Object.fromEntries(formData.entries());
        data.cpf = (data.cpf as string).replace(/\D/g, '');

        if (!isLogin && !passwordsMatch) {
            setError("As senhas não coincidem");
            setLoading(false);
            return;
        }

        try {
            if (isLogin) {
                await login(data as object as LoginRequest);
                Swal.fire({
                    icon: 'success',
                    title: 'Login realizado com sucesso!',
                    html: '<p>Você será redirecionado automaticamente</p>',
                    showConfirmButton: false,
                    timer: 1500,
                    timerProgressBar: true
                }).then(() => {
                    window.location.reload();
                });
            } else {
                await register(data as object as RegisterRequest);
                Swal.fire({
                    icon: 'success',
                    title: 'Cadastro realizado com sucesso!',
                    html: '<p>Você será redirecionado automaticamente</p>',
                    showConfirmButton: false,
                    timer: 1500,
                    timerProgressBar: true
                }).then(() => {
                    window.location.reload();
                });
            }
        } catch (err) {
            setError((err as Error).message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div ref={modalRef} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-2xl font-bold mb-4">{isLogin ? "Entrar" : "Registrar"}</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700 dark:text-gray-300 mb-2" htmlFor="cpf">CPF</label>
                        <InputMask
                            mask="999.999.999-99"
                            id="cpf"
                            name="cpf"
                            className="w-full p-2 border border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
                            required
                        />
                    </div>
                    {!isLogin && (
                        <div className="mb-4">
                            <label className="block text-gray-700 dark:text-gray-300 mb-2" htmlFor="nome">Nome</label>
                            <input
                                type="text"
                                id="nome"
                                name="nome"
                                className="w-full p-2 border border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
                                required
                            />
                        </div>
                    )}
                    {!isLogin && (
                        <div className="mb-4">
                            <label className="block text-gray-700 dark:text-gray-300 mb-2" htmlFor="email">Email</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                className="w-full p-2 border border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
                                required
                            />
                        </div>
                    )}
                    <div className="mb-4">
                        <label className="block text-gray-700 dark:text-gray-300 mb-2" htmlFor="password">Senha</label>
                        <input
                            type="password"
                            id="senha"
                            name="senha"
                            className="w-full p-2 border border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    {!isLogin && (
                        <div className="mb-4">
                            <label className="block text-gray-700 dark:text-gray-300 mb-2" htmlFor="confirmPassword">Confirmar senha</label>
                            <input
                                type="password"
                                id="confirmPassword"
                                name="confirmPassword"
                                className={`w-full p-2 border ${passwordsMatch ? 'border-gray-300' : 'border-red-500'} rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300`}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                            {!passwordsMatch && <div className="text-red-500 mt-2">As senhas não coincidem</div>}
                        </div>
                    )}
                    {error && <div className="text-red-500 mb-4">{error}</div>}
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
                            className="px-4 py-2 bg-blue-500 text-white rounded"
                            disabled={loading || (!isLogin && !passwordsMatch)}
                        >
                            {loading ? 'Carregando...' : isLogin ? "Entrar" : "Registrar"}
                        </button>
                    </div>
                </form>
                <div className="mt-4 text-center">
                    <button
                        type="button"
                        onClick={toggleForm}
                        className="text-blue-500 dark:text-blue-300"
                    >
                        {isLogin ? "Não tem uma conta? Registre-se" : "Já tem uma conta? Entrar"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LoginModal;