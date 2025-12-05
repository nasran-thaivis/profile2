'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { educationAPI } from '@/lib/api';
import { Plus, Edit, Trash2, X, GraduationCap, Briefcase } from 'lucide-react';

const educationSchema = z.object({
  type: z.enum(['education', 'internship']),
  institution: z.string().min(1, 'สถาบัน/บริษัท จำเป็นต้องกรอก'),
  degree: z.string().min(1, 'วุฒิ/ตำแหน่ง จำเป็นต้องกรอก'),
  field: z.string().optional(),
  period: z.string().optional(),
  location: z.string().optional(),
  description: z.string().optional(),
  gpa: z.string().optional(),
  skills: z.string().optional(),
});

type EducationFormData = z.infer<typeof educationSchema>;

interface EducationItem {
  id: number;
  type: 'education' | 'internship';
  institution: string;
  degree: string;
  field?: string;
  period?: string;
  location?: string;
  description?: string;
  gpa?: string;
  skills?: string;
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
  const [activeTab, setActiveTab] = useState<'education' | 'internship'>('education');

  const [username, setUsername] = useState<string>('');

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
      type: 'education',
    },
  });

  const selectedType = watch('type');

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

  const fetchItems = async () => {
    if (!username) return;
    try {
      setIsFetching(true);
      const response = await educationAPI.getByUsername(username);
      setItems(response.data || []);
    } catch (err: any) {
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

      if (editingItem) {
        await educationAPI.update(editingItem.id, data);
      } else {
        await educationAPI.create(data);
      }

      setShowModal(false);
      reset();
      setEditingItem(null);
      fetchItems();
    } catch (err: any) {
      setError(err.response?.data?.message || 'ไม่สามารถบันทึกข้อมูลได้');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (item: EducationItem) => {
    setEditingItem(item);
    setActiveTab(item.type);
    setValue('type', item.type);
    setValue('institution', item.institution);
    setValue('degree', item.degree);
    setValue('field', item.field || '');
    setValue('period', item.period || '');
    setValue('location', item.location || '');
    setValue('description', item.description || '');
    setValue('gpa', item.gpa || '');
    setValue('skills', item.skills || '');
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('คุณแน่ใจหรือไม่ว่าต้องการลบรายการนี้?')) return;

    try {
      await educationAPI.delete(id);
      fetchItems();
    } catch (err: any) {
      setError('ไม่สามารถลบข้อมูลได้');
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingItem(null);
    reset();
  };

  const handleAddNew = (type: 'education' | 'internship') => {
    setActiveTab(type);
    setValue('type', type);
    setEditingItem(null);
    reset({
      type,
      institution: '',
      degree: '',
      field: '',
      period: '',
      location: '',
      description: '',
      gpa: '',
      skills: '',
    });
    setShowModal(true);
  };

  const filteredItems = items.filter(item => item.type === activeTab);

  if (isFetching) {
    return <div className="text-center py-12">กำลังโหลด...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">จัดการการศึกษา</h1>
      </div>

      {/* Tabs */}
      <div className="flex gap-3 mb-6">
        <button
          onClick={() => setActiveTab('education')}
          className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
            activeTab === 'education'
              ? 'bg-blue-600 text-white'
              : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300'
          }`}
        >
          <GraduationCap className="w-5 h-5" />
          ประวัติการศึกษา
        </button>
        <button
          onClick={() => setActiveTab('internship')}
          className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
            activeTab === 'internship'
              ? 'bg-purple-600 text-white'
              : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300'
          }`}
        >
          <Briefcase className="w-5 h-5" />
          ประวัติการฝึกงาน
        </button>
      </div>

      <div className="flex justify-end mb-6">
        <button
          onClick={() => handleAddNew(activeTab)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          เพิ่ม{activeTab === 'education' ? 'ประวัติการศึกษา' : 'ประวัติการฝึกงาน'}
        </button>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-800 text-red-700 dark:text-red-400 rounded-lg">
          {error}
        </div>
      )}

      {filteredItems.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-zinc-900 rounded-lg shadow">
          <p className="text-zinc-600 dark:text-zinc-400">
            ยังไม่มีข้อมูล{activeTab === 'education' ? 'ประวัติการศึกษา' : 'ประวัติการฝึกงาน'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="bg-white dark:bg-zinc-900 rounded-lg shadow p-6 border border-zinc-200 dark:border-zinc-800"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    {item.type === 'education' ? (
                      <GraduationCap className="w-6 h-6 text-blue-600" />
                    ) : (
                      <Briefcase className="w-6 h-6 text-purple-600" />
                    )}
                    <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
                      {item.institution}
                    </h3>
                  </div>
                  <p className="text-lg font-semibold text-zinc-700 dark:text-zinc-300 mb-2">
                    {item.degree}
                    {item.field && <span className="text-zinc-500"> - {item.field}</span>}
                  </p>
                  <div className="flex flex-wrap gap-4 text-sm text-zinc-600 dark:text-zinc-400 mb-2">
                    {item.period && <span>📅 {item.period}</span>}
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
                {editingItem ? 'แก้ไขข้อมูล' : `เพิ่ม${selectedType === 'education' ? 'ประวัติการศึกษา' : 'ประวัติการฝึกงาน'}`}
              </h2>
              <button
                onClick={handleCloseModal}
                className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-50"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
              <input type="hidden" {...register('type')} />

              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                  {selectedType === 'education' ? 'สถาบันการศึกษา' : 'ชื่อบริษัท'} *
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
                  {selectedType === 'education' ? 'วุฒิการศึกษา' : 'ตำแหน่ง'} *
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

              {selectedType === 'education' && (
                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                    สาขาวิชา
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
                  ระยะเวลา
                </label>
                <input
                  type="text"
                  {...register('period')}
                  placeholder="เช่น 2020-2024 หรือ 2023"
                  className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 focus:ring-2 focus:ring-blue-500"
                />
              </div>

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

              {selectedType === 'education' && (
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

              {selectedType === 'internship' && (
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
