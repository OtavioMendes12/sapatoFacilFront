import Link from 'next/link';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

export default function Home() {
    return (
        <div className="flex flex-col items-center justify-center min-h-100 bg-background text-foreground mt-32">
            <h1 className="text-4xl font-bold mb-2">Bem-vindo ao Sapato Fácil</h1>
            <p className="text-lg">Sua loja única para todos os tipos de calçados</p>
            <Link href="/produtos" className="mt-4 flex items-center px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 dark:bg-blue-400 dark:hover:bg-blue-500">
                Visualizar produtos <ArrowForwardIcon className="ml-2" />
            </Link>
        </div>
    );
}
