interface ThemeColors {
  primary?: string;
  secondary?: string;
  accent?: string;
  background?: string;
  text?: string;
  card?: string;
  border?: string;
}

interface AboutBlock {
  id: string;
  type: 'text' | 'skills' | 'achievements' | 'timeline' | 'stats' | 'image';
  data: any;
}

interface AboutSectionProps {
  content?: string;
  blocks?: AboutBlock[];
  theme?: ThemeColors;
}

export default function AboutSection({ content, blocks, theme }: AboutSectionProps) {
  const bgColor = theme?.background || '#ffffff';
  const textColor = theme?.text || '#18181b';
  const cardColor = theme?.card || '#ffffff';
  const borderColor = theme?.border || '#e4e4e7';
  const primaryColor = theme?.primary || '#3b82f6';

  // Use blocks if available, otherwise fall back to content
  const displayBlocks = blocks && blocks.length > 0 ? blocks : 
    (content ? [{ id: '1', type: 'text' as const, data: { content } }] : []);

  if (displayBlocks.length === 0) {
    return null;
  }

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
          
          <div className="space-y-8">
            {displayBlocks.map((block) => (
              <BlockRenderer 
                key={block.id} 
                block={block} 
                theme={{ textColor, primaryColor, borderColor, cardColor }} 
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function BlockRenderer({ block, theme }: { block: AboutBlock; theme: any }) {
  switch (block.type) {
    case 'text':
      return (
        <div 
          className="prose prose-lg max-w-none whitespace-pre-line leading-relaxed"
          style={{ color: theme.textColor, opacity: 0.85 }}
        >
          {block.data.content}
        </div>
      );

    case 'skills':
      return (
        <div>
          <h3 className="text-xl font-semibold mb-4" style={{ color: theme.textColor }}>Skills</h3>
          <div className="flex flex-wrap gap-3">
            {(block.data.items || []).map((skill: string, idx: number) => (
              <span
                key={idx}
                className="px-4 py-2 rounded-full text-sm font-medium transition-transform hover:scale-105"
                style={{
                  backgroundColor: `${theme.primaryColor}20`,
                  color: theme.primaryColor,
                  border: `1px solid ${theme.primaryColor}40`
                }}
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      );

    case 'achievements':
      return (
        <div>
          <h3 className="text-xl font-semibold mb-4" style={{ color: theme.textColor }}>Achievements</h3>
          <div className="space-y-4">
            {(block.data.items || []).map((item: any, idx: number) => (
              <div 
                key={idx} 
                className="p-4 rounded-lg border-l-4"
                style={{
                  borderLeftColor: theme.primaryColor,
                  backgroundColor: `${theme.primaryColor}05`,
                  borderColor: theme.borderColor
                }}
              >
                <h4 className="font-semibold mb-1" style={{ color: theme.textColor }}>
                  {item.title}
                </h4>
                {item.description && (
                  <p className="text-sm" style={{ color: theme.textColor, opacity: 0.7 }}>
                    {item.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      );

    case 'timeline':
      return (
        <div>
          <h3 className="text-xl font-semibold mb-4" style={{ color: theme.textColor }}>Timeline</h3>
          <div className="relative pl-8 space-y-6">
            {(block.data.items || []).map((item: any, idx: number) => (
              <div key={idx} className="relative">
                <div 
                  className="absolute left-0 top-2 w-4 h-4 rounded-full border-2"
                  style={{ 
                    backgroundColor: theme.cardColor,
                    borderColor: theme.primaryColor 
                  }}
                />
                {idx < (block.data.items?.length || 0) - 1 && (
                  <div 
                    className="absolute left-2 top-6 w-0.5 h-full"
                    style={{ backgroundColor: theme.borderColor }}
                  />
                )}
                <div className="ml-6">
                  <div className="flex items-center gap-2 mb-1">
                    <span 
                      className="font-bold text-lg"
                      style={{ color: theme.primaryColor }}
                    >
                      {item.year}
                    </span>
                  </div>
                  <h4 className="font-semibold mb-1" style={{ color: theme.textColor }}>
                    {item.title}
                  </h4>
                  {item.description && (
                    <p className="text-sm" style={{ color: theme.textColor, opacity: 0.7 }}>
                      {item.description}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      );

    case 'stats':
      return (
        <div>
          <h3 className="text-xl font-semibold mb-4" style={{ color: theme.textColor }}>Statistics</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {(block.data.items || []).map((item: any, idx: number) => (
              <div key={idx} className="text-center">
                <div 
                  className="text-4xl font-bold mb-2"
                  style={{ color: theme.primaryColor }}
                >
                  {item.value}
                </div>
                <div 
                  className="text-sm"
                  style={{ color: theme.textColor, opacity: 0.7 }}
                >
                  {item.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      );

    case 'image':
      return block.data.url ? (
        <div className="my-4">
          <img 
            src={block.data.url} 
            alt={block.data.alt || ''} 
            className="w-full rounded-lg shadow-md"
          />
        </div>
      ) : null;

    default:
      return null;
  }
}

