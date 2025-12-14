'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { educationAPI, getImageUrl } from '@/lib/api';
import { Plus, Edit, Trash2, X, GraduationCap, Briefcase, Award } from 'lucide-react';
import { calculateDuration } from '@/lib/utils/dateHelpers';
import { FileInput } from '@/lib/components/FileInput';

const educationSchema = z.object({
  type: z.enum(['EDUCATION', 'WORK', 'INTERNSHIP', 'CERTIFICATE']),
  institution: z.string().min(1, 'สถาบัน/บริษัท จำเป็นต้องกรอก'),
  degree: z.string().min(1, 'วุฒิ/ตำแหน่ง จำเป็นต้องกรอก'),
  field: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().nullable().optional(),
  location: z.string().optional(),
  description: z.string().optional(),
  gpa: z.string().optional(),
  skills: z.string().optional(),
  imageUrl: z.string().optional(),
}).refine((data) => {
  // startDate is required for all types except CERTIFICATE
  if (data.type !== 'CERTIFICATE' && (!data.startDate || data.startDate.length === 0)) {
    return false;
  }
  return true;
}, {
  message: 'วันที่เริ่มต้นจำเป็นต้องกรอก',
  path: ['startDate'],
});

type EducationFormData = z.infer<typeof educationSchema>;

interface EducationItem {
  id: number;
  type: 'EDUCATION' | 'WORK' | 'INTERNSHIP' | 'CERTIFICATE' | 'education' | 'internship'; // รองรับข้อมูลเก่า
  institution: string;
  degree: string;
  field?: string;
  startDate?: string; // optional เพื่อรองรับข้อมูลเก่า
  endDate?: string | null;
  order: number;
  period?: string; // deprecated
  location?: string;
  description?: string;
  gpa?: string;
  skills?: string;
  imageUrl?: string;
  createdAt: string;
  updatedAt?: string;
}

