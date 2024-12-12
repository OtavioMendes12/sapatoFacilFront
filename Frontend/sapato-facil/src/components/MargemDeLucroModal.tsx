'use client';
import { useState, useRef, useEffect } from "react";

interface MargemDeLucroModalProps {
    isOpen: boolean;
    onClose: () => void;
    produtoNome: string;
    produtoValor: number;
}

const MargemDeLucroModal = ({ isOpen, onClose, produtoNome, produtoValor }: MargemDeLucroModalProps) => {
    const [custo, setCusto] = useState<number>(produtoValor);
    const [margemDeLucro, setMargemDeLucro] = useState<number | null>(null);
    const modalRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
                onClose();
                setCusto(produtoValor);
                setMargemDeLucro(null);
            }
        };

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
            calculateMargemDeLucro(produtoValor);
        } else {
            document.removeEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen, onClose, produtoValor]);

    const calculateMargemDeLucro = (custoValue: number) => {
        if (custoValue > 0) {
            const lucro = produtoValor - custoValue;
            const margem = (lucro / produtoValor) * 100;
            setMargemDeLucro(margem);
        }
    };

    const handleCustoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newCusto = Number(e.target.value);
        setCusto(newCusto);
        calculateMargemDeLucro(newCusto);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div ref={modalRef} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-2xl font-bold mb-4">Margem de Lucro - {produtoNome}</h2>
                <div className="mb-4">
                    <label className="block text-gray-700 dark:text-gray-300 mb-2" htmlFor="custo">Custo</label>
                    <input
                        type="number"
                        id="custo"
                        name="custo"
                        className="w-full p-2 border border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
                        value={custo}
                        onChange={handleCustoChange}
                        required
                    />
                </div>
                <div className="flex justify-end">
                    <button
                        type="button"
                        onClick={onClose}
                        className="mr-4 px-4 py-2 bg-gray-200 dark:bg-gray-600 rounded"
                    >
                        Fechar
                    </button>
                </div>
                {margemDeLucro !== null && (
                    <div className="mt-4">
                        <p className={`text-lg ${margemDeLucro < 0 ? 'text-red-500' : 'text-green-500'}`}>
                            Margem de Lucro: {margemDeLucro.toFixed(2)}%
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MargemDeLucroModal; 