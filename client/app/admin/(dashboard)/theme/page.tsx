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
  // New 3D properties
  gradientStart?: string;
  gradientEnd?: string;
  glowColor?: string;
  shadowColor?: string;
}

interface ThemeData {
  preset?: 'glass-corporate' | 'neon-cyber' | 'crypto-verse' | 'light' | 'dark' | 'vibrant' | 'custom';
  colors?: ThemeColors;
  // Backward compatibility: if preset doesn't exist, treat colors at root level
  primary?: string;
  secondary?: string;
  accent?: string;
  background?: string;
  text?: string;
  card?: string;
  border?: string;
}

type ThemePreset = 'glass-corporate' | 'neon-cyber' | 'crypto-verse';

interface ThemePresetDefinition {
  name: string;
  description: string;
  colors: ThemeColors;
}

const THEME_PRESETS: Record<ThemePreset, ThemePresetDefinition> = {
  'glass-corporate': {
    name: 'Glass 3D Corporate',
    description: 'Clean white 3D with glass morphism - High-gloss floating cards',
    colors: {
      primary: '#8b5cf6', // Purple
      secondary: '#ec4899', // Pink
      accent: '#10b981', // Green
      background: '#ffffff', // Pure white
      text: '#1f2937', // Dark gray
      card: 'rgba(255, 255, 255, 0.9)', // High-gloss white
      border: 'rgba(139, 92, 246, 0.2)', // Purple border
      gradientStart: '#8b5cf6', // Purple
      gradientEnd: '#ec4899', // Pink
      glowColor: 'rgba(139, 92, 246, 0.3)',
      shadowColor: 'rgba(0, 0, 0, 0.25)',
    },
  },
  'neon-cyber': {
    name: 'Neon Cyber 3D',
    description: 'Cyberpunk/Gamer style - Neon glows with holographic effects',
    colors: {
      primary: '#06b6d4', // Neon Cyan
      secondary: '#ec4899', // Hot Pink
      accent: '#10b981', // Neon Green
      background: '#0a0a0a', // Deep black
      text: '#fafafa', // Near white
      card: 'rgba(26, 26, 46, 0.8)', // Dark with transparency
      border: 'rgba(6, 182, 212, 0.5)', // Cyan border
      gradientStart: '#06b6d4', // Neon Cyan
      gradientEnd: '#ec4899', // Hot Pink
      glowColor: 'rgba(6, 182, 212, 0.5)', // Cyan glow
      shadowColor: 'rgba(6, 182, 212, 0.3)',
    },
  },
  'crypto-verse': {
    name: 'Crypto Verse 3D',
    description: 'Premium isometric 3D - Gem-like buttons with beveled edges',
    colors: {
      primary: '#8b5cf6', // Electric Purple
      secondary: '#f59e0b', // Gold
      accent: '#ef4444', // Orange
      background: '#1a1a2e', // Deep Violet/Midnight Blue
      text: '#fafafa', // White
      card: 'rgba(26, 26, 46, 0.9)', // Dark purple-blue
      border: 'rgba(139, 92, 246, 0.3)', // Purple border
      gradientStart: '#8b5cf6', // Electric Purple
      gradientEnd: '#f59e0b', // Gold
      glowColor: 'rgba(139, 92, 246, 0.4)',
      shadowColor: 'rgba(0, 0, 0, 0.4)',
    },
  },
};

