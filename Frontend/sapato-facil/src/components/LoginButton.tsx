'use client';

import { useState } from 'react';
import LoginModal from '@/components/LoginModal';

const LoginButton = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleLoginClick = () => {
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <>
      <button
        onClick={handleLoginClick}
        className="p-2 px-4 rounded-full bg-blue-500 text-white hover:bg-blue-600"
      >
        Login
      </button>
      <LoginModal isOpen={isOpen} onClose={handleClose} />
    </>
  );
};

export default LoginButton;

