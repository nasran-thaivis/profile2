'use client';

import { useState, useRef } from 'react';
import { X, GripVertical, Type, Award, TrendingUp, Image as ImageIcon, Calendar, BarChart, LucideIcon, Upload } from 'lucide-react';
import { aboutAPI, getImageUrl } from '@/lib/api';

export type BlockType = 'text' | 'skills' | 'achievements' | 'timeline' | 'stats' | 'image';

export interface TextBlockData {
  content: string;
}

export interface SkillsBlockData {
  items: string[];
}

export interface AchievementItem {
  title: string;
  description: string;
}

export interface AchievementsBlockData {
  items: AchievementItem[];
}

export interface TimelineItem {
  year: string;
  title: string;
  description: string;
}

export interface TimelineBlockData {
  items: TimelineItem[];
}

export interface StatItem {
  label: string;
  value: string;
}

export interface StatsBlockData {
  items: StatItem[];
}

export interface ImageBlockData {
  url: string;
  alt: string;
}

export type BlockData = TextBlockData | SkillsBlockData | AchievementsBlockData | TimelineBlockData | StatsBlockData | ImageBlockData;

export interface AboutBlock {
  id: string;
  type: BlockType;
  data: BlockData;
}

interface AboutBlockEditorProps {
  blocks: AboutBlock[];
  onChange: (blocks: AboutBlock[]) => void;
}

const blockTypes: { type: BlockType; label: string; icon: LucideIcon }[] = [
  { type: 'text', label: 'Text', icon: Type },
  { type: 'skills', label: 'Skills', icon: Award },
  { type: 'achievements', label: 'Achievements', icon: TrendingUp },
  { type: 'timeline', label: 'Timeline', icon: Calendar },
  { type: 'stats', label: 'Stats', icon: BarChart },
  { type: 'image', label: 'Image', icon: ImageIcon },
];

export default function AboutBlockEditor({ blocks, onChange }: AboutBlockEditorProps) {
  const [editingBlock, setEditingBlock] = useState<string | null>(null);
  const idCounterRef = useRef(0);

  const generateId = () => {
    idCounterRef.current += 1;
    // Generate unique ID using counter (safe in event handlers)
    return `block-${idCounterRef.current}`;
  };

  const addBlock = (type: BlockType) => {
    const newBlock: AboutBlock = {
      id: generateId(),
      type,
      data: getDefaultData(type),
    };
    onChange([...blocks, newBlock]);
    setEditingBlock(newBlock.id);
  };

  const removeBlock = (id: string) => {
    onChange(blocks.filter(b => b.id !== id));
  };

  const updateBlock = (id: string, data: BlockData) => {
    onChange(blocks.map(b => b.id === id ? { ...b, data } : b));
  };

  const moveBlock = (fromIndex: number, toIndex: number) => {
    const newBlocks = [...blocks];
    const [moved] = newBlocks.splice(fromIndex, 1);
    newBlocks.splice(toIndex, 0, moved);
    onChange(newBlocks);
  };

  return (
    <div className="space-y-4">
      {/* Add Block Buttons */}
      <div className="flex flex-wrap gap-2 p-4 bg-zinc-50 dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700">
        <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300 w-full mb-2">Add Block:</span>
        {blockTypes.map(({ type, label, icon: Icon }) => (
          <button
            key={type}
            type="button"
            onClick={() => addBlock(type)}
            className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors text-sm"
          >
            <Icon size={16} />
            {label}
          </button>
        ))}
      </div>

      {/* Blocks List */}
      <div className="space-y-4">
        {blocks.map((block, index) => (
          <BlockItem
            key={block.id}
            block={block}
            isEditing={editingBlock === block.id}
            onEdit={() => setEditingBlock(block.id)}
            onSave={() => setEditingBlock(null)}
            onRemove={() => removeBlock(block.id)}
            onUpdate={(data) => updateBlock(block.id, data)}
            onMoveUp={index > 0 ? () => moveBlock(index, index - 1) : undefined}
            onMoveDown={index < blocks.length - 1 ? () => moveBlock(index, index + 1) : undefined}
          />
        ))}
      </div>

      {blocks.length === 0 && (
        <div className="text-center py-12 text-zinc-500 dark:text-zinc-400 border-2 border-dashed border-zinc-300 dark:border-zinc-700 rounded-lg">
          <p>No blocks yet. Click buttons above to add content blocks.</p>
        </div>
      )}
    </div>
  );
}

