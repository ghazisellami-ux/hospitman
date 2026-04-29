import { useState, useEffect } from 'react';

interface ProjectSettings {
  name: string;
  location: string;
  client: string;
  bedCount: number;
  startDate: string;
  endDate: string;
  budget: number;
  currency: string;
  description: string;
  hseEnabled: boolean;
}

const defaultProject: ProjectSettings = {
  name: 'Hôpital Régional 300 Lits',
  location: 'Tunis, Tunisie',
  client: 'Ministère de la Santé',
  bedCount: 300,
  startDate: '2026-01-15',
  endDate: '2028-06-30',
  budget: 85000000,
  currency: 'TND',
  description: '',
  hseEnabled: false,
};

const STORAGE_KEY = 'hospitman_project_settings';

export function useProjectSettings(): ProjectSettings {
  const [settings, setSettings] = useState<ProjectSettings>(defaultProject);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setSettings(JSON.parse(saved));
    } catch { /* ignore */ }

    // Listen for storage changes from other tabs/components
    const handler = () => {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) setSettings(JSON.parse(saved));
      } catch { /* ignore */ }
    };
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  }, []);

  return settings;
}

export function getCurrency(): string {
  if (typeof window === 'undefined') return 'TND';
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved).currency || 'TND';
  } catch { /* ignore */ }
  return 'TND';
}
