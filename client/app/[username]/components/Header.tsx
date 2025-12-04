'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Home, User, Briefcase, Star, Mail, Menu, X, Github, Linkedin, Twitter, Instagram, Facebook } from 'lucide-react';

interface ThemeColors {
  primary?: string;
  secondary?: string;
  accent?: string;
  background?: string;
  text?: string;
  card?: string;
  border?: string;
}

interface HeaderProps {
  theme?: ThemeColors;
  displayName?: string;
  avatarUrl?: string;
  contactInfo?: {
    email?: string;
    phone?: string;
    website?: string;
    socialMedia?: {
      github?: string;
      linkedin?: string;
      twitter?: string;
      instagram?: string;
      facebook?: string;
    };
  };
}

export default function Header({ theme, displayName, avatarUrl, contactInfo }: HeaderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { id: 'hero', label: 'Home', icon: Home },
    { id: 'about', label: 'About', icon: User },
    { id: 'portfolio', label: 'Portfolio', icon: Briefcase },
    { id: 'education', label: 'Education', icon: Star },
    { id: 'contact', label: 'Contact', icon: Mail },
  ];

  const socialLinks = [
    { name: 'Github', icon: Github, url: contactInfo?.socialMedia?.github },
    { name: 'LinkedIn', icon: Linkedin, url: contactInfo?.socialMedia?.linkedin },
    { name: 'Twitter', icon: Twitter, url: contactInfo?.socialMedia?.twitter },
    { name: 'Instagram', icon: Instagram, url: contactInfo?.socialMedia?.instagram },
    { name: 'Facebook', icon: Facebook, url: contactInfo?.socialMedia?.facebook },
  ].filter(link => link.url);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsOpen(false);
    }
  };

  const bgColor = theme?.card || '#ffffff';
  const textColor = theme?.text || '#18181b';
  const borderColor = theme?.border || '#e4e4e7';
  const primaryColor = theme?.primary || '#3b82f6';
  const isDark = theme?.background === '#000000' || 
                 theme?.background === '#18181b' || 
                 (typeof theme?.background === 'string' && theme.background.startsWith('rgb(0,')) || 
                 (typeof theme?.background === 'string' && theme.background.startsWith('#000'));

  return (
    <header 
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled ? 'shadow-lg' : 'shadow-sm'
      }`}
      style={{ 
        backgroundColor: scrolled 
          ? (isDark ? 'rgba(0, 0, 0, 0.9)' : 'rgba(255, 255, 255, 0.95)')
          : bgColor,
        borderBottom: `1px solid ${borderColor}`,
        backdropFilter: scrolled ? 'blur(10px)' : 'none',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 md:h-20">
          {/* Logo/Brand Section */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => scrollToSection('hero')}
              className="flex items-center gap-3 group"
            >
              {avatarUrl ? (
                <div 
                  className="w-10 h-10 md:w-12 md:h-12 rounded-full overflow-hidden border-2 transition-transform group-hover:scale-110"
                  style={{ 
                    borderColor: primaryColor,
                  }}
                >
                  <Image
                    src={avatarUrl}
                    alt={displayName || 'Avatar'}
                    width={48}
                    height={48}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div 
                  className="w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center border-2 font-bold text-lg transition-transform group-hover:scale-110"
                  style={{ 
                    borderColor: primaryColor,
                    backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
                    color: primaryColor
                  }}
                >
                  {displayName?.charAt(0).toUpperCase() || 'P'}
                </div>
              )}
              <div className="hidden sm:block">
                <div 
                  className="text-lg md:text-xl font-bold transition-colors"
                  style={{ color: textColor }}
                >
                  {displayName || 'Profile'}
                </div>
                <div 
                  className="text-xs opacity-60"
                  style={{ color: textColor }}
                >
                  Portfolio
                </div>
              </div>
            </button>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all relative group"
                  style={{ 
                    color: textColor,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = primaryColor;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = textColor;
                  }}
                >
                  <Icon className="w-4 h-4 transition-transform group-hover:scale-110" />
                  <span>{item.label}</span>
                  <span 
                    className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full transition-all scale-x-0 group-hover:scale-x-100"
                    style={{ backgroundColor: primaryColor }}
                  />
                </button>
              );
            })}
          </div>

          {/* Social Links & CTA */}
          <div className="hidden md:flex items-center gap-3">
            {socialLinks.slice(0, 3).map((social) => {
              const Icon = social.icon;
              return (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full flex items-center justify-center transition-all hover:scale-110"
                  style={{ 
                    backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
                    color: textColor
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = primaryColor;
                    e.currentTarget.style.color = '#ffffff';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)';
                    e.currentTarget.style.color = textColor;
                  }}
                  aria-label={social.name}
                >
                  <Icon className="w-4 h-4" />
                </a>
              );
            })}
            {contactInfo?.email && (
              <a
                href={`mailto:${contactInfo.email}`}
                className="px-4 py-2 rounded-lg text-sm font-medium transition-all hover:scale-105"
                style={{ 
                  backgroundColor: primaryColor,
                  color: '#ffffff'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.opacity = '0.9';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.opacity = '1';
                }}
              >
                Contact
              </a>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg transition-colors"
              style={{ 
                color: textColor,
                backgroundColor: isOpen 
                  ? (isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)')
                  : 'transparent'
              }}
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div 
            className="lg:hidden py-4 border-t animate-in slide-in-from-top"
            style={{ borderColor: borderColor }}
          >
            <div className="flex flex-col space-y-2 mb-4">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    className="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors text-left"
                    style={{ 
                      color: textColor,
                      backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = primaryColor;
                      e.currentTarget.style.backgroundColor = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = textColor;
                      e.currentTarget.style.backgroundColor = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)';
                    }}
                  >
                    <Icon className="w-5 h-5" />
                    {item.label}
                  </button>
                );
              })}
            </div>
            
            {/* Mobile Social Links */}
            {socialLinks.length > 0 && (
              <div className="flex items-center gap-3 pt-4 border-t" style={{ borderColor: borderColor }}>
                {socialLinks.map((social) => {
                  const Icon = social.icon;
                  return (
                    <a
                      key={social.name}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 rounded-full flex items-center justify-center transition-all"
                      style={{ 
                        backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
                        color: textColor
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = primaryColor;
                        e.currentTarget.style.color = '#ffffff';
                        e.currentTarget.style.transform = 'scale(1.1)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)';
                        e.currentTarget.style.color = textColor;
                        e.currentTarget.style.transform = 'scale(1)';
                      }}
                      aria-label={social.name}
                    >
                      <Icon className="w-5 h-5" />
                    </a>
                  );
                })}
                {contactInfo?.email && (
                  <a
                    href={`mailto:${contactInfo.email}`}
                    className="ml-auto px-4 py-2 rounded-lg text-sm font-medium transition-all"
                    style={{ 
                      backgroundColor: primaryColor,
                      color: '#ffffff'
                    }}
                  >
                    Contact
                  </a>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}