interface BlockItemProps {
  block: AboutBlock;
  isEditing: boolean;
  onEdit: () => void;
  onSave: () => void;
  onRemove: () => void;
  onUpdate: (data: BlockData) => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
}

function BlockItem({ block, isEditing, onEdit, onSave, onRemove, onUpdate, onMoveUp, onMoveDown }: BlockItemProps) {
  const blockType = blockTypes.find(bt => bt.type === block.type);
  const Icon = blockType?.icon || Type;

  return (
    <div className="border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-900">
      {/* Block Header */}
      <div className="flex items-center justify-between p-3 bg-zinc-50 dark:bg-zinc-800 border-b border-zinc-200 dark:border-zinc-700">
        <div className="flex items-center gap-2">
          <GripVertical className="text-zinc-400" size={16} />
          <Icon size={16} />
          <span className="font-medium text-sm text-zinc-700 dark:text-zinc-300">
            {blockType?.label} Block
          </span>
        </div>
        <div className="flex items-center gap-2">
          {onMoveUp && (
            <button
              type="button"
              onClick={onMoveUp}
              className="p-1 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded text-zinc-600 dark:text-zinc-400"
            >
              ↑
            </button>
          )}
          {onMoveDown && (
            <button
              type="button"
              onClick={onMoveDown}
              className="p-1 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded text-zinc-600 dark:text-zinc-400"
            >
              ↓
            </button>
          )}
          {isEditing ? (
            <button
              type="button"
              onClick={onSave}
              className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Save
            </button>
          ) : (
            <button
              type="button"
              onClick={onEdit}
              className="px-3 py-1 text-sm bg-zinc-200 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300 rounded hover:bg-zinc-300 dark:hover:bg-zinc-600"
            >
              Edit
            </button>
          )}
          <button
            type="button"
            onClick={onRemove}
            className="p-1 hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 rounded"
          >
            <X size={16} />
          </button>
        </div>
      </div>

      {/* Block Content */}
      <div className="p-4">
        {isEditing ? (
          <BlockEditor block={block} onUpdate={onUpdate} />
        ) : (
          <BlockPreview block={block} />
        )}
      </div>
    </div>
  );
}

interface BlockEditorProps {
  block: AboutBlock;
  onUpdate: (data: BlockData) => void;
}

