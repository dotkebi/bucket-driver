'use client';

import {ReactNode, useEffect, useState} from 'react';
import Link from 'next/link';
import {usePathname} from 'next/navigation';
import {signOut} from 'next-auth/react';
import {setAccessToken} from '@/src/api/mutator/custom-instance';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    const checkDesktop = () => {
      const desktop = window.innerWidth >= 1024;
      setIsDesktop(desktop);
      setSidebarOpen(desktop);
    };

    checkDesktop();
    window.addEventListener('resize', checkDesktop);
    return () => window.removeEventListener('resize', checkDesktop);
  }, []);

  useEffect(() => {
    if (!isDesktop) {
      setSidebarOpen(false);
    }
  }, [pathname, isDesktop]);

  const handleLogout = async () => {
    if (loggingOut) return;

    setLoggingOut(true);
    setAccessToken(null);

    try {
      const result = await signOut({ redirect: false, redirectTo: '/login' });
      window.location.replace(result.url || '/login');
    } catch (error) {
      console.error('Failed to sign out:', error);
      setLoggingOut(false);
    }
  };

  const menuItems = [
    { href: '/', icon: 'dashboard', label: '대시보드' },
    { href: '/pickups/assigned', icon: 'assignment', label: '배정된 수거' },
    { href: '/pickups/completed', icon: 'check_circle', label: '완료된 수거' },
    { href: '/allowance', icon: 'account_balance_wallet', label: '수당 조회' },
  ];

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(href);
  };

  return (
    <div className="page-wrapper">
      <header className="top-header">
        <nav className="navbar">
          <div className="btn-toggle lg:hidden">
            <button
              type="button"
              aria-label="사이드바 토글"
              onClick={() => setSidebarOpen((prev) => !prev)}
            >
              <span className="material-icons-outlined">menu</span>
            </button>
          </div>

          <div className="search-bar hidden lg:block">
            <div className="search-bar-inner">
              <input
                type="search"
                placeholder="메뉴 검색"
                className="search-control"
                aria-label="메뉴 검색"
              />
              <span className="material-icons-outlined search-icon">search</span>
            </div>
          </div>

          <div className="flex-grow" />

          <ul className="nav-right-links">
            <li className="nav-item profile-menu">
              <button type="button" className="nav-link profile-trigger" aria-label="사용자 메뉴">
                <div className="avatar-circle">
                  <span className="text-white text-sm font-medium">D</span>
                </div>
              </button>
              <div
                className="profile-dropdown"
                style={{
                  boxShadow: '0 0.5rem 1rem rgba(0, 0, 0, 0.15)',
                  animation: '0.6s cubic-bezier(0.25, 0.8, 0.25, 1) 0s normal forwards 1 animdropdown',
                }}
              >
                <div className="profile-dropdown-header">
                  <div className="avatar-circle large">
                    <span className="text-white text-2xl font-medium">D</span>
                  </div>
                  <h5 className="font-bold mb-0">드라이버</h5>
                </div>
                <div className="profile-dropdown-actions">
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="dropdown-action"
                    disabled={loggingOut}
                  >
                    <span className="material-icons-outlined text-lg">power_settings_new</span>
                    {loggingOut ? '로그아웃 중...' : '로그아웃'}
                  </button>
                </div>
              </div>
            </li>
          </ul>
        </nav>
      </header>

      <aside className={`sidebar-wrapper ${sidebarOpen || isDesktop ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="logo-icon">
            <div className="logo-mark">
              <span className="text-white font-bold text-lg">B</span>
            </div>
          </div>
          <div className="logo-name flex-grow-1">
            <h5 className="mb-0 text-2xl font-semibold capitalize">Bucket</h5>
          </div>
          <button
            type="button"
            className="sidebar-close lg:hidden"
            onClick={() => setSidebarOpen(false)}
            aria-label="사이드바 닫기"
          >
            <span className="material-icons-outlined">close</span>
          </button>
        </div>

        <nav className="sidebar-nav">
          <ul className="metismenu">
            {menuItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => !isDesktop && setSidebarOpen(false)}
                  className={isActive(item.href) ? 'active' : ''}
                >
                  <div className="parent-icon">
                    <span className="material-icons-outlined text-xl">{item.icon}</span>
                  </div>
                  <div className="menu-title">{item.label}</div>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {sidebarOpen && !isDesktop && (
        <div
          className="sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <main className="main-wrapper">
        <div className="main-content">{children}</div>
      </main>
    </div>
  );
}
