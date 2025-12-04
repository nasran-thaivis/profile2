'use client';

import { Home, User, Briefcase, Star, Mail, Github, Linkedin, Twitter, Instagram, Facebook } from 'lucide-react';

interface ThemeColors {
  primary?: string;
  secondary?: string;
  accent?: string;
  background?: string;
  text?: string;
  card?: string;
  border?: string;
}

interface FooterProps {
  theme?: ThemeColors;
  displayName?: string;
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

export default function Footer({ theme, displayName, contactInfo }: FooterProps) {
  const bgColor = theme?.card || '#ffffff';
  const textColor = theme?.text || '#18181b';
  const borderColor = theme?.border || '#e4e4e7';
  const primaryColor = theme?.primary || '#3b82f6';
  const secondaryColor = theme?.secondary || '#8b5cf6';
  const isDark = theme?.background === '#000000' || 
                 theme?.background === '#18181b' || 
                 (typeof theme?.background === 'string' && theme.background.startsWith('rgb(0,')) || 
                 (typeof theme?.background === 'string' && theme.background.startsWith('#000'));

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
  ].filter(link => link.url); // Only show social links that have URLs

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer 
      className="mt-16 border-t"
      style={{ 
        backgroundColor: bgColor,
        borderColor: borderColor,
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {/* Brand Section */}
          <div className="space-y-4">
            <h3 
              className="text-2xl font-bold mb-4"
              style={{ color: textColor }}
            >
              {displayName || 'Profile'}
            </h3>
            <p 
              className="text-sm leading-relaxed"
              style={{ 
                color: textColor,
                opacity: 0.7
              }}
            >
              Thank you for visiting my profile. Feel free to reach out and connect!
            </p>
            {contactInfo?.email && (
              <a
                href={`mailto:${contactInfo.email}`}
                className="text-sm inline-block transition-colors"
                style={{ color: primaryColor }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.opacity = '0.8';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.opacity = '1';
                }}
              >
                {contactInfo.email}
              </a>
            )}
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 
              className="text-lg font-semibold mb-4"
              style={{ color: textColor }}
            >
              Quick Links
            </h4>
            <nav className="flex flex-col space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    className="flex items-center gap-2 text-sm transition-colors text-left"
                    style={{ color: textColor, opacity: 0.8 }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = primaryColor;
                      e.currentTarget.style.opacity = '1';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = textColor;
                      e.currentTarget.style.opacity = '0.8';
                    }}
                  >
                    <Icon className="w-4 h-4" />
                    {item.label}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Social Media & Contact */}
          <div className="space-y-4">
            <h4 
              className="text-lg font-semibold mb-4"
              style={{ color: textColor }}
            >
              Connect
            </h4>
            {socialLinks.length > 0 && (
              <div className="flex flex-wrap gap-3 mb-4">
                {socialLinks.map((social) => {
                  const Icon = social.icon;
                  return (
                    <a
                      key={social.name}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 rounded-full flex items-center justify-center transition-all hover:scale-110"
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
                      <Icon className="w-5 h-5" />
                    </a>
                  );
                })}
              </div>
            )}
            {contactInfo?.website && (
              <a
                href={contactInfo.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm inline-block transition-colors"
                style={{ color: primaryColor }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.opacity = '0.8';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.opacity = '1';
                }}
              >
                Visit Website →
              </a>
            )}
          </div>
        </div>

        {/* Divider */}
        <div 
          className="my-8"
          style={{ 
            borderTop: `1px solid ${borderColor}`,
            opacity: 0.3
          }}
        />

        {/* Copyright */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p 
            className="text-sm text-center md:text-left"
            style={{ 
              color: textColor,
              opacity: 0.6
            }}
          >
            © {new Date().getFullYear()} {displayName || 'Profile'}. All rights reserved.
          </p>
          <p 
            className="text-sm text-center md:text-right"
            style={{ 
              color: textColor,
              opacity: 0.6
            }}
          >
            Made with <span style={{ color: primaryColor }}>♥</span> using Next.js
          </p>
        </div>
      </div>
    </footer>
  );
}