function BlockEditor({ block, onUpdate }: BlockEditorProps) {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  switch (block.type) {
    case 'text': {
      const textData = block.data as TextBlockData;
      return (
        <textarea
          value={textData.content || ''}
          onChange={(e) => onUpdate({ content: e.target.value } as TextBlockData)}
          rows={6}
          className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50"
          placeholder="Enter text content..."
        />
      );
    }

    case 'skills': {
      const skillsData = block.data as SkillsBlockData;
      const skills = skillsData.items || [''];
      return (
        <div className="space-y-2">
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Skill Items (one per line or comma-separated)</label>
          <textarea
            value={skills.join('\n')}
            onChange={(e) => {
              const items = e.target.value.split('\n').filter(s => s.trim());
              onUpdate({ items } as SkillsBlockData);
            }}
            rows={6}
            className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50"
            placeholder="JavaScript&#10;React&#10;Node.js"
          />
        </div>
      );
    }

    case 'achievements': {
      const achievementsData = block.data as AchievementsBlockData;
      const achievements = achievementsData.items || [{ title: '', description: '' }];
      return (
        <div className="space-y-3">
          {achievements.map((item, idx: number) => (
            <div key={idx} className="border border-zinc-200 dark:border-zinc-700 rounded p-3">
              <input
                type="text"
                value={item.title || ''}
                onChange={(e) => {
                  const newItems = [...achievements];
                  newItems[idx] = { ...item, title: e.target.value };
                  onUpdate({ items: newItems } as AchievementsBlockData);
                }}
                placeholder="Achievement title"
                className="w-full mb-2 px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50"
              />
              <textarea
                value={item.description || ''}
                onChange={(e) => {
                  const newItems = [...achievements];
                  newItems[idx] = { ...item, description: e.target.value };
                  onUpdate({ items: newItems } as AchievementsBlockData);
                }}
                placeholder="Description"
                rows={2}
                className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50"
              />
            </div>
          ))}
          <button
            type="button"
            onClick={() => onUpdate({ items: [...achievements, { title: '', description: '' }] } as AchievementsBlockData)}
            className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
          >
            + Add Achievement
          </button>
        </div>
      );
    }

    case 'timeline': {
      const timelineData = block.data as TimelineBlockData;
      const timeline = timelineData.items || [{ year: '', title: '', description: '' }];
      return (
        <div className="space-y-3">
          {timeline.map((item, idx: number) => (
            <div key={idx} className="border border-zinc-200 dark:border-zinc-700 rounded p-3">
              <input
                type="text"
                value={item.year || ''}
                onChange={(e) => {
                  const newItems = [...timeline];
                  newItems[idx] = { ...item, year: e.target.value };
                  onUpdate({ items: newItems } as TimelineBlockData);
                }}
                placeholder="Year"
                className="w-full mb-2 px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50"
              />
              <input
                type="text"
                value={item.title || ''}
                onChange={(e) => {
                  const newItems = [...timeline];
                  newItems[idx] = { ...item, title: e.target.value };
                  onUpdate({ items: newItems } as TimelineBlockData);
                }}
                placeholder="Title"
                className="w-full mb-2 px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50"
              />
              <textarea
                value={item.description || ''}
                onChange={(e) => {
                  const newItems = [...timeline];
                  newItems[idx] = { ...item, description: e.target.value };
                  onUpdate({ items: newItems } as TimelineBlockData);
                }}
                placeholder="Description"
                rows={2}
                className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50"
              />
            </div>
          ))}
          <button
            type="button"
            onClick={() => onUpdate({ items: [...timeline, { year: '', title: '', description: '' }] } as TimelineBlockData)}
            className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
          >
            + Add Timeline Item
          </button>
        </div>
      );
    }

    case 'stats': {
      const statsData = block.data as StatsBlockData;
      const stats = statsData.items || [{ label: '', value: '' }];
      return (
        <div className="space-y-3">
          {stats.map((item, idx: number) => (
            <div key={idx} className="flex gap-2">
              <input
                type="text"
                value={item.label || ''}
                onChange={(e) => {
                  const newItems = [...stats];
                  newItems[idx] = { ...item, label: e.target.value };
                  onUpdate({ items: newItems } as StatsBlockData);
                }}
                placeholder="Label"
                className="flex-1 px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50"
              />
              <input
                type="text"
                value={item.value || ''}
                onChange={(e) => {
                  const newItems = [...stats];
                  newItems[idx] = { ...item, value: e.target.value };
                  onUpdate({ items: newItems } as StatsBlockData);
                }}
                placeholder="Value"
                className="flex-1 px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50"
              />
            </div>
          ))}
          <button
            type="button"
            onClick={() => onUpdate({ items: [...stats, { label: '', value: '' }] } as StatsBlockData)}
            className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
          >
            + Add Stat
          </button>
        </div>
      );
    }

    case 'image': {
      const imageData = block.data as ImageBlockData;

      const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
          alert('Please select an image file');
          return;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
          alert('Image size must be less than 5MB');
          return;
        }

        try {
          setUploading(true);
          const response = await aboutAPI.uploadImage(file);
          onUpdate({ ...imageData, url: response.data.url } as ImageBlockData);
        } catch (err: unknown) {
          const error = err as { response?: { data?: { message?: string } } };
          alert(error.response?.data?.message || 'Failed to upload image');
        } finally {
          setUploading(false);
          // Reset file input
          if (fileInputRef.current) {
            fileInputRef.current.value = '';
          }
        }
      };

      return (
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
              Image
            </label>
            <div className="flex gap-2">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
                id={`image-upload-${block.id}`}
                disabled={uploading}
              />
              <label
                htmlFor={`image-upload-${block.id}`}
                className={`flex items-center gap-2 px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <Upload size={16} />
                {uploading ? 'Uploading...' : 'Choose Image'}
              </label>
              {imageData.url && (
                <button
                  type="button"
                  onClick={() => onUpdate({ ...imageData, url: '' } as ImageBlockData)}
                  className="px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                >
                  Remove
                </button>
              )}
            </div>
            {imageData.url && (
              <div className="mt-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={getImageUrl(imageData.url)}
                  alt={imageData.alt || 'Preview'}
                  className="max-w-full h-auto max-h-48 rounded border border-zinc-300 dark:border-zinc-700"
                />
              </div>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
              Alt Text
            </label>
            <input
              type="text"
              value={imageData.alt || ''}
              onChange={(e) => onUpdate({ ...imageData, alt: e.target.value } as ImageBlockData)}
              placeholder="Describe the image for accessibility"
              className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50"
            />
          </div>
        </div>
      );
    }

    default:
      return null;
  }
}

interface BlockPreviewProps {
  block: AboutBlock;
}

function BlockPreview({ block }: BlockPreviewProps) {
  switch (block.type) {
    case 'text': {
      const textData = block.data as TextBlockData;
      return <p className="text-zinc-600 dark:text-zinc-400 whitespace-pre-line">{textData.content || 'Empty text block'}</p>;
    }
    case 'skills': {
      const skillsData = block.data as SkillsBlockData;
      return (
        <div className="flex flex-wrap gap-2">
          {(skillsData.items || []).map((skill: string, idx: number) => (
            <span key={idx} className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm">
              {skill}
            </span>
          ))}
        </div>
      );
    }
    case 'achievements': {
      const achievementsData = block.data as AchievementsBlockData;
      return (
        <div className="space-y-2">
          {(achievementsData.items || []).map((item, idx: number) => (
            <div key={idx} className="text-sm">
              <strong className="text-zinc-900 dark:text-zinc-100">{item.title || 'Untitled'}</strong>
              {item.description && <p className="text-zinc-600 dark:text-zinc-400">{item.description}</p>}
            </div>
          ))}
        </div>
      );
    }
    case 'timeline': {
      const timelineData = block.data as TimelineBlockData;
      return (
        <div className="space-y-2">
          {(timelineData.items || []).map((item, idx: number) => (
            <div key={idx} className="text-sm">
              <span className="font-bold text-blue-600 dark:text-blue-400">{item.year || 'Year'}</span>
              <span className="mx-2">-</span>
              <span className="text-zinc-900 dark:text-zinc-100">{item.title || 'Title'}</span>
              {item.description && <p className="text-zinc-600 dark:text-zinc-400 ml-4">{item.description}</p>}
            </div>
          ))}
        </div>
      );
    }
    case 'stats': {
      const statsData = block.data as StatsBlockData;
      return (
        <div className="grid grid-cols-2 gap-4">
          {(statsData.items || []).map((item, idx: number) => (
            <div key={idx} className="text-center">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{item.value || '0'}</div>
              <div className="text-sm text-zinc-600 dark:text-zinc-400">{item.label || 'Label'}</div>
            </div>
          ))}
        </div>
      );
    }
    case 'image': {
      const imageData = block.data as ImageBlockData;
      return imageData.url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={getImageUrl(imageData.url)} alt={imageData.alt || ''} className="max-w-full h-auto rounded" />
      ) : (
        <p className="text-zinc-400 text-sm">No image URL provided</p>
      );
    }
    default:
      return null;
  }
}

function getDefaultData(type: BlockType): BlockData {
  switch (type) {
    case 'text':
      return { content: '' } as TextBlockData;
    case 'skills':
      return { items: [] } as SkillsBlockData;
    case 'achievements':
      return { items: [{ title: '', description: '' }] } as AchievementsBlockData;
    case 'timeline':
      return { items: [{ year: '', title: '', description: '' }] } as TimelineBlockData;
    case 'stats':
      return { items: [{ label: '', value: '' }] } as StatsBlockData;
    case 'image':
      return { url: '', alt: '' } as ImageBlockData;
    default:
      return { content: '' } as TextBlockData;
  }
}

