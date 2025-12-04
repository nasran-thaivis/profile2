import { notFound } from 'next/navigation';
import { profileAPI, aboutAPI, portfolioAPI, educationAPI } from '@/lib/api';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import AboutSection from './components/AboutSection';
import PortfolioGrid from './components/PortfolioGrid';
import EducationList from './components/EducationList';
import ContactSection from './components/ContactSection';
import Footer from './components/Footer';

interface PageProps {
  params: Promise<{
    username: string;
  }>;
}

export default async function UserProfilePage({ params }: PageProps) {
  const { username } = await params;

  const [profile, about, portfolio, educations] = await Promise.all([
    profileAPI.getByUsername(username)
      .then((res) => res.data)
      .catch((err) => {
        // Only log if it's not a 404 (expected for non-existent users)
        if (err.response?.status !== 404) {
          console.error('Error fetching profile:', err);
        }
        return null;
      }),
    aboutAPI.getByUsername(username)
      .then((res) => res.data)
      .catch(() => null),
    portfolioAPI.getByUsername(username)
      .then((res) => res.data)
      .catch(() => []),
    educationAPI.getByUsername(username)
      .then((res) => res.data)
      .catch(() => []),
  ]);

  if (!profile) {
    notFound();
  }

  // Extract theme from profile, with defaults
  const theme = profile.theme || {
    primary: '#3b82f6',
    secondary: '#8b5cf6',
    accent: '#10b981',
    background: '#ffffff',
    text: '#18181b',
    card: '#ffffff',
    border: '#e4e4e7',
  };

  return (
    <div 
      className="min-h-screen"
      style={{ 
        backgroundColor: theme.background || '#ffffff',
        color: theme.text || '#18181b'
      }}
    >
      <Header 
        theme={theme}
        displayName={profile.displayName}
        avatarUrl={profile.avatarUrl}
        contactInfo={profile.contactInfo}
      />
      <div id="hero" className="mb-6 md:mb-8">
        <HeroSection
          displayName={profile.displayName}
          bio={profile.bio}
          avatarUrl={profile.avatarUrl}
          theme={theme}
        />
      </div>
      <div className="mb-6 md:mb-8">
        <AboutSection content={about?.content} theme={theme} />
      </div>
      <div className="mb-6 md:mb-8">
        <PortfolioGrid portfolio={portfolio} theme={theme} />
      </div>
      <div className="mb-6 md:mb-8">
        <EducationList educations={educations} theme={theme} />
      </div>
      <div className="mb-6 md:mb-8">
        <ContactSection contactInfo={profile.contactInfo} userId={profile.userId} theme={theme} />
      </div>
      <Footer 
        theme={theme}
        displayName={profile.displayName}
        contactInfo={profile.contactInfo}
      />
    </div>
  );
}

