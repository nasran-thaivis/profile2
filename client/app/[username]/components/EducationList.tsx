'use client';

import { useState } from 'react';
import { GraduationCap, Briefcase, Calendar, MapPin, Award, Eye } from 'lucide-react';
import { formatDateRange, formatDurationShort } from '@/lib/utils/dateHelpers';
import { getImageUrl } from '@/lib/api';

interface ThemeColors {
  primary?: string;
  secondary?: string;
  accent?: string;
  background?: string;
  text?: string;
  card?: string;
  border?: string;
}

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
  createdAt?: string;
  updatedAt?: string;
}

interface EducationListProps {
  educations: EducationItem[];
  theme?: ThemeColors;
}

export default function EducationList({ educations, theme }: EducationListProps) {
  const TABS = [
    { id: 'WORK', label: 'Experience' },
    { id: 'INTERNSHIP', label: 'Internships' },
    { id: 'EDUCATION', label: 'Education' },
    { id: 'CERTIFICATE', label: 'Certificates' },
  ];

  const [activeTab, setActiveTab] = useState('WORK');

  const bgColor = theme?.background || '#ffffff';
  const textColor = theme?.text || '#18181b';
  const cardColor = theme?.card || '#ffffff';
  const borderColor = theme?.border || '#e4e4e7';
  const accentColor = theme?.accent || '#10b981';
  const primaryColor = theme?.primary || '#3b82f6';
  const secondaryColor = theme?.secondary || '#8b5cf6';

  // Helper function to sort by order then startDate
  const sortByOrderAndDate = (a: EducationItem, b: EducationItem) => {
    if (a.order !== b.order) {
      return a.order - b.order;
    }
    // จัดการกรณีที่ไม่มี startDate
    if (!a.startDate && !b.startDate) return 0;
    if (!a.startDate) return 1;
    if (!b.startDate) return -1;
    return new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
  };

  // Filter educations based on activeTab (รองรับข้อมูลเก่า)
  const filteredItems = (educations?.filter(item => {
    const itemType = item.type as string;
    if (activeTab === 'WORK') {
      return itemType === 'WORK';
    } else if (activeTab === 'INTERNSHIP') {
      return itemType === 'INTERNSHIP' || itemType === 'internship';
    } else if (activeTab === 'EDUCATION') {
      return itemType === 'EDUCATION' || itemType === 'education';
    } else if (activeTab === 'CERTIFICATE') {
      return itemType === 'CERTIFICATE';
    }
    return false;
  }) || []).sort(sortByOrderAndDate);

  // Parse skills string to array for work and internships
  const filteredItemsWithSkills = filteredItems.map(item => ({
    ...item,
    skills: (item.type === 'WORK' || item.type === 'INTERNSHIP' || item.type === 'internship') && item.skills
      ? item.skills.split(',').map(s => s.trim()).filter(Boolean)
      : []
  }));

  // Helper function to format certificate issued date
  const formatCertificateDate = (startDate: string | undefined) => {
    if (!startDate) return '';
    const date = new Date(startDate);
    if (isNaN(date.getTime())) return '';
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `Issued: ${monthNames[date.getMonth()]} ${date.getFullYear()}`; //Dec 2025
  };

  // Helper function to get attachment label based on type
  const getAttachmentLabel = (type: string) => {
    const normalizedType = type.toUpperCase();
    switch (normalizedType) {
      case 'CERTIFICATE':
        return 'View Certificate';
      case 'WORK':
        return 'View Experience';
      case 'INTERNSHIP':
        return 'View Internship';
      case 'EDUCATION':
        return 'View Education';
      default:
        return 'View Attachment';
    }
  };

  const isDark = theme?.background === '#000000' || 
                 theme?.background === '#18181b' || 
                 (typeof theme?.background === 'string' && theme.background.startsWith('rgb(0,')) || 
                 (typeof theme?.background === 'string' && theme.background.startsWith('#000'));

    return (
      <section 
        id="education" 
        className="py-12 px-4"
        style={{ backgroundColor: bgColor }}
      >
        <div className="max-w-6xl mx-auto">
          <div 
            className="rounded-2xl p-6 md:p-8 lg:p-12 shadow-lg border"
            style={{ 
              backgroundColor: cardColor,
              borderColor: borderColor,
              boxShadow: `0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)`
            }}
          >
            <h2 
              className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 md:mb-8 pb-4 border-b"
              style={{ 
                color: textColor,
                borderColor: borderColor
              }}
            >
            Experience & Education
            </h2>

            {/* Tab Navigation */}
            <div className="flex flex-wrap gap-2 md:gap-4 mb-6 md:mb-8 border-b" style={{ borderColor: borderColor }}>
              {TABS.map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-4 py-2 md:px-6 md:py-3 text-sm md:text-base font-semibold transition-colors duration-200 cursor-pointer ${
                      isActive
                        ? 'border-b-2'
                        : 'opacity-70 hover:opacity-100'
                    }`}
                    style={{
                      color: isActive ? primaryColor : textColor,
                      borderBottomColor: isActive ? primaryColor : 'transparent',
                      borderBottomWidth: isActive ? '2px' : '0px',
                    }}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>

          {/* Content Section */}
          {filteredItemsWithSkills.length > 0 ? (
            <div className="space-y-6 md:space-y-8">
              {filteredItemsWithSkills.map((item) => {
                // Determine icon, color, and special properties based on item type
                const itemType = item.type as string;
                let Icon: typeof Briefcase | typeof GraduationCap | typeof Award;
                let itemColor: string;
                let hoverColor: string;
                
                if (itemType === 'WORK') {
                  Icon = Briefcase;
                  itemColor = secondaryColor;
                  hoverColor = secondaryColor;
                } else if (itemType === 'INTERNSHIP' || itemType === 'internship') {
                  Icon = Briefcase;
                  itemColor = '#10b981';
                  hoverColor = '#10b981';
                } else if (itemType === 'EDUCATION' || itemType === 'education') {
                  Icon = GraduationCap;
                  itemColor = primaryColor;
                  hoverColor = primaryColor;
                } else {
                  Icon = Award;
                  itemColor = '#f59e0b';
                  hoverColor = '#f59e0b';
                }

                return (
                  <div
                    key={item.id}
                    className="rounded-xl p-6 md:p-8 border shadow-sm hover:shadow-lg transition-all duration-300 relative overflow-hidden group"
                    style={{ 
                      backgroundColor: isDark ? 'rgba(255,255,255,0.02)' : bgColor,
                      borderColor: borderColor,
                      transform: 'translateY(0)'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-4px)';
                      e.currentTarget.style.borderColor = hoverColor;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.borderColor = borderColor;
                    }}
                  >
                    <div className="flex items-start gap-4 mb-4">
                      <div 
                        className="w-12 h-12 md:w-14 md:h-14 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110"
                        style={{
                          backgroundColor: `${itemColor}15`,
                          color: itemColor
                        }}
                      >
                        <Icon className="w-6 h-6 md:w-7 md:h-7" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 
                            className="text-xl md:text-2xl font-bold"
                            style={{ color: textColor }}
                          >
                            {item.institution}
                          </h3>
                        </div>
                        <div className="flex flex-wrap items-center gap-4 text-sm md:text-base mb-3">
                          <div className="flex items-center gap-2" style={{ color: textColor, opacity: 0.8 }}>
                            <Award className="w-4 h-4" />
                            <span className="font-semibold">{item.degree}</span>
                            {(itemType === 'EDUCATION' || itemType === 'education' || itemType === 'INTERNSHIP' || itemType === 'internship') && item.field && (
                              <span className="opacity-70">- {item.field}</span>
                            )}
                          </div>
                          {(itemType === 'EDUCATION' || itemType === 'education') && item.gpa && (
                            <div 
                              className="px-3 py-1 rounded-full text-xs font-semibold"
                              style={{ 
                                backgroundColor: `${accentColor}20`,
                                color: accentColor
                              }}
                            >
                              GPA: {item.gpa}
                            </div>
                          )}
                        </div>
                        <div className="flex flex-wrap gap-4 text-sm mb-3" style={{ color: textColor, opacity: 0.6 }}>
                          {item.startDate && (
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              <span>
                                {itemType === 'CERTIFICATE' ? (
                                  formatCertificateDate(item.startDate)
                                ) : (
                                  <>
                                    {formatDateRange(item.startDate, item.endDate || null)}
                                    {formatDurationShort(item.startDate, item.endDate || null) && (
                                      <span className="ml-2">· {formatDurationShort(item.startDate, item.endDate || null)}</span>
                                    )}
                                  </>
                                )}
                              </span>
                            </div>
                          )}
                          {!item.startDate && (itemType === 'EDUCATION' || itemType === 'education') && item.period && (
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              <span>{item.period}</span>
                            </div>
                          )}
                          {item.location && (
                            <div className="flex items-center gap-1">
                              <MapPin className="w-4 h-4" />
                              <span>{item.location}</span>
                            </div>
                          )}
                        </div>
                        {/* View Attachment button for all types */}
                        {item.imageUrl && (
                          <div className="mt-3">
                            <a
                              href={getImageUrl(item.imageUrl)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg transition-colors"
                              style={{
                                backgroundColor: `${itemColor}20`,
                                color: itemColor
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = `${itemColor}30`;
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = `${itemColor}20`;
                              }}
                            >
                              <Eye className="w-4 h-4" />
                              <span className="text-sm font-medium">{getAttachmentLabel(item.type)}</span>
                            </a>
                          </div>
                        )}
                        {(itemType === 'WORK' || itemType === 'INTERNSHIP' || itemType === 'internship') && item.skills && item.skills.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-3">
                            {item.skills.map((skill, skillIndex) => (
                              <span 
                                key={skillIndex}
                                className="px-3 py-1 rounded-full text-xs font-medium"
                                style={{
                                  backgroundColor: `${itemColor}20`,
                                  color: itemColor
                                }}
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    {item.description && (
                      <p 
                        className="text-sm md:text-base leading-relaxed pl-0 md:pl-16"
                        style={{ color: textColor, opacity: 0.85 }}
                      >
                        {item.description}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <GraduationCap 
                className="w-16 h-16 mx-auto mb-4 opacity-30"
                style={{ color: textColor }}
              />
              <p style={{ color: textColor, opacity: 0.7, fontSize: '1.1rem' }}>
                No information added yet.
              </p>
            </div>
          )}

        </div>
      </div>
    </section>
  );
}

