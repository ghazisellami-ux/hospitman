'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Language, t } from '@/lib/i18n';
import './globals.css';

// Language context
const LanguageContext = createContext<{
  lang: Language;
  setLang: (l: Language) => void;
}>({ lang: 'fr', setLang: () => {} });

export function useLanguage() {
  return useContext(LanguageContext);
}

// Sidebar navigation items
const navItems = [
  { key: 'dashboard', href: '/', icon: '📊' },
  { key: 'project', href: '/project', icon: '🏗️' },
  { key: 'scope', href: '/scope', icon: '🎯' },
  { key: 'schedule', href: '/schedule', icon: '⏱️' },
  { key: 'cost', href: '/cost', icon: '💰' },
  { key: 'hr', href: '/hr', icon: '👷' },
  { key: 'quality', href: '/quality', icon: '✅' },
  { key: 'communication', href: '/communication', icon: '📨' },
  { key: 'risk', href: '/risk', icon: '⚠️' },
  { key: 'reports', href: '/reports', icon: '📄' },
];

function Sidebar({ lang }: { lang: Language }) {
  const pathname = usePathname();

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-logo">H</div>
        <div>
          <div className="sidebar-title">HospitMan</div>
          <div className="sidebar-subtitle">300 Lits • Construction</div>
        </div>
      </div>
      <nav className="sidebar-nav">
        <div className="nav-section">
          <div className="nav-section-title">{t('nav.management', lang)}</div>
          {navItems.slice(0, 6).map((item) => (
            <Link
              key={item.key}
              href={item.href}
              className={`nav-item ${pathname === item.href ? 'active' : ''}`}
            >
              <span className="nav-icon">{item.icon}</span>
              <span>{t(`nav.${item.key}`, lang)}</span>
            </Link>
          ))}
        </div>
        <div className="nav-section">
          <div className="nav-section-title">{t('nav.support', lang)}</div>
          {navItems.slice(6).map((item) => (
            <Link
              key={item.key}
              href={item.href}
              className={`nav-item ${pathname === item.href ? 'active' : ''}`}
            >
              <span className="nav-icon">{item.icon}</span>
              <span>{t(`nav.${item.key}`, lang)}</span>
            </Link>
          ))}
        </div>
      </nav>
    </aside>
  );
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Language>('fr');
  const pathname = usePathname();
  const isLoginPage = pathname === '/login';

  useEffect(() => {
    const saved = localStorage.getItem('lang') as Language;
    if (saved) setLang(saved);
  }, []);

  const changeLang = (l: Language) => {
    setLang(l);
    localStorage.setItem('lang', l);
  };

  return (
    <html lang={lang}>
      <head>
        <title>HospitMan — Hospital Construction Management</title>
        <meta name="description" content="Platform for managing hospital construction projects — 300 beds" />
      </head>
      <body>
        <LanguageContext.Provider value={{ lang, setLang: changeLang }}>
          {isLoginPage ? (
            children
          ) : (
            <div className="app-layout">
              <Sidebar lang={lang} />
              <main className="main-content">
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
                  <div className="lang-switcher">
                    <button
                      className={`lang-btn ${lang === 'fr' ? 'active' : ''}`}
                      onClick={() => changeLang('fr')}
                    >
                      FR
                    </button>
                    <button
                      className={`lang-btn ${lang === 'en' ? 'active' : ''}`}
                      onClick={() => changeLang('en')}
                    >
                      EN
                    </button>
                  </div>
                </div>
                {children}
              </main>
            </div>
          )}
        </LanguageContext.Provider>
      </body>
    </html>
  );
}
