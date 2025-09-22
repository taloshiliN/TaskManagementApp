import React from 'react';
import { useForm } from 'react-hook-form';
import type { ReactNode } from 'react';

interface AuthFormProps {
  title: string;
  onSubmit: (data: any) => Promise<void>;
  children: ReactNode;
  isLoading?: boolean;
}

interface FormData {
  email: string;
  password: string;
  name?: string;
  confirmPassword?: string;
}

const AuthForm: React.FC<AuthFormProps> = ({ title, onSubmit, children, isLoading = false }) => {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {title}
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="rounded-md shadow-sm -space-y-px">
            {children}
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Loading...' : title}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AuthForm;
