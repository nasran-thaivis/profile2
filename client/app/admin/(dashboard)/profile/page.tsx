'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { profileAPI } from '@/lib/api';
import { useRouter } from 'next/navigation';

const profileSchema = z.object({
  displayName: z.string().optional(),
  bio: z.string().optional(),
  email: z.string().email().optional().or(z.literal('')),
  phone: z.string().optional(),
  location: z.string().optional(),
  website: z.string().url().optional().or(z.literal('')),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export default function EditProfilePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [avatarPreview, setAvatarPreview] = useState<string>('');

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { authAPI } = await import('@/lib/api');
        const meResponse = await authAPI.getMe();
        const username = meResponse.data.username;
        
        const profileResponse = await profileAPI.getByUsername(username);
        const profile = profileResponse.data;
        
        setValue('displayName', profile.displayName || '');
        setValue('bio', profile.bio || '');
        
        if (profile.contactInfo) {
          setValue('email', profile.contactInfo.email || '');
          setValue('phone', profile.contactInfo.phone || '');
          setValue('location', profile.contactInfo.location || '');
          setValue('website', profile.contactInfo.website || '');
        }
        
        if (profile.avatarUrl) {
          setAvatarPreview(profile.avatarUrl);
        }
        
        setIsFetching(false);
      } catch (err) {
        setError('Failed to load profile');
        setIsFetching(false);
      }
    };
    fetchProfile();
  }, [router, setValue]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data: ProfileFormData) => {
    try {
      setIsLoading(true);
      setError('');
      setSuccess('');

      const formData = new FormData();
      formData.append('displayName', data.displayName || '');
      formData.append('bio', data.bio || '');

      const contactInfo: any = {};
      if (data.email) contactInfo.email = data.email;
      if (data.phone) contactInfo.phone = data.phone;
      if (data.location) contactInfo.location = data.location;
      if (data.website) contactInfo.website = data.website;

      formData.append('contactInfo', JSON.stringify(contactInfo));

      const avatarInput = document.querySelector<HTMLInputElement>('input[type="file"]');
      if (avatarInput?.files?.[0]) {
        formData.append('avatar', avatarInput.files[0]);
      }

      await profileAPI.update(formData);
      setSuccess('Profile updated successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return <div className="text-center py-12">Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50 mb-8">Edit Profile</h1>

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

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-white dark:bg-zinc-900 rounded-lg shadow p-6">
        <div>
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
            Avatar
          </label>
          <div className="flex items-center gap-4">
            {avatarPreview && (
              <img
                src={avatarPreview}
                alt="Preview"
                className="w-20 h-20 rounded-full object-cover"
              />
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="block w-full text-sm text-zinc-700 dark:text-zinc-300 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
            Display Name
          </label>
          <input
            type="text"
            {...register('displayName')}
            className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
            Bio
          </label>
          <textarea
            {...register('bio')}
            rows={4}
            className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
              Email
            </label>
            <input
              type="email"
              {...register('email')}
              className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 focus:ring-2 focus:ring-blue-500"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
              Phone
            </label>
            <input
              type="tel"
              {...register('phone')}
              className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
              Location
            </label>
            <input
              type="text"
              {...register('location')}
              className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
              Website
            </label>
            <input
              type="url"
              {...register('website')}
              className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 focus:ring-2 focus:ring-blue-500"
            />
            {errors.website && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.website.message}</p>
            )}
          </div>
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

