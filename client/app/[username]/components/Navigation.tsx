'use client';

import { useState } from 'react';
import { Home, User, Briefcase, Star, Mail, Menu, X } from 'lucide-react';

interface ThemeColors {
  primary?: string;
  secondary?: string;
  accent?: string;
  background?: string;
  text?: string;
  card?: string;
  border?: string;
}

interface NavigationProps {
  theme?: ThemeColors;
}

export default function Navigation({ theme }: NavigationProps) {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { id: 'hero', label: 'Home', icon: Home },
    { id: 'about', label: 'About', icon: User },
    { id: 'portfolio', label: 'Portfolio', icon: Briefcase },
    { id: 'education', label: 'Education', icon: Star },
    { id: 'contact', label: 'Contact', icon: Mail },
  ];

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

  return (
    <nav 
      className="sticky top-0 z-50 border-b shadow-sm"
      style={{ 
        backgroundColor: bgColor,
        borderColor: borderColor
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <button
              onClick={() => scrollToSection('hero')}
              className="text-xl font-bold"
              style={{ color: textColor }}
            >
              Profile
            </button>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-colors"
                  style={{ 
                    color: textColor,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = primaryColor;
                    e.currentTarget.style.backgroundColor = theme?.background === '#000000' || theme?.background === '#18181b' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = textColor;
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </button>
              );
            })}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-md"
              style={{ color: textColor }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = theme?.background === '#000000' || theme?.background === '#18181b' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div 
            className="md:hidden py-4 border-t"
            style={{ borderColor: borderColor }}
          >
            <div className="flex flex-col space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    className="flex items-center gap-3 px-4 py-2 text-sm font-medium rounded-md transition-colors"
                    style={{ color: textColor }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = primaryColor;
                      e.currentTarget.style.backgroundColor = theme?.background === '#000000' || theme?.background === '#18181b' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = textColor;
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                  >
                    <Icon className="w-5 h-5" />
                    {item.label}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

