'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { aboutAPI } from '@/lib/api';

const aboutSchema = z.object({
  content: z.string().optional(),
});

type AboutFormData = z.infer<typeof aboutSchema>;

export default function EditAboutPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');

  const [username, setUsername] = useState<string>('');

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<AboutFormData>({
    resolver: zodResolver(aboutSchema),
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { authAPI } = await import('@/lib/api');
        const meResponse = await authAPI.getMe();
        setUsername(meResponse.data.username);
      } catch (err) {
        console.error('Failed to get user info');
      }
    };
    fetchUser();
  }, []);

  const fetchAbout = async () => {
    if (!username) return;
    try {
      setIsFetching(true);
      const response = await aboutAPI.getByUsername(username);
      setValue('content', response.data.content || '');
    } catch (err: any) {
      setError('Failed to load about section');
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    if (username) {
      fetchAbout();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [username]);

  const onSubmit = async (data: AboutFormData) => {
    try {
      setIsLoading(true);
      setError('');
      setSuccess('');

      await aboutAPI.update(data);
      setSuccess('About section updated successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update about section');
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return <div className="text-center py-12">Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50 mb-8">Edit About</h1>

      {error && (
        <div className="mb-4 p-4 bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-800 text-red-700 dark:text-red-400 rounded-lg">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 p-4 bg-green-100 dark:bg-green-900/30 border border-green-400 dark:border-green-800 text-green-700 dark:text-green-400 rounded-lg">
          {success}
        </div>
      )}

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-6 bg-white dark:bg-zinc-900 rounded-lg shadow p-6"
      >
        <div>
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
            Content
          </label>
          <textarea
            {...register('content')}
            rows={12}
            className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 focus:ring-2 focus:ring-blue-500 font-mono text-sm"
            placeholder="Write about yourself here..."
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full md:w-auto px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </div>
  );
}

