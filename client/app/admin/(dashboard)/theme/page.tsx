'use client';

import { useState, useEffect } from 'react';
import { themeAPI } from '@/lib/api';

interface ThemeColors {
  primary?: string;
  secondary?: string;
  accent?: string;
  background?: string;
  text?: string;
  card?: string;
  border?: string;
}

export default function ThemePage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [colors, setColors] = useState<ThemeColors>({
    primary: '#3b82f6',
    secondary: '#8b5cf6',
    accent: '#10b981',
    background: '#ffffff',
    text: '#18181b',
    card: '#ffffff',
    border: '#e4e4e7',
  });

  useEffect(() => {
    const fetchTheme = async () => {
      try {
        const response = await themeAPI.getTheme();
        if (response.data && Object.keys(response.data).length > 0) {
          setColors((prev) => ({ ...prev, ...response.data }));
        }
        setIsFetching(false);
      } catch (err: any) {
        console.error('Failed to load theme:', err);
        setIsFetching(false);
      }
    };
    fetchTheme();
  }, []);

  const handleColorChange = (key: keyof ThemeColors, value: string) => {
    setColors((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      setError('');
      setSuccess('');

      await themeAPI.updateTheme(colors);
      setSuccess('Theme updated successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update theme');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setColors({
      primary: '#3b82f6',
      secondary: '#8b5cf6',
      accent: '#10b981',
      background: '#ffffff',
      text: '#18181b',
      card: '#ffffff',
      border: '#e4e4e7',
    });
  };

  if (isFetching) {
    return <div className="text-center py-12">Loading...</div>;
  }

  const colorFields: Array<{ key: keyof ThemeColors; label: string; description: string }> = [
    { key: 'primary', label: 'Primary Color', description: 'Main brand color for buttons and links' },
    { key: 'secondary', label: 'Secondary Color', description: 'Secondary brand color' },
    { key: 'accent', label: 'Accent Color', description: 'Accent color for highlights' },
    { key: 'background', label: 'Background Color', description: 'Main background color' },
    { key: 'text', label: 'Text Color', description: 'Main text color' },
    { key: 'card', label: 'Card Color', description: 'Background color for cards' },
    { key: 'border', label: 'Border Color', description: 'Color for borders' },
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50 mb-8">Theme Settings</h1>

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

      <form onSubmit={handleSubmit} className="space-y-6 bg-white dark:bg-zinc-900 rounded-lg shadow p-6">
        <div className="space-y-6">
          {colorFields.map((field) => (
            <div key={field.key} className="flex items-start gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                  {field.label}
                </label>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-2">{field.description}</p>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={colors[field.key] || '#000000'}
                    onChange={(e) => handleColorChange(field.key, e.target.value)}
                    className="w-16 h-10 rounded border border-zinc-300 dark:border-zinc-700 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={colors[field.key] || ''}
                    onChange={(e) => handleColorChange(field.key, e.target.value)}
                    className="flex-1 px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                    placeholder="#000000"
                  />
                </div>
              </div>
              <div
                className="w-20 h-20 rounded-lg border-2 border-zinc-300 dark:border-zinc-700"
                style={{ backgroundColor: colors[field.key] || '#000000' }}
              />
            </div>
          ))}
        </div>

        <div className="flex gap-4 pt-4 border-t border-zinc-200 dark:border-zinc-800">
          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? 'Saving...' : 'Save Theme'}
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="px-6 py-2 bg-zinc-200 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300 rounded-lg hover:bg-zinc-300 dark:hover:bg-zinc-600 transition-colors"
          >
            Reset to Default
          </button>
        </div>
      </form>

      <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
        <p className="text-sm text-blue-800 dark:text-blue-300">
          <strong>Note:</strong> Theme colors are saved and will be applied to your public profile page. 
          Make sure to choose colors that provide good contrast for readability.
        </p>
      </div>
    </div>
  );
}

