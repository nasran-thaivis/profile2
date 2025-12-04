'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { portfolioAPI } from '@/lib/api';
import { Plus, Edit, Trash2, X } from 'lucide-react';

const portfolioSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  link: z.string().url().optional().or(z.literal('')),
});

type PortfolioFormData = z.infer<typeof portfolioSchema>;

interface PortfolioItem {
  id: number;
  title: string;
  description?: string;
  imageUrl?: string;
  link?: string;
}

export default function ManagePortfolioPage() {
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<PortfolioItem | null>(null);
  const [error, setError] = useState<string>('');

  const [username, setUsername] = useState<string>('');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PortfolioFormData>({
    resolver: zodResolver(portfolioSchema),
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

  const fetchPortfolio = async () => {
    if (!username) return;
    try {
      setIsFetching(true);
      const response = await portfolioAPI.getByUsername(username);
      setPortfolio(response.data);
    } catch (err: any) {
      setError('Failed to load portfolio');
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    if (username) {
      fetchPortfolio();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [username]);

  const onSubmit = async (data: PortfolioFormData) => {
    try {
      setIsLoading(true);
      setError('');

      const formData = new FormData();
      formData.append('title', data.title);
      if (data.description) formData.append('description', data.description);
      if (data.link) formData.append('link', data.link);

      const imageInput = document.querySelector<HTMLInputElement>('input[name="image"]');
      if (imageInput?.files?.[0]) {
        formData.append('image', imageInput.files[0]);
      }

      if (editingItem) {
        await portfolioAPI.update(editingItem.id, formData);
      } else {
        await portfolioAPI.create(formData);
      }

      setShowModal(false);
      reset();
      setEditingItem(null);
      fetchPortfolio();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save portfolio item');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (item: PortfolioItem) => {
    setEditingItem(item);
    reset({
      title: item.title,
      description: item.description || '',
      link: item.link || '',
    });
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this item?')) return;

    try {
      await portfolioAPI.delete(id);
      fetchPortfolio();
    } catch (err: any) {
      setError('Failed to delete portfolio item');
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingItem(null);
    reset();
  };

  if (isFetching) {
    return <div className="text-center py-12">Loading...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">Manage Portfolio</h1>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add Project
        </button>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-800 text-red-700 dark:text-red-400 rounded-lg">
          {error}
        </div>
      )}

      {portfolio.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-zinc-900 rounded-lg shadow">
          <p className="text-zinc-600 dark:text-zinc-400">No portfolio items yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {portfolio.map((item) => (
            <div
              key={item.id}
              className="bg-white dark:bg-zinc-900 rounded-lg shadow overflow-hidden"
            >
              {item.imageUrl && (
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-48 object-cover"
                />
              )}
              <div className="p-4">
                <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50 mb-2">
                  {item.title}
                </h3>
                {item.description && (
                  <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4 line-clamp-2">
                    {item.description}
                  </p>
                )}
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(item)}
                    className="flex-1 px-3 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
                  >
                    <Edit className="w-4 h-4 inline mr-1" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="flex-1 px-3 py-2 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors"
                  >
                    <Trash2 className="w-4 h-4 inline mr-1" />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b border-zinc-200 dark:border-zinc-800">
              <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
                {editingItem ? 'Edit Project' : 'Add Project'}
              </h2>
              <button
                onClick={handleCloseModal}
                className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-50"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  {...register('title')}
                  className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 focus:ring-2 focus:ring-blue-500"
                />
                {errors.title && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {errors.title.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                  Description
                </label>
                <textarea
                  {...register('description')}
                  rows={4}
                  className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                  Link
                </label>
                <input
                  type="url"
                  {...register('link')}
                  className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 focus:ring-2 focus:ring-blue-500"
                />
                {errors.link && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {errors.link.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                  Image
                </label>
                <input
                  type="file"
                  name="image"
                  accept="image/*"
                  className="block w-full text-sm text-zinc-700 dark:text-zinc-300 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isLoading ? 'Saving...' : 'Save'}
                </button>
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="flex-1 px-6 py-2 bg-zinc-200 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 rounded-lg hover:bg-zinc-300 dark:hover:bg-zinc-700 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

