import React from 'react';
import LoginForm from '@/components/auth/LoginForm';

export const metadata = {
  title: 'Login',
};

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <LoginForm />
    </div>
  );
}