export default function ManageEducationPage() {
  const [items, setItems] = useState<EducationItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<EducationItem | null>(null);
  const [error, setError] = useState<string>('');
  const [isReordering, setIsReordering] = useState(false);
  const [isPresent, setIsPresent] = useState(false);
  const [activeTab, setActiveTab] = useState<'EDUCATION' | 'WORK' | 'INTERNSHIP' | 'CERTIFICATE'>('EDUCATION');
  const [imageUrl, setImageUrl] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);

  const [username, setUsername] = useState<string>('');

  // Filter items by type
  const educationItems = items.filter(item => {
    const itemType = item.type as string;
    return itemType === 'EDUCATION' || itemType === 'education';
  }).sort((a, b) => a.order - b.order);

  const workItems = items.filter(item => {
    const itemType = item.type as string;
    return itemType === 'WORK';
  }).sort((a, b) => a.order - b.order);

  const internshipItems = items.filter(item => {
    const itemType = item.type as string;
    return itemType === 'INTERNSHIP' || itemType === 'internship';
  }).sort((a, b) => a.order - b.order);

  const certificateItems = items.filter(item => {
    const itemType = item.type as string;
    return itemType === 'CERTIFICATE';
  }).sort((a, b) => a.order - b.order);

  // Get current tab items
  const currentTabItems = 
    activeTab === 'EDUCATION' ? educationItems :
    activeTab === 'WORK' ? workItems :
    activeTab === 'INTERNSHIP' ? internshipItems :
    certificateItems;

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<EducationFormData>({
    resolver: zodResolver(educationSchema),
    defaultValues: {
      type: 'EDUCATION',
    },
  });

  const selectedType = watch('type');
  const startDate = watch('startDate');
  const endDate = watch('endDate');

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { authAPI } = await import('@/lib/api');
        const meResponse = await authAPI.getMe();
        setUsername(meResponse.data.username);
      } catch {
        console.error('Failed to get user info');
      }
    };
    fetchUser();
  }, []);

  const fetchItems = async () => {
    if (!username) return;
    try {
      setIsFetching(true);
      const response = await educationAPI.getByUsername(username);
      const sortedItems = (response.data || []).sort((a: EducationItem, b: EducationItem) => {
        if (a.order !== b.order) {
          return a.order - b.order;
        }
        // จัดการกรณีที่ไม่มี startDate
        if (!a.startDate && !b.startDate) return 0;
        if (!a.startDate) return 1;
        if (!b.startDate) return -1;
        return new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
      });
      setItems(sortedItems);
    } catch (err: unknown) {
      console.error('Error fetching items:', err);
      setError('ไม่สามารถโหลดข้อมูลได้');
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    if (username) {
      fetchItems();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [username]);

  const onSubmit = async (data: EducationFormData) => {
    try {
      setIsLoading(true);
      setError('');

      const submitData = {
        ...data,
        endDate: isPresent ? null : data.endDate,
        imageUrl: imageUrl || undefined,
      };

      if (editingItem) {
        await educationAPI.update(editingItem.id, submitData);
      } else {
        await educationAPI.create(submitData);
      }

      setShowModal(false);
      reset();
      setEditingItem(null);
      setIsPresent(false);
      setImageUrl('');
      fetchItems();
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(error.response?.data?.message || 'ไม่สามารถบันทึกข้อมูลได้');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (item: EducationItem) => {
    setEditingItem(item);
    // แปลง type เก่าเป็น type ใหม่
    let type: 'EDUCATION' | 'WORK' | 'INTERNSHIP' | 'CERTIFICATE' = 'EDUCATION';
    const itemType = item.type as string;
    if (itemType === 'WORK') {
      type = 'WORK';
    } else if (itemType === 'INTERNSHIP' || itemType === 'internship') {
      type = 'INTERNSHIP';
    } else if (itemType === 'CERTIFICATE') {
      type = 'CERTIFICATE';
    } else if (itemType === 'EDUCATION' || itemType === 'education') {
      type = 'EDUCATION';
    }
    setValue('type', type);
    setValue('institution', item.institution);
    setValue('degree', item.degree);
    setValue('field', item.field || '');
    setValue('startDate', item.startDate ? item.startDate.split('T')[0] : '');
    setValue('endDate', item.endDate ? item.endDate.split('T')[0] : null);
    setIsPresent(!item.endDate);
    setValue('location', item.location || '');
    setValue('description', item.description || '');
    setValue('gpa', item.gpa || '');
    setValue('skills', item.skills || '');
    setImageUrl(item.imageUrl || '');
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('คุณแน่ใจหรือไม่ว่าต้องการลบรายการนี้?')) return;

    try {
      await educationAPI.delete(id);
      fetchItems();
    } catch {
      setError('ไม่สามารถลบข้อมูลได้');
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingItem(null);
    setImageUrl('');
    reset();
  };

  const handleAddNew = (type: 'EDUCATION' | 'WORK' | 'INTERNSHIP' | 'CERTIFICATE' = activeTab) => {
    setEditingItem(null);
    setIsPresent(false);
    reset({
      type,
      institution: '',
      degree: '',
      field: '',
      startDate: '',
      endDate: null,
      location: '',
      description: '',
      gpa: '',
      skills: '',
    });
    setImageUrl('');
    setShowModal(true);
  };

  const moveItem = (items: EducationItem[], fromIndex: number, toIndex: number) => {
    const newItems = [...items];
    const [moved] = newItems.splice(fromIndex, 1);
    newItems.splice(toIndex, 0, moved);
    return newItems;
  };

  const handleMoveUp = async (index: number) => {
    if (index === 0 || isReordering) return;
    
    // Work with current tab items only
    const tabItems = [...currentTabItems];
    const newTabItems = moveItem(tabItems, index, index - 1);
    
    // Update order values for current tab items only (starting from 0)
    const reorderedItems = newTabItems.map((item, idx) => ({
      id: String(item.id),
      order: idx,
    }));

    // Optimistic update: update only items in current tab, keep other tab items unchanged
    const previousItems = [...items];
    const updatedItems = items.map(item => {
      const itemType = item.type as string;
      const isCurrentTabType = activeTab === 'EDUCATION' 
        ? (itemType === 'EDUCATION' || itemType === 'education')
        : (itemType === 'WORK' || itemType === 'internship');
      
      if (isCurrentTabType) {
        // Find the new order for this item
        const newItem = newTabItems.find(ni => ni.id === item.id);
        if (newItem) {
          const newIndex = newTabItems.indexOf(newItem);
          return { ...item, order: newIndex };
        }
      }
      // Keep other tab items unchanged
      return item;
    });
    
    setItems(updatedItems);

    try {
      setIsReordering(true);
      setError(''); // Clear previous errors
      await educationAPI.reorder(reorderedItems);
      // Success - refresh to get correct state from server
      await fetchItems();
    } catch (err: unknown) {
      console.error('Reorder error:', err);
      const error = err as { response?: { data?: { message?: string | string[] } } };
      const errorMessage = error.response?.data?.message
        ? (Array.isArray(error.response.data.message)
            ? error.response.data.message.join(', ')
            : error.response.data.message)
        : 'ไม่สามารถจัดเรียงลำดับได้';
      setError(errorMessage);
      // Revert on error
      setItems(previousItems);
      // Refresh from server to get correct state
      setTimeout(() => fetchItems(), 500);
    } finally {
      setIsReordering(false);
    }
  };

  const handleMoveDown = async (index: number) => {
    if (index === currentTabItems.length - 1 || isReordering) return;
    
    // Work with current tab items only
    const tabItems = [...currentTabItems];
    const newTabItems = moveItem(tabItems, index, index + 1);
    
    // Update order values for current tab items only (starting from 0)
    const reorderedItems = newTabItems.map((item, idx) => ({
      id: String(item.id),
      order: idx,
    }));

    // Optimistic update: update only items in current tab, keep other tab items unchanged
    const previousItems = [...items];
    const updatedItems = items.map(item => {
      const itemType = item.type as string;
      const isCurrentTabType = activeTab === 'EDUCATION' 
        ? (itemType === 'EDUCATION' || itemType === 'education')
        : (itemType === 'WORK' || itemType === 'internship');
      
      if (isCurrentTabType) {
        // Find the new order for this item
        const newItem = newTabItems.find(ni => ni.id === item.id);
        if (newItem) {
          const newIndex = newTabItems.indexOf(newItem);
          return { ...item, order: newIndex };
        }
      }
      // Keep other tab items unchanged
      return item;
    });
    
    setItems(updatedItems);

    try {
      setIsReordering(true);
      setError(''); // Clear previous errors
      await educationAPI.reorder(reorderedItems);
      // Success - refresh to get correct state from server
      await fetchItems();
    } catch (err: unknown) {
      console.error('Reorder error:', err);
      const error = err as { response?: { data?: { message?: string | string[] } } };
      const errorMessage = error.response?.data?.message
        ? (Array.isArray(error.response.data.message)
            ? error.response.data.message.join(', ')
            : error.response.data.message)
        : 'ไม่สามารถจัดเรียงลำดับได้';
      setError(errorMessage);
      // Revert on error
      setItems(previousItems);
      // Refresh from server to get correct state
      setTimeout(() => fetchItems(), 500);
    } finally {
      setIsReordering(false);
    }
  };

  if (isFetching) {
    return <div className="text-center py-12">กำลังโหลด...</div>;
  }

  // Calculate duration for display
  const durationText = startDate && (isPresent || endDate)
    ? calculateDuration(startDate, isPresent ? null : endDate || null)
    : '';

  // Dynamic label helpers
  const getInstitutionLabel = (type: string) => {
    if (type === 'CERTIFICATE') return 'Issuing Organization';
    if (type === 'EDUCATION') return 'สถาบันการศึกษา';
    if (type === 'WORK' || type === 'INTERNSHIP') return 'ชื่อบริษัท';
    return 'สถาบัน/บริษัท';
  };

  const getDegreeLabel = (type: string) => {
    if (type === 'CERTIFICATE') return 'Certificate Name';
    if (type === 'EDUCATION') return 'วุฒิการศึกษา';
    if (type === 'WORK' || type === 'INTERNSHIP') return 'ตำแหน่ง';
    return 'วุฒิ/ตำแหน่ง';
  };

  const getModalTitle = (type: string, isEditing: boolean) => {
    if (isEditing) return 'แก้ไขข้อมูล';
    const titles: Record<string, string> = {
      'EDUCATION': 'เพิ่มประวัติการศึกษา',
      'WORK': 'เพิ่มประสบการณ์การทำงาน',
      'INTERNSHIP': 'เพิ่มประสบการณ์การฝึกงาน',
      'CERTIFICATE': 'เพิ่มใบรับรอง',
    };
    return titles[type] || 'เพิ่มข้อมูล';
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">Education & Experience</h1>
      </div>

      {/* Tabs */}
      <div className="mb-6 border-b border-zinc-200 dark:border-zinc-700">
        <div className="flex gap-4 flex-wrap">
          <button
            onClick={() => setActiveTab('EDUCATION')}
            className={`px-4 py-2 font-medium text-sm transition-colors ${
              activeTab === 'EDUCATION'
                ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-50'
            }`}
          >
            <div className="flex items-center gap-2">
              <GraduationCap className="w-5 h-5" />
              การศึกษา ({educationItems.length})
            </div>
          </button>
          <button
            onClick={() => setActiveTab('WORK')}
            className={`px-4 py-2 font-medium text-sm transition-colors ${
              activeTab === 'WORK'
                ? 'text-purple-600 dark:text-purple-400 border-b-2 border-purple-600 dark:border-purple-400'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-50'
            }`}
          >
            <div className="flex items-center gap-2">
              <Briefcase className="w-5 h-5" />
              ประสบการณ์การทำงาน ({workItems.length})
            </div>
          </button>
          <button
            onClick={() => setActiveTab('INTERNSHIP')}
            className={`px-4 py-2 font-medium text-sm transition-colors ${
              activeTab === 'INTERNSHIP'
                ? 'text-green-600 dark:text-green-400 border-b-2 border-green-600 dark:border-green-400'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-50'
            }`}
          >
            <div className="flex items-center gap-2">
              <Briefcase className="w-5 h-5" />
              การฝึกงาน ({internshipItems.length})
            </div>
          </button>
          <button
            onClick={() => setActiveTab('CERTIFICATE')}
            className={`px-4 py-2 font-medium text-sm transition-colors ${
              activeTab === 'CERTIFICATE'
                ? 'text-amber-600 dark:text-amber-400 border-b-2 border-amber-600 dark:border-amber-400'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-50'
            }`}
          >
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5" />
              ใบรับรอง ({certificateItems.length})
            </div>
          </button>
        </div>
      </div>

      <div className="flex justify-end mb-6">
        <button
          onClick={() => handleAddNew(activeTab)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          {activeTab === 'EDUCATION' ? 'เพิ่มประวัติการศึกษา' :
           activeTab === 'WORK' ? 'เพิ่มประสบการณ์การทำงาน' :
           activeTab === 'INTERNSHIP' ? 'เพิ่มประสบการณ์การฝึกงาน' :
           'เพิ่มใบรับรอง'}
        </button>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-800 text-red-700 dark:text-red-400 rounded-lg flex justify-between items-center">
          <span>{error}</span>
          <button
            onClick={() => setError('')}
            className="text-red-700 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300 ml-4 font-bold"
            aria-label="ปิด"
          >
            ×
          </button>
        </div>
      )}

      {currentTabItems.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-zinc-900 rounded-lg shadow">
          <p className="text-zinc-600 dark:text-zinc-400">
            ยังไม่มี{activeTab === 'EDUCATION' ? 'ประวัติการศึกษา' : 'ประสบการณ์การทำงาน'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {currentTabItems.map((item, index) => (
            <div
              key={item.id}
              className="bg-white dark:bg-zinc-900 rounded-lg shadow p-6 border border-zinc-200 dark:border-zinc-800"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    {(() => {
                      const itemType = item.type as string;
                      const isEducation = itemType === 'EDUCATION' || itemType === 'education';
                      return isEducation ? (
                        <GraduationCap className="w-6 h-6 text-blue-600" />
                      ) : (
                        <Briefcase className="w-6 h-6 text-purple-600" />
                      );
                    })()}
                    <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
                      {item.institution}
                    </h3>
                    {(() => {
                      const itemType = item.type as string;
                      const isEducation = itemType === 'EDUCATION' || itemType === 'education';
                      return (
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${
                          isEducation
                            ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
                            : 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400'
                        }`}>
                          {isEducation ? 'การศึกษา' : 'การทำงาน'}
                        </span>
                      );
                    })()}
                  </div>
                  <p className="text-lg font-semibold text-zinc-700 dark:text-zinc-300 mb-2">
                    {item.degree}
                    {item.field && <span className="text-zinc-500"> - {item.field}</span>}
                  </p>
                  <div className="flex flex-wrap gap-4 text-sm text-zinc-600 dark:text-zinc-400 mb-2">
                    {item.startDate && (
                      <span>
                        📅 {new Date(item.startDate).toLocaleDateString('th-TH', { year: 'numeric', month: 'short' })} - {item.endDate ? new Date(item.endDate).toLocaleDateString('th-TH', { year: 'numeric', month: 'short' }) : 'ปัจจุบัน'}
                        {calculateDuration(item.startDate, item.endDate || null) && (
                          <span className="ml-2">· {calculateDuration(item.startDate, item.endDate || null)}</span>
                        )}
                      </span>
                    )}
                    {item.location && <span>📍 {item.location}</span>}
                    {item.gpa && <span>⭐ GPA: {item.gpa}</span>}
                  </div>
                  {item.description && (
                    <p className="text-zinc-700 dark:text-zinc-300 mt-2">{item.description}</p>
                  )}
                  {item.skills && item.skills.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {item.skills.split(',').map((skill, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 rounded-full text-xs"
                        >
                          {skill.trim()}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex gap-2 ml-4">
                  <div className="flex items-center gap-2">
                    {index > 0 && (
                      <button
                        type="button"
                        onClick={() => handleMoveUp(index)}
                        disabled={isReordering}
                        className="p-1 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded text-zinc-600 dark:text-zinc-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        title="เลื่อนขึ้น"
                      >
                        ↑
                      </button>
                    )}
                    {index < currentTabItems.length - 1 && (
                      <button
                        type="button"
                        onClick={() => handleMoveDown(index)}
                        disabled={isReordering}
                        className="p-1 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded text-zinc-600 dark:text-zinc-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        title="เลื่อนลง"
                      >
                        ↓
                      </button>
                    )}
                  </div>
                  <button
                    onClick={() => handleEdit(item)}
                    className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded transition-colors"
                  >
                    <Edit className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
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
                {getModalTitle(selectedType, !!editingItem)}
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
                  ประเภท *
                </label>
                <div className="flex gap-4 flex-wrap">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      value="EDUCATION"
                      {...register('type')}
                      className="w-4 h-4 text-blue-600"
                    />
                    <GraduationCap className="w-5 h-5" />
                    <span>การศึกษา</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      value="WORK"
                      {...register('type')}
                      className="w-4 h-4 text-blue-600"
                    />
                    <Briefcase className="w-5 h-5" />
                    <span>การทำงาน</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      value="INTERNSHIP"
                      {...register('type')}
                      className="w-4 h-4 text-blue-600"
                    />
                    <Briefcase className="w-5 h-5" />
                    <span>การฝึกงาน</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      value="CERTIFICATE"
                      {...register('type')}
                      className="w-4 h-4 text-blue-600"
                    />
                    <Award className="w-5 h-5" />
                    <span>ใบรับรอง</span>
                  </label>
                </div>
                {errors.type && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {errors.type.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                  {getInstitutionLabel(selectedType)} *
                </label>
                <input
                  type="text"
                  {...register('institution')}
                  className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 focus:ring-2 focus:ring-blue-500"
                />
                {errors.institution && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {errors.institution.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                  {getDegreeLabel(selectedType)} *
                </label>
                <input
                  type="text"
                  {...register('degree')}
                  className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 focus:ring-2 focus:ring-blue-500"
                />
                {errors.degree && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {errors.degree.message}
                  </p>
                )}
              </div>

              {(selectedType === 'EDUCATION' || selectedType === 'INTERNSHIP') && (
                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                    {selectedType === 'EDUCATION' ? 'สาขาวิชา' : 'แผนก/สาขา'}
                  </label>
                  <input
                    type="text"
                    {...register('field')}
                    className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                  {selectedType === 'CERTIFICATE' ? 'วันที่ออกใบรับรอง' : 'วันที่เริ่มต้น'} {selectedType !== 'CERTIFICATE' && '*'}
                </label>
                <input
                  type="date"
                  {...register('startDate')}
                  className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 focus:ring-2 focus:ring-blue-500"
                />
                {errors.startDate && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {errors.startDate.message}
                  </p>
                )}
              </div>

              {selectedType !== 'CERTIFICATE' && (
                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                    วันที่สิ้นสุด
                  </label>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={isPresent}
                        onChange={(e) => {
                          setIsPresent(e.target.checked);
                          if (e.target.checked) {
                            setValue('endDate', null);
                          }
                        }}
                        className="w-4 h-4 text-blue-600"
                      />
                      <span className="text-sm text-zinc-600 dark:text-zinc-400">ปัจจุบัน</span>
                    </div>
                    {!isPresent && (
                      <input
                        type="date"
                        {...register('endDate')}
                        className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 focus:ring-2 focus:ring-blue-500"
                      />
                    )}
                  </div>
                  {durationText && (
                    <p className="mt-2 text-sm text-blue-600 dark:text-blue-400 font-medium">
                      ระยะเวลา: {durationText}
                    </p>
                  )}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                  สถานที่
                </label>
                <input
                  type="text"
                  {...register('location')}
                  className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {selectedType === 'EDUCATION' && (
                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                    GPA
                  </label>
                  <input
                    type="text"
                    {...register('gpa')}
                    placeholder="เช่น 3.5"
                    className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              )}

              {(selectedType === 'WORK' || selectedType === 'INTERNSHIP') && (
                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                    Skills (คั่นด้วยเครื่องหมายจุลภาค)
                  </label>
                  <input
                    type="text"
                    {...register('skills')}
                    placeholder="เช่น React, TypeScript, Node.js"
                    className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                  รายละเอียด
                </label>
                <textarea
                  {...register('description')}
                  rows={4}
                  className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <FileInput
                  label="Attachment / Certificate / Logo"
                  name="image"
                  accept="image/*"
                  maxSize={5}
                  showPreview={true}
                  onChange={async (file) => {
                    if (file) {
                      try {
                        setIsUploading(true);
                        setError('');
                        const response = await educationAPI.uploadImage(file);
                        setImageUrl(response.data.url);
                      } catch (err: unknown) {
                        const error = err as { response?: { data?: { message?: string } } };
                        setError(error.response?.data?.message || 'ไม่สามารถอัปโหลดไฟล์ได้');
                      } finally {
                        setIsUploading(false);
                      }
                    } else {
                      setImageUrl('');
                    }
                  }}
                  error={isUploading ? 'กำลังอัปโหลด...' : undefined}
                />
                {imageUrl && (
                  <div className="mt-2">
                    <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-2">รูปภาพที่อัปโหลดแล้ว:</p>
                    <img
                      src={getImageUrl(imageUrl)}
                      alt="Preview"
                      className="max-w-xs max-h-48 rounded-lg border border-zinc-300 dark:border-zinc-700"
                    />
                  </div>
                )}
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isLoading ? 'กำลังบันทึก...' : 'บันทึก'}
                </button>
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="flex-1 px-6 py-2 bg-zinc-200 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 rounded-lg hover:bg-zinc-300 dark:hover:bg-zinc-700 transition-colors"
                >
                  ยกเลิก
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
