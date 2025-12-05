'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { profileAPI, getImageUrl } from '@/lib/api';
import { useRouter } from 'next/navigation';
import { Input } from '@/lib/components/Input';
import { FileInput } from '@/lib/components/FileInput';

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
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    mode: 'onChange',
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

  const handleFileChange = (file: File | null) => {
    setSelectedFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setAvatarPreview('');
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

      if (selectedFile) {
        formData.append('avatar', selectedFile);
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
                src={avatarPreview.startsWith('data:') ? avatarPreview : getImageUrl(avatarPreview)}
                alt="Preview"
                className="w-20 h-20 rounded-full object-cover"
              />
            )}
            <div className="flex-1">
              <FileInput
                label=""
                name="avatar"
                accept="image/*"
                maxSize={5}
                onChange={handleFileChange}
                showPreview={false}
              />
            </div>
          </div>
        </div>

        <Input
          label="Display Name"
          register={register('displayName')}
          type="text"
        />

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
          <Input
            label="Email"
            register={register('email')}
            type="email"
            error={errors.email?.message}
          />

          <Input
            label="Phone"
            register={register('phone')}
            type="tel"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Location"
            register={register('location')}
            type="text"
          />

          <Input
            label="Website"
            register={register('website')}
            type="url"
            error={errors.website?.message}
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

