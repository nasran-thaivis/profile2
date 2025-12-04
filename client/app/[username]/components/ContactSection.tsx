'use client';

import { useState } from 'react';
import { Mail, Phone, MapPin, Globe, Send } from 'lucide-react';
import { contactAPI } from '@/lib/api';

interface ThemeColors {
  primary?: string;
  secondary?: string;
  accent?: string;
  background?: string;
  text?: string;
  card?: string;
  border?: string;
}

interface ContactSectionProps {
  contactInfo?: {
    email?: string;
    phone?: string;
    location?: string;
    website?: string;
    [key: string]: any;
  };
  userId?: number;
  theme?: ThemeColors;
}

export default function ContactSection({ contactInfo, userId, theme }: ContactSectionProps) {
  const [formData, setFormData] = useState({
    senderName: '',
    senderEmail: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'success' | 'error' | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;

    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      await contactAPI.sendMessage({
        userId,
        ...formData,
      });
      setSubmitStatus('success');
      setFormData({ senderName: '', senderEmail: '', message: '' });
    } catch (error) {
      setSubmitStatus('error');
      console.error('Error sending message:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!contactInfo) {
    return null;
  }

  const hasContactInfo =
    contactInfo.email || contactInfo.phone || contactInfo.location || contactInfo.website;

  const bgColor = theme?.background || '#ffffff';
  const textColor = theme?.text || '#18181b';
  const cardColor = theme?.card || '#ffffff';
  const borderColor = theme?.border || '#e4e4e7';
  const primaryColor = theme?.primary || '#3b82f6';

  return (
    <section 
      id="contact" 
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
            className="text-3xl md:text-4xl lg:text-5xl font-bold mb-8 md:mb-10 pb-4 border-b"
            style={{ 
              color: textColor,
              borderColor: borderColor
            }}
          >
            Contact
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
            {/* Contact Info */}
            {hasContactInfo && (
              <div>
                <h3 
                  className="text-xl md:text-2xl font-semibold mb-4 md:mb-6"
                  style={{ color: textColor }}
                >
                  Get in Touch
                </h3>
                <div className="grid grid-cols-1 gap-3 md:gap-4">
                  {contactInfo.email && (
                    <div 
                      className="flex items-center gap-3 md:gap-4 p-4 md:p-5 rounded-xl border hover:shadow-md transition-all"
                      style={{ 
                        backgroundColor: bgColor,
                        borderColor: borderColor
                      }}
                    >
                      <div 
                        className="p-2 md:p-3 rounded-lg flex-shrink-0"
                        style={{ backgroundColor: `${primaryColor}15` }}
                      >
                        <Mail className="w-5 h-5 md:w-6 md:h-6" style={{ color: primaryColor }} />
                      </div>
                      <a
                        href={`mailto:${contactInfo.email}`}
                        className="font-medium hover:underline text-sm md:text-base break-all"
                        style={{ color: textColor }}
                        onMouseEnter={(e) => e.currentTarget.style.color = primaryColor}
                        onMouseLeave={(e) => e.currentTarget.style.color = textColor}
                      >
                        {contactInfo.email}
                      </a>
                    </div>
                  )}
                  {contactInfo.phone && (
                    <div 
                      className="flex items-center gap-3 md:gap-4 p-4 md:p-5 rounded-xl border hover:shadow-md transition-all"
                      style={{ 
                        backgroundColor: bgColor,
                        borderColor: borderColor
                      }}
                    >
                      <div 
                        className="p-2 md:p-3 rounded-lg flex-shrink-0"
                        style={{ backgroundColor: `${primaryColor}15` }}
                      >
                        <Phone className="w-5 h-5 md:w-6 md:h-6" style={{ color: primaryColor }} />
                      </div>
                      <a
                        href={`tel:${contactInfo.phone}`}
                        className="font-medium hover:underline text-sm md:text-base"
                        style={{ color: textColor }}
                        onMouseEnter={(e) => e.currentTarget.style.color = primaryColor}
                        onMouseLeave={(e) => e.currentTarget.style.color = textColor}
                      >
                        {contactInfo.phone}
                      </a>
                    </div>
                  )}
                  {contactInfo.location && (
                    <div 
                      className="flex items-center gap-3 md:gap-4 p-4 md:p-5 rounded-xl border hover:shadow-md transition-all"
                      style={{ 
                        backgroundColor: bgColor,
                        borderColor: borderColor
                      }}
                    >
                      <div 
                        className="p-2 md:p-3 rounded-lg flex-shrink-0"
                        style={{ backgroundColor: `${primaryColor}15` }}
                      >
                        <MapPin className="w-5 h-5 md:w-6 md:h-6" style={{ color: primaryColor }} />
                      </div>
                      <span className="font-medium text-sm md:text-base" style={{ color: textColor }}>{contactInfo.location}</span>
                    </div>
                  )}
                  {contactInfo.website && (
                    <div 
                      className="flex items-center gap-3 md:gap-4 p-4 md:p-5 rounded-xl border hover:shadow-md transition-all"
                      style={{ 
                        backgroundColor: bgColor,
                        borderColor: borderColor
                      }}
                    >
                      <div 
                        className="p-2 md:p-3 rounded-lg flex-shrink-0"
                        style={{ backgroundColor: `${primaryColor}15` }}
                      >
                        <Globe className="w-5 h-5 md:w-6 md:h-6" style={{ color: primaryColor }} />
                      </div>
                      <a
                        href={contactInfo.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium hover:underline text-sm md:text-base break-all"
                        style={{ color: textColor }}
                        onMouseEnter={(e) => e.currentTarget.style.color = primaryColor}
                        onMouseLeave={(e) => e.currentTarget.style.color = textColor}
                      >
                        {contactInfo.website}
                      </a>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Contact Form */}
            {userId && (
              <div 
                className="rounded-xl p-5 md:p-6 border"
                style={{ 
                  backgroundColor: bgColor,
                  borderColor: borderColor
                }}
              >
                <h3 
                  className="text-xl md:text-2xl font-semibold mb-4 md:mb-6"
                  style={{ color: textColor }}
                >
                  Send a Message
                </h3>
                <form onSubmit={handleSubmit} className="space-y-4 md:space-y-5">
                  <div>
                    <label
                      htmlFor="senderName"
                      className="block text-sm font-medium mb-2"
                      style={{ color: textColor }}
                    >
                      Your Name
                    </label>
                    <input
                      type="text"
                      id="senderName"
                      required
                      value={formData.senderName}
                      onChange={(e) => setFormData({ ...formData, senderName: e.target.value })}
                      className="w-full px-4 py-2 md:py-3 border rounded-xl focus:outline-none transition-all text-sm md:text-base"
                      style={{ 
                        borderColor: borderColor,
                        backgroundColor: cardColor,
                        color: textColor,
                        boxShadow: `inset 0 2px 4px rgba(0, 0, 0, 0.06), 0 1px 2px rgba(0, 0, 0, 0.1), 0 4px 8px rgba(0, 0, 0, 0.08)`
                      }}
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor = primaryColor;
                        e.currentTarget.style.boxShadow = `inset 0 2px 4px rgba(0, 0, 0, 0.06), 0 0 0 3px ${primaryColor}20, 0 4px 12px rgba(0, 0, 0, 0.15), 0 2px 4px rgba(0, 0, 0, 0.1)`;
                        e.currentTarget.style.transform = 'translateY(-1px)';
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderColor = borderColor;
                        e.currentTarget.style.boxShadow = `inset 0 2px 4px rgba(0, 0, 0, 0.06), 0 1px 2px rgba(0, 0, 0, 0.1), 0 4px 8px rgba(0, 0, 0, 0.08)`;
                        e.currentTarget.style.transform = 'translateY(0)';
                      }}
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="senderEmail"
                      className="block text-sm font-medium mb-2"
                      style={{ color: textColor }}
                    >
                      Your Email
                    </label>
                    <input
                      type="email"
                      id="senderEmail"
                      required
                      value={formData.senderEmail}
                      onChange={(e) => setFormData({ ...formData, senderEmail: e.target.value })}
                      className="w-full px-4 py-2 md:py-3 border rounded-xl focus:outline-none transition-all text-sm md:text-base"
                      style={{ 
                        borderColor: borderColor,
                        backgroundColor: cardColor,
                        color: textColor,
                        boxShadow: `inset 0 2px 4px rgba(0, 0, 0, 0.06), 0 1px 2px rgba(0, 0, 0, 0.1), 0 4px 8px rgba(0, 0, 0, 0.08)`
                      }}
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor = primaryColor;
                        e.currentTarget.style.boxShadow = `inset 0 2px 4px rgba(0, 0, 0, 0.06), 0 0 0 3px ${primaryColor}20, 0 4px 12px rgba(0, 0, 0, 0.15), 0 2px 4px rgba(0, 0, 0, 0.1)`;
                        e.currentTarget.style.transform = 'translateY(-1px)';
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderColor = borderColor;
                        e.currentTarget.style.boxShadow = `inset 0 2px 4px rgba(0, 0, 0, 0.06), 0 1px 2px rgba(0, 0, 0, 0.1), 0 4px 8px rgba(0, 0, 0, 0.08)`;
                        e.currentTarget.style.transform = 'translateY(0)';
                      }}
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="message"
                      className="block text-sm font-medium mb-2"
                      style={{ color: textColor }}
                    >
                      Message
                    </label>
                    <textarea
                      id="message"
                      required
                      rows={5}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-4 py-2 md:py-3 border rounded-xl focus:outline-none transition-all resize-none text-sm md:text-base"
                      style={{ 
                        borderColor: borderColor,
                        backgroundColor: cardColor,
                        color: textColor,
                        boxShadow: `inset 0 2px 4px rgba(0, 0, 0, 0.06), 0 1px 2px rgba(0, 0, 0, 0.1), 0 4px 8px rgba(0, 0, 0, 0.08)`
                      }}
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor = primaryColor;
                        e.currentTarget.style.boxShadow = `inset 0 2px 4px rgba(0, 0, 0, 0.06), 0 0 0 3px ${primaryColor}20, 0 4px 12px rgba(0, 0, 0, 0.15), 0 2px 4px rgba(0, 0, 0, 0.1)`;
                        e.currentTarget.style.transform = 'translateY(-1px)';
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderColor = borderColor;
                        e.currentTarget.style.boxShadow = `inset 0 2px 4px rgba(0, 0, 0, 0.06), 0 1px 2px rgba(0, 0, 0, 0.1), 0 4px 8px rgba(0, 0, 0, 0.08)`;
                        e.currentTarget.style.transform = 'translateY(0)';
                      }}
                    />
                  </div>
                  {submitStatus === 'success' && (
                    <div 
                      className="p-3 md:p-4 rounded-xl text-sm font-medium"
                      style={{ 
                        backgroundColor: `${theme?.accent || '#10b981'}20`,
                        color: theme?.accent || '#10b981',
                        border: `1px solid ${theme?.accent || '#10b981'}40`
                      }}
                    >
                      Message sent successfully!
                    </div>
                  )}
                  {submitStatus === 'error' && (
                    <div 
                      className="p-3 md:p-4 rounded-xl text-sm font-medium"
                      style={{ 
                        backgroundColor: '#ef444420',
                        color: '#ef4444',
                        border: '1px solid #ef444440'
                      }}
                    >
                      Failed to send message. Please try again.
                    </div>
                  )}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full flex items-center justify-center gap-2 px-4 md:px-6 py-2 md:py-3 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium shadow-md hover:shadow-lg text-sm md:text-base"
                    style={{ 
                      backgroundColor: primaryColor,
                      color: '#ffffff'
                    }}
                    onMouseEnter={(e) => {
                      if (!isSubmitting) {
                        e.currentTarget.style.opacity = '0.9';
                        e.currentTarget.style.transform = 'translateY(-2px)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isSubmitting) {
                        e.currentTarget.style.opacity = '1';
                        e.currentTarget.style.transform = 'translateY(0)';
                      }
                    }}
                  >
                    <Send className="w-4 h-4" />
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