export default function ThemePage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [selectedPreset, setSelectedPreset] = useState<ThemePreset | 'custom'>('glass-corporate');
  const [showCustomization, setShowCustomization] = useState(false);
  const [colors, setColors] = useState<ThemeColors>(THEME_PRESETS['glass-corporate'].colors);

  useEffect(() => {
    const fetchTheme = async () => {
      try {
        const response = await themeAPI.getTheme();
        const themeData: ThemeData = response.data || {};
        
        // Handle backward compatibility: if preset exists, use it; otherwise treat as legacy
        if (themeData.preset && themeData.preset !== 'custom' && themeData.colors) {
          // Map old theme names to new ones for backward compatibility
          let mappedPreset: ThemePreset | 'custom' = 'custom';
          if (themeData.preset === 'light' || themeData.preset === 'glass-corporate') {
            mappedPreset = 'glass-corporate';
          } else if (themeData.preset === 'dark' || themeData.preset === 'neon-cyber') {
            mappedPreset = 'neon-cyber';
          } else if (themeData.preset === 'vibrant' || themeData.preset === 'crypto-verse') {
            mappedPreset = 'crypto-verse';
          } else if (themeData.preset === 'glass-corporate' || themeData.preset === 'neon-cyber' || themeData.preset === 'crypto-verse') {
            mappedPreset = themeData.preset as ThemePreset;
          }
          
          if (mappedPreset !== 'custom' && mappedPreset in THEME_PRESETS) {
            setSelectedPreset(mappedPreset);
            setColors(themeData.colors);
          } else {
            setSelectedPreset('custom');
            setColors(themeData.colors);
          }
        } else if (themeData.preset === 'custom' && themeData.colors) {
          // Custom preset with custom colors
          setSelectedPreset('custom');
          setColors(themeData.colors);
        } else if (themeData.primary || themeData.background) {
          // Legacy structure: colors at root level
          setSelectedPreset('custom');
          setColors({
            primary: themeData.primary,
            secondary: themeData.secondary,
            accent: themeData.accent,
            background: themeData.background,
            text: themeData.text,
            card: themeData.card,
            border: themeData.border,
          });
        } else {
          // No theme saved, use default
          setSelectedPreset('glass-corporate');
          setColors(THEME_PRESETS['glass-corporate'].colors);
        }
        setIsFetching(false);
      } catch (err: unknown) {
        console.error('Failed to load theme:', err);
        setIsFetching(false);
      }
    };
    fetchTheme();
  }, []);

  const handlePresetSelect = (preset: ThemePreset) => {
    setSelectedPreset(preset);
    setColors(THEME_PRESETS[preset].colors);
    setShowCustomization(false);
    
    // Auto-save when preset is selected
    handleSavePreset(preset, THEME_PRESETS[preset].colors);
  };

  const handleSavePreset = async (preset: ThemePreset, presetColors: ThemeColors) => {
    try {
      setIsLoading(true);
      setError('');
      setSuccess('');

      const themeData = {
        preset,
        colors: presetColors,
      };

      await themeAPI.updateTheme(themeData);
      setSuccess('Theme applied successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(error.response?.data?.message || 'Failed to update theme');
    } finally {
      setIsLoading(false);
    }
  };

  const handleColorChange = (key: keyof ThemeColors, value: string) => {
    const newColors = { ...colors, [key]: value };
    setColors(newColors);
    // Mark as custom when user manually changes colors
    if (selectedPreset !== 'custom') {
      setSelectedPreset('custom');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      setError('');
      setSuccess('');

      const themeData = {
        preset: selectedPreset === 'custom' ? 'custom' : selectedPreset,
        colors,
      };

      await themeAPI.updateTheme(themeData);
      setSuccess('Theme updated successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(error.response?.data?.message || 'Failed to update theme');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetToPreset = () => {
    if (selectedPreset !== 'custom' && selectedPreset in THEME_PRESETS) {
      setColors(THEME_PRESETS[selectedPreset as ThemePreset].colors);
    }
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
    <div className="max-w-6xl mx-auto">
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

      {/* Theme Preset Selection */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50 mb-4">Choose a 3D Theme</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {(Object.keys(THEME_PRESETS) as ThemePreset[]).map((preset) => {
            const presetData = THEME_PRESETS[preset];
            const isSelected = selectedPreset === preset;
            const get3DClass = () => {
              if (preset === 'glass-corporate') return 'glass-3d-card';
              if (preset === 'neon-cyber') return 'neon-3d-card';
              if (preset === 'crypto-verse') return 'crypto-3d-card';
              return '';
            };
            return (
              <button
                key={preset}
                type="button"
                onClick={() => handlePresetSelect(preset)}
                className={`relative p-6 rounded-2xl transition-all text-left ${get3DClass()} ${
                  isSelected
                    ? 'ring-4 ring-blue-500/30 dark:ring-blue-400/30 scale-105'
                    : 'hover:scale-102'
                }`}
                style={{
                  backgroundColor: presetData.colors.background,
                }}
              >
                {isSelected && (
                  <div className="absolute top-3 right-3 w-7 h-7 rounded-full flex items-center justify-center shadow-lg"
                    style={{
                      background: preset === 'glass-corporate' 
                        ? 'linear-gradient(135deg, #8b5cf6, #ec4899)'
                        : preset === 'neon-cyber'
                        ? 'linear-gradient(135deg, #06b6d4, #ec4899)'
                        : 'linear-gradient(135deg, #8b5cf6, #f59e0b)'
                    }}
                  >
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                )}
                <div className="mb-4">
                  <h3 
                    className="text-lg font-bold mb-2"
                    style={{ color: presetData.colors.text }}
                  >
                    {presetData.name}
                  </h3>
                  <p 
                    className="text-sm"
                    style={{ color: presetData.colors.text, opacity: 0.8 }}
                  >
                    {presetData.description}
                  </p>
                </div>
                <div className="flex gap-2 mb-3">
                  <div
                    className="flex-1 h-10 rounded-lg"
                    style={{ 
                      background: presetData.colors.gradientStart && presetData.colors.gradientEnd
                        ? `linear-gradient(135deg, ${presetData.colors.gradientStart}, ${presetData.colors.gradientEnd})`
                        : presetData.colors.primary
                    }}
                  />
                  <div
                    className="flex-1 h-10 rounded-lg"
                    style={{ backgroundColor: presetData.colors.secondary }}
                  />
                  <div
                    className="flex-1 h-10 rounded-lg"
                    style={{ backgroundColor: presetData.colors.accent }}
                  />
                </div>
                <div className="text-xs font-medium" style={{ color: presetData.colors.text, opacity: 0.6 }}>
                  Hover to see 3D effect →
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Live Preview */}
      <div className="mb-8 bg-white dark:bg-zinc-900 rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50 mb-4">3D Live Preview</h2>
        <div
          className="rounded-xl p-6 transition-all"
          style={{
            backgroundColor: colors.background || '#ffffff',
          }}
        >
          <div
            className={`rounded-2xl p-6 mb-4 ${
              selectedPreset === 'glass-corporate' ? 'glass-3d-card' :
              selectedPreset === 'neon-cyber' ? 'neon-3d-card' :
              selectedPreset === 'crypto-verse' ? 'crypto-3d-card' :
              'rounded-lg border-2'
            }`}
            style={{
              backgroundColor: selectedPreset === 'custom' ? (colors.card || '#ffffff') : undefined,
              borderColor: selectedPreset === 'custom' ? (colors.border || '#e4e4e7') : undefined,
            }}
          >
            <h3
              className="text-2xl font-bold mb-2"
              style={{ color: colors.text || '#18181b' }}
            >
              Sample 3D Card Title
            </h3>
            <p
              className="text-sm mb-4"
              style={{ color: colors.text || '#18181b', opacity: 0.7 }}
            >
              This is how your 3D theme will look on your profile page. Hover over the card to see the depth effect.
            </p>
            <div className="flex gap-2 flex-wrap">
              <button
                className={`px-4 py-2 rounded-lg font-medium text-white transition-all ${
                  selectedPreset === 'glass-corporate' ? 'glass-3d-button' :
                  selectedPreset === 'neon-cyber' ? 'neon-3d-button' :
                  selectedPreset === 'crypto-verse' ? 'crypto-3d-button' :
                  ''
                }`}
                style={{
                  background: colors.gradientStart && colors.gradientEnd
                    ? `linear-gradient(135deg, ${colors.gradientStart}, ${colors.gradientEnd})`
                    : (colors.primary || '#3b82f6'),
                }}
              >
                Primary Button
              </button>
              <button
                className={`px-4 py-2 rounded-lg font-medium text-white transition-all ${
                  selectedPreset === 'glass-corporate' ? 'glass-3d-button' :
                  selectedPreset === 'neon-cyber' ? 'neon-3d-button' :
                  selectedPreset === 'crypto-verse' ? 'crypto-3d-button' :
                  ''
                }`}
                style={{
                  background: colors.gradientStart && colors.gradientEnd
                    ? `linear-gradient(135deg, ${colors.gradientStart}, ${colors.gradientEnd})`
                    : (colors.secondary || '#8b5cf6'),
                }}
              >
                Secondary
              </button>
              <span
                className={`px-4 py-2 rounded-lg font-medium ${
                  selectedPreset === 'glass-corporate' ? 'glass-3d-button' :
                  selectedPreset === 'neon-cyber' ? 'neon-3d-button' :
                  selectedPreset === 'crypto-verse' ? 'crypto-3d-button' :
                  ''
                }`}
                style={{
                  background: colors.gradientStart && colors.gradientEnd
                    ? `linear-gradient(135deg, ${colors.gradientStart}, ${colors.gradientEnd})`
                    : (colors.accent || '#10b981'),
                  color: '#ffffff',
                }}
              >
                Accent
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Color Customization */}
      <div className="bg-white dark:bg-zinc-900 rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">Customize Colors</h2>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
              Adjust individual colors to personalize your theme
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowCustomization(!showCustomization)}
            className="px-4 py-2 text-sm bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
          >
            {showCustomization ? 'Hide' : 'Show'} Customization
          </button>
        </div>

        {showCustomization && (
          <form onSubmit={handleSubmit} className="space-y-6">
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
                {isLoading ? 'Saving...' : 'Save Custom Theme'}
              </button>
              {selectedPreset !== 'custom' && (
                <button
                  type="button"
                  onClick={handleResetToPreset}
                  className="px-6 py-2 bg-zinc-200 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300 rounded-lg hover:bg-zinc-300 dark:hover:bg-zinc-600 transition-colors"
                >
                  Reset to {THEME_PRESETS[selectedPreset as ThemePreset].name} Preset
                </button>
              )}
            </div>
          </form>
        )}
      </div>

      <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
        <p className="text-sm text-blue-800 dark:text-blue-300">
          <strong>Note:</strong> Select a theme preset to apply it immediately, or customize colors for a personalized look. 
          Theme colors are saved and will be applied to your public profile page.
        </p>
      </div>
    </div>
  );
}

