import Image from 'next/image';

interface ThemeColors {
  primary?: string;
  secondary?: string;
  accent?: string;
  background?: string;
  text?: string;
  card?: string;
  border?: string;
}

interface HeroSectionProps {
  displayName?: string;
  bio?: string;
  avatarUrl?: string;
  theme?: ThemeColors;
}

export default function HeroSection({ displayName, bio, avatarUrl, theme }: HeroSectionProps) {
  const bgColor = theme?.background || '#ffffff';
  const textColor = theme?.text || '#18181b';
  const cardColor = theme?.card || '#ffffff';
  const borderColor = theme?.border || '#e4e4e7';
  const primaryColor = theme?.primary || '#3b82f6';

  return (
    <section 
      id="hero"
      className="py-12 md:py-20 px-4"
      style={{ backgroundColor: bgColor }}
    >
      <div className="max-w-6xl mx-auto">
        <div 
          className="rounded-2xl p-8 md:p-12 lg:p-16 shadow-xl border"
          style={{ 
            backgroundColor: cardColor,
            borderColor: borderColor,
            boxShadow: `0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)`
          }}
        >
          <div className="flex flex-col items-center justify-center">
            <div 
              className="w-32 h-32 md:w-36 md:h-36 lg:w-40 lg:h-40 rounded-full overflow-hidden mb-6 md:mb-8 border-4 shadow-2xl transition-transform hover:scale-105"
              style={{ 
                borderColor: primaryColor,
                backgroundColor: cardColor
              }}
            >
              {avatarUrl ? (
                <Image
                  src={avatarUrl}
                  alt={displayName || 'Avatar'}
                  width={160}
                  height={160}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div 
                  className="w-full h-full flex items-center justify-center"
                  style={{ backgroundColor: borderColor }}
                >
                  <span style={{ color: textColor, fontSize: '2rem', fontWeight: 'bold' }}>
                    {displayName?.charAt(0).toUpperCase() || '?'}
                  </span>
                </div>
              )}
            </div>
            <h1 
              className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6 text-center"
              style={{ color: textColor }}
            >
              {displayName || 'Profile'}
            </h1>
            {bio && (
              <p 
                className="text-lg md:text-xl lg:text-2xl max-w-3xl text-center leading-relaxed px-4"
                style={{ 
                  color: textColor,
                  opacity: 0.8
                }}
              >
                {bio}
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

