'use client';

import { useRouter } from 'next/navigation';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import { Session } from '@/services/Session';

const LogoutButton = () => {
    const router = useRouter();

    const handleLogout = () => {
        Session.clearSession();
        if (typeof window !== 'undefined') {
            window.dispatchEvent(new Event('logout'));
        }
        router.push('/');
    };

    return (
        <button
            onClick={handleLogout}
            className="flex items-center justify-center w-10 h-10 rounded-full bg-red-500 text-white hover:bg-red-600"
        >
            <LogoutOutlinedIcon style={{ fontSize: '24px' }} />
        </button>
    );
};

export default LogoutButton;
