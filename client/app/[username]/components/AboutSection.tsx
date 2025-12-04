interface ThemeColors {
  primary?: string;
  secondary?: string;
  accent?: string;
  background?: string;
  text?: string;
  card?: string;
  border?: string;
}

interface AboutSectionProps {
  content?: string;
  theme?: ThemeColors;
}

export default function AboutSection({ content, theme }: AboutSectionProps) {
  if (!content) {
    return null;
  }

  const bgColor = theme?.background || '#ffffff';
  const textColor = theme?.text || '#18181b';
  const cardColor = theme?.card || '#ffffff';
  const borderColor = theme?.border || '#e4e4e7';
  const primaryColor = theme?.primary || '#3b82f6';

  return (
    <section 
      id="about" 
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
            About
          </h2>
          <div className="prose prose-lg max-w-none">
            <p 
              className="whitespace-pre-line leading-relaxed text-base md:text-lg"
              style={{ 
                color: textColor,
                opacity: 0.85,
                lineHeight: '1.8'
              }}
            >
              {content}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

