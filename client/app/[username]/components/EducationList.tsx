'use client';

import { useState } from 'react';
import { GraduationCap, Briefcase, Calendar, MapPin, Award } from 'lucide-react';

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
  type: 'education' | 'internship';
  institution: string;
  degree: string;
  field?: string;
  period?: string;
  location?: string;
  description?: string;
  gpa?: string;
  skills?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface EducationListProps {
  educations: EducationItem[];
  theme?: ThemeColors;
}

export default function EducationList({ educations, theme }: EducationListProps) {
  const [activeTab, setActiveTab] = useState<'education' | 'internship'>('education');
  
  const bgColor = theme?.background || '#ffffff';
  const textColor = theme?.text || '#18181b';
  const cardColor = theme?.card || '#ffffff';
  const borderColor = theme?.border || '#e4e4e7';
  const accentColor = theme?.accent || '#10b981';
  const primaryColor = theme?.primary || '#3b82f6';
  const secondaryColor = theme?.secondary || '#8b5cf6';

  // Filter educations by type
  const educationData = educations?.filter(item => item.type === 'education') || [];
  const internshipData = educations?.filter(item => item.type === 'internship') || [];
  
  // Parse skills string to array for internship
  const internshipDataWithSkills = internshipData.map(item => ({
    ...item,
    skills: item.skills ? item.skills.split(',').map(s => s.trim()).filter(Boolean) : []
  }));

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
            Education & Internship
            </h2>

          {/* Tab Buttons */}
          <div className="flex gap-3 mb-8 md:mb-10">
            <button
              onClick={() => setActiveTab('education')}
              className="flex-1 md:flex-initial px-6 py-4 rounded-xl font-semibold text-base md:text-lg transition-all duration-300 relative overflow-hidden group"
              style={{
                backgroundColor: activeTab === 'education' 
                  ? primaryColor 
                  : (isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)'),
                color: activeTab === 'education' ? '#ffffff' : textColor,
                border: `2px solid ${activeTab === 'education' ? primaryColor : borderColor}`,
                transform: activeTab === 'education' ? 'scale(1.02)' : 'scale(1)',
                boxShadow: activeTab === 'education' 
                  ? `0 4px 12px ${primaryColor}40` 
                  : 'none'
              }}
              onMouseEnter={(e) => {
                if (activeTab !== 'education') {
                  e.currentTarget.style.backgroundColor = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)';
                  e.currentTarget.style.transform = 'scale(1.05)';
                }
              }}
              onMouseLeave={(e) => {
                if (activeTab !== 'education') {
                  e.currentTarget.style.backgroundColor = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)';
                  e.currentTarget.style.transform = 'scale(1)';
                }
              }}
            >
              <div className="flex items-center justify-center gap-3 relative z-10">
                <GraduationCap className="w-5 h-5 md:w-6 md:h-6" />
                <span>ประวัติการศึกษา</span>
              </div>
              {activeTab === 'education' && (
                <div 
                  className="absolute inset-0 opacity-20"
                  style={{
                    background: `linear-gradient(135deg, ${primaryColor} 0%, ${secondaryColor} 100%)`
                  }}
                />
              )}
            </button>

            <button
              onClick={() => setActiveTab('internship')}
              className="flex-1 md:flex-initial px-6 py-4 rounded-xl font-semibold text-base md:text-lg transition-all duration-300 relative overflow-hidden group"
              style={{
                backgroundColor: activeTab === 'internship' 
                  ? secondaryColor 
                  : (isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)'),
                color: activeTab === 'internship' ? '#ffffff' : textColor,
                border: `2px solid ${activeTab === 'internship' ? secondaryColor : borderColor}`,
                transform: activeTab === 'internship' ? 'scale(1.02)' : 'scale(1)',
                boxShadow: activeTab === 'internship' 
                  ? `0 4px 12px ${secondaryColor}40` 
                  : 'none'
              }}
              onMouseEnter={(e) => {
                if (activeTab !== 'internship') {
                  e.currentTarget.style.backgroundColor = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)';
                  e.currentTarget.style.transform = 'scale(1.05)';
                }
              }}
              onMouseLeave={(e) => {
                if (activeTab !== 'internship') {
                  e.currentTarget.style.backgroundColor = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)';
                  e.currentTarget.style.transform = 'scale(1)';
                }
              }}
            >
              <div className="flex items-center justify-center gap-3 relative z-10">
                <Briefcase className="w-5 h-5 md:w-6 md:h-6" />
                <span>ประวัติการฝึกงาน</span>
              </div>
              {activeTab === 'internship' && (
                <div 
                  className="absolute inset-0 opacity-20"
                  style={{
                    background: `linear-gradient(135deg, ${secondaryColor} 0%, ${primaryColor} 100%)`
                  }}
                />
              )}
            </button>
          </div>

          {/* Content Area */}
          <div className="min-h-[300px]">
            {activeTab === 'education' ? (
              educationData.length === 0 ? (
                <div className="text-center py-12">
                  <GraduationCap 
                    className="w-16 h-16 mx-auto mb-4 opacity-30"
                    style={{ color: textColor }}
                  />
                  <p style={{ color: textColor, opacity: 0.7, fontSize: '1.1rem' }}>
                    ยังไม่มีข้อมูลประวัติการศึกษา
                  </p>
        </div>
              ) : (
                <div className="space-y-6 md:space-y-8">
                  {educationData.map((item) => (
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
                        e.currentTarget.style.borderColor = primaryColor;
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
                            backgroundColor: `${primaryColor}15`,
                            color: primaryColor
            }}
          >
                          <GraduationCap className="w-6 h-6 md:w-7 md:h-7" />
                        </div>
                        <div className="flex-1">
                          <h3 
                            className="text-xl md:text-2xl font-bold mb-2"
                            style={{ color: textColor }}
                          >
                            {item.institution}
                          </h3>
                          <div className="flex flex-wrap items-center gap-4 text-sm md:text-base mb-3">
                            <div className="flex items-center gap-2" style={{ color: textColor, opacity: 0.8 }}>
                              <Award className="w-4 h-4" />
                              <span className="font-semibold">{item.degree}</span>
                              {item.field && <span className="opacity-70">- {item.field}</span>}
                            </div>
                            {item.gpa && (
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
                          <div className="flex flex-wrap gap-4 text-sm" style={{ color: textColor, opacity: 0.6 }}>
                            {item.period && (
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
                  ))}
                </div>
              )
            ) : (
              internshipData.length === 0 ? (
                <div className="text-center py-12">
                  <Briefcase 
                    className="w-16 h-16 mx-auto mb-4 opacity-30"
                      style={{ color: textColor }}
                  />
                  <p style={{ color: textColor, opacity: 0.7, fontSize: '1.1rem' }}>
                    ยังไม่มีข้อมูลประวัติการฝึกงาน
                  </p>
                </div>
              ) : (
                <div className="space-y-6 md:space-y-8">
                  {internshipDataWithSkills.map((item) => (
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
                        e.currentTarget.style.borderColor = secondaryColor;
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
                            backgroundColor: `${secondaryColor}15`,
                            color: secondaryColor
                          }}
                        >
                          <Briefcase className="w-6 h-6 md:w-7 md:h-7" />
                        </div>
                        <div className="flex-1">
                          <h3 
                            className="text-xl md:text-2xl font-bold mb-2"
                            style={{ color: textColor }}
                          >
                            {item.institution}
                          </h3>
                          <div className="flex flex-wrap items-center gap-4 text-sm md:text-base mb-3">
                            <div className="flex items-center gap-2" style={{ color: textColor, opacity: 0.8 }}>
                              <Award className="w-4 h-4" />
                              <span className="font-semibold">{item.degree}</span>
                    </div>
                  </div>
                          <div className="flex flex-wrap gap-4 text-sm mb-3" style={{ color: textColor, opacity: 0.6 }}>
                            {item.period && (
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
                          {item.skills && item.skills.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-3">
                              {item.skills.map((skill, skillIndex) => (
                  <span 
                                  key={skillIndex}
                                  className="px-3 py-1 rounded-full text-xs font-medium"
                                  style={{
                                    backgroundColor: `${secondaryColor}20`,
                                    color: secondaryColor
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
                  ))}
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

