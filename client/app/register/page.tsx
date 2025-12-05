'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { authAPI } from '@/lib/api';
import Link from 'next/link';
import { UserPlus } from 'lucide-react';
import { Input } from '@/lib/components/Input';

const registerSchema = z
  .object({
    username: z
      .string()
      .min(4, 'Username must be at least 4 characters')
      .max(20, 'Username must be at most 20 characters'),
    email: z.string().email('Invalid email address'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(
        /((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/,
        'Password too weak. Must contain uppercase, lowercase, and number or special character',
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const [apiError, setApiError] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    mode: 'onChange',
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      setIsLoading(true);
      setApiError('');
      const { confirmPassword, ...registerData } = data;
      const response = await authAPI.register(registerData);
      localStorage.setItem('token', response.data.access_token);
      router.push('/admin');
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      const errorMessage = error.response?.data?.message || 'Registration failed. Please try again.';
      
      // Handle specific API errors
      if (errorMessage.includes('username') || errorMessage.includes('Username')) {
        setError('username', { type: 'manual', message: 'Username already taken' });
      } else if (errorMessage.includes('email') || errorMessage.includes('Email')) {
        setError('email', { type: 'manual', message: 'Email already registered' });
      } else {
        setApiError(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-black px-4">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-lg p-8">
          <div className="flex items-center justify-center mb-6">
            <UserPlus className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          </div>
          <h1 className="text-2xl font-bold text-center text-zinc-900 dark:text-zinc-50 mb-8">
            Register
          </h1>

          {apiError && (
            <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-800 text-red-700 dark:text-red-400 rounded">
              {apiError}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label="Username"
              register={register('username')}
              type="text"
              placeholder="johndoe"
              error={errors.username?.message}
            />

            <Input
              label="Email"
              register={register('email')}
              type="email"
              placeholder="your@email.com"
              error={errors.email?.message}
            />

            <Input
              label="Password"
              register={register('password')}
              type="password"
              placeholder="••••••••"
              error={errors.password?.message}
            />

            <Input
              label="Confirm Password"
              register={register('confirmPassword')}
              type="password"
              placeholder="••••••••"
              error={errors.confirmPassword?.message}
            />

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? 'Registering...' : 'Register'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-zinc-600 dark:text-zinc-400">
            Already have an account?{' '}
            <Link
              href="/login"
              className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

