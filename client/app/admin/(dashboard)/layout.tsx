'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { User, Briefcase, Star, FileText, LogOut, Menu, X, Eye, Palette, Mail } from 'lucide-react';
import AuthGuard from '@/lib/components/AuthGuard';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [username, setUsername] = useState<string>('');

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { authAPI } = await import('@/lib/api');
        const meResponse = await authAPI.getMe();
        setUsername(meResponse.data.username);
      } catch (err) {
        console.error('Failed to get user info');
      }
    };
    fetchUser();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  const menuItems = [
    { href: '/admin/profile', label: 'Edit Profile', icon: User },
    { href: '/admin/portfolio', label: 'Manage Portfolio', icon: Briefcase },
    { href: '/admin/reviews', label: 'Education', icon: Star },
    { href: '/admin/about', label: 'Edit About', icon: FileText },
    { href: '/admin/theme', label: 'Theme', icon: Palette },
    { href: '/admin/contacts', label: 'Contact Messages', icon: Mail },
  ];

  return (
    <AuthGuard>
      <div className="min-h-screen bg-zinc-50 dark:bg-black flex">
        {/* Sidebar */}
        <aside
          className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-800 transform ${
            isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } lg:translate-x-0 transition-transform duration-200 ease-in-out`}
        >
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between p-4 border-b border-zinc-200 dark:border-zinc-800">
              <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">Admin</h2>
              <button
                onClick={() => setIsSidebarOpen(false)}
                className="lg:hidden p-2 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <nav className="flex-1 p-4 space-y-2">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
                        : 'text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                    }`}
                    onClick={() => setIsSidebarOpen(false)}
                  >
                    <Icon className="w-5 h-5" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
            <div className="p-4 border-t border-zinc-200 dark:border-zinc-800 space-y-2">
              {/* View Profile Button */}
              {username && (
                <Link
                  href={`/${username}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 w-full px-4 py-3 bg-green-600 dark:bg-green-700 text-white hover:bg-green-700 dark:hover:bg-green-600 rounded-lg transition-colors"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  <Eye className="w-5 h-5" />
                  View Profile
                </Link>
              )}
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 w-full px-4 py-3 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
              >
                <LogOut className="w-5 h-5" />
                Logout
              </button>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1 lg:ml-64">
          {/* Mobile Header */}
          <header className="lg:hidden sticky top-0 z-40 bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 p-4">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded"
            >
              <Menu className="w-6 h-6" />
            </button>
          </header>

          {/* Overlay for mobile */}
          {isSidebarOpen && (
            <div
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
              onClick={() => setIsSidebarOpen(false)}
            />
          )}

          <main className="p-6">{children}</main>
        </div>
      </div>
    </AuthGuard>
  );
}

