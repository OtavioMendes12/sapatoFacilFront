'use client';

import { useRouter } from 'next/navigation';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

interface BackButtonProps {
    className?: string;
    // other props...
}

const BackButton: React.FC<BackButtonProps> = ({ className, ...props }) => {
    const router = useRouter();

    return (
        <ArrowBackIcon
            onClick={() => router.back()}
            className={`text-gray-500 dark:text-gray-400 cursor-pointer hover:text-gray-600 dark:hover:text-gray-300 ${className}`}
            style={{ fontSize: '2rem' }} // Adjust the size as needed
            {...props}
        />
    );
};

export default BackButton; 