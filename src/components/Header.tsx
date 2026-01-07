'use client';

import { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BookOpen, Search, LogOut, X, LayoutDashboard, Compass, User, Users, Library, Settings, Upload } from 'lucide-react';

export default function Header() {
  const { user, signOut, loading: authLoading } = useAuth();
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSearch(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (authLoading || !user || pathname === '/' || pathname.startsWith('/auth/')) {
    return null;
  }

  const isActive = (path: string) => pathname === path || pathname.startsWith(path + '/');

    const navigationItems = [
      {
        href: '/dashboard',
        label: 'Dashboard',
        icon: LayoutDashboard,
      },
      {
        href: '/discover',
        label: 'Discover',
        icon: Compass,
      },
      {
        href: '/my-books',
        label: 'My Books',
        icon: Library,
      },
      {
        href: '/profile',
        label: 'Profile',
        icon: User,
      },
      {
        href: '/friends',
        label: 'Friends',
        icon: Users,
      },
    ];

  return (
    <>
      <header className="bg-white/95 backdrop-blur-sm shadow-sm sticky top-0 z-50 border-b border-gray-100">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center space-x-8">
              <Link href="/dashboard" className="flex items-center space-x-3 group">
                <div className="relative">
                  <div className="w-10 h-10 bg-gradient-to-br from-[#018283] to-[#2CAED8] rounded-xl flex items-center justify-center shadow-sm group-hover:shadow-md transition-all duration-200 group-hover:scale-105">
                    <BookOpen className="h-6 w-6 text-white" />
                  </div>
                  <div className="absolute inset-0 bg-[#018283]/20 rounded-xl blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
                </div>
                <h1 className="text-xl font-semibold text-gray-900 tracking-tight">BookTracker</h1>
              </Link>

              <div className="hidden md:block h-8 w-px bg-gray-200"></div>

              <div className="hidden md:flex items-center space-x-1">
                {navigationItems.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.href);
                  
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`
                        relative flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200
                        ${active 
                          ? 'text-[#018283] bg-[#018283]/5 font-medium' 
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                        }
                        group
                      `}
                    >
                      <Icon className={`
                        h-4 w-4 transition-all duration-200
                        ${active 
                          ? 'text-[#018283]' 
                          : 'text-gray-400 group-hover:text-gray-600'
                        }
                      `} />
                      <span className="text-sm font-medium">{item.label}</span>
                      
                      {active && (
                        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full">
                          <div className="w-6 h-0.5 bg-[#018283] rounded-full"></div>
                        </div>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowSearch(!showSearch)}
                aria-label="Toggle search"
                className={`
                  relative p-2.5 rounded-lg transition-all duration-200
                  ${showSearch 
                    ? 'bg-[#018283]/10 text-[#018283]' 
                    : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'
                  }
                  group
                `}
              >
                <Search className="h-5 w-5" />
                <div className="absolute inset-0 bg-[#018283]/10 rounded-lg scale-0 group-hover:scale-100 transition-transform duration-200 -z-10"></div>
              </button>

              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  aria-label="User menu"
                  className="
                    flex items-center space-x-3 pl-3 pr-4 py-2.5 
                    bg-gradient-to-r from-gray-50 to-gray-100/50 
                    hover:from-gray-100 hover:to-gray-200/50 
                    rounded-lg transition-all duration-200 
                    border border-gray-200/50 hover:border-gray-300/50
                    group
                  "
                >
                  <div className="relative">
                    <div className="w-8 h-8 bg-gradient-to-br from-[#018283] to-[#2CAED8] rounded-full flex items-center justify-center text-white text-sm font-semibold shadow-sm group-hover:shadow-md transition-all duration-200">
                      {user.user_metadata?.name?.[0] || 'U'}
                    </div>
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-[#018283]/20 to-[#2CAED8]/20 rounded-full blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                  <span className="text-sm text-gray-700 font-medium hidden sm:inline">
                    {user.user_metadata?.name?.split(' ')[0] || 'User'}
                  </span>
                  <svg className={`h-4 w-4 text-gray-400 transition-transform ${showUserMenu ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                  </svg>
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                    <Link
                      href="/profile"
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 border-b border-gray-100"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        My Profile
                      </div>
                    </Link>
                    <Link
                      href="/settings"
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 border-b border-gray-100"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <div className="flex items-center gap-2">
                        <Settings className="h-4 w-4" />
                        Settings
                      </div>
                    </Link>
                    <Link
                      href="/import-books"
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 border-b border-gray-100"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <div className="flex items-center gap-2">
                        <Upload className="h-4 w-4" />
                        Import from Notion
                      </div>
                    </Link>
                    <button
                      onClick={() => {
                        signOut();
                        setShowUserMenu(false);
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      <div className="flex items-center gap-2">
                        <LogOut className="h-4 w-4" />
                        Sign Out
                      </div>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </nav>

        {showSearch && (
          <div ref={searchRef} className="border-t border-gray-100 bg-white/95 backdrop-blur-sm shadow-lg">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
              <div className="flex items-center space-x-3">
                <div className="flex-1 relative">
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search for books, authors, or ISBN..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && searchQuery.trim()) {
                        window.location.href = `/discover?q=${encodeURIComponent(searchQuery.trim())}`;
                      }
                    }}
                    autoFocus
                    className="
                      w-full pl-12 pr-4 py-3 
                      border border-gray-200 rounded-xl 
                      focus:outline-none focus:ring-2 focus:ring-[#018283]/20 focus:border-[#018283]
                      bg-gray-50/50 focus:bg-white
                      transition-all duration-200
                      text-gray-900 placeholder-gray-400
                    "
                  />
                </div>
                <button
                  onClick={() => {
                    setShowSearch(false);
                    setSearchQuery('');
                  }}
                  aria-label="Close search"
                  className="
                    p-3 hover:bg-gray-100 rounded-lg transition-colors duration-200
                    text-gray-400 hover:text-gray-600
                  "
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-3 flex items-center">
                <kbd className="px-2 py-1 bg-gray-100 border border-gray-200 rounded text-xs font-mono mr-2">Enter</kbd>
                to search
              </p>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
