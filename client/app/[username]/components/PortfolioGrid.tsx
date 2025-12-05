import Image from 'next/image';
import { ExternalLink } from 'lucide-react';
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

interface PortfolioItem {
  id: number;
  title: string;
  description?: string;
  imageUrl?: string;
  link?: string;
}

interface PortfolioGridProps {
  portfolio: PortfolioItem[];
  theme?: ThemeColors;
}

export default function PortfolioGrid({ portfolio, theme }: PortfolioGridProps) {
  const bgColor = theme?.background || '#ffffff';
  const textColor = theme?.text || '#18181b';
  const cardColor = theme?.card || '#ffffff';
  const primaryColor = theme?.primary || '#3b82f6';
  const borderColor = theme?.border || '#e4e4e7';

  if (!portfolio || portfolio.length === 0) {
    return (
      <section 
        id="portfolio" 
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
              Portfolio
            </h2>
            <p style={{ color: textColor, opacity: 0.7, fontSize: '1.1rem' }}>No portfolio items yet.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section 
      id="portfolio" 
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
            Portfolio
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {portfolio.map((item) => (
              <div
                key={item.id}
                className="rounded-xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border flex flex-col"
                style={{ 
                  backgroundColor: cardColor,
                  borderColor: borderColor
                }}
              >
                {item.imageUrl && (
                  <div className="relative w-full h-48 md:h-56 overflow-hidden flex-shrink-0">
                    <Image
                      src={getImageUrl(item.imageUrl)}
                      alt={item.title}
                      fill
                      className="object-cover transition-transform duration-300 hover:scale-110"
                      unoptimized
                    />
                  </div>
                )}
                <div className="p-4 md:p-6 flex flex-col flex-grow">
                  <h3 
                    className="text-lg md:text-xl font-semibold mb-2 md:mb-3"
                    style={{ color: textColor }}
                  >
                    {item.title}
                  </h3>
                  {item.description && (
                    <p 
                      className="mb-4 line-clamp-3 text-sm md:text-base flex-grow"
                      style={{ color: textColor, opacity: 0.75 }}
                    >
                      {item.description}
                    </p>
                  )}
                  {item.link && (
                    <a
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 font-medium transition-colors hover:underline mt-auto"
                      style={{ color: primaryColor }}
                    >
                      Visit <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

