'use client';

import React, { useState, useEffect } from 'react';
import { useLanguage } from '../layout';
import { t } from '@/lib/i18n';
import { Building2, Bell, Check } from 'lucide-react';

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

interface TelegramSettings {
  botToken: string;
  chatId: string;
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
  description: 'Construction d\'un hôpital régional de 300 lits avec bloc opératoire, urgences, imagerie médicale, et services d\'hospitalisation.',
  hseEnabled: false,
};

const defaultTelegram: TelegramSettings = {
  botToken: '',
  chatId: '',
};

const STORAGE_KEY_PROJECT = 'hospitman_project_settings';
const STORAGE_KEY_TELEGRAM = 'hospitman_telegram_settings';

function loadFromStorage<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const saved = localStorage.getItem(key);
    if (saved) return JSON.parse(saved);
  } catch { /* ignore */ }
  return fallback;
}

export default function ProjectPage() {
  const { lang } = useLanguage();
  const [mounted, setMounted] = useState(false);

  const [project, setProject] = useState<ProjectSettings>(defaultProject);
  const [telegram, setTelegram] = useState<TelegramSettings>(defaultTelegram);
  const [projectSaved, setProjectSaved] = useState(false);
  const [telegramSaved, setTelegramSaved] = useState(false);

  // Load saved data from localStorage on mount
  useEffect(() => {
    setProject(loadFromStorage(STORAGE_KEY_PROJECT, defaultProject));
    setTelegram(loadFromStorage(STORAGE_KEY_TELEGRAM, defaultTelegram));
    setMounted(true);
  }, []);

  const handleProjectSave = () => {
    localStorage.setItem(STORAGE_KEY_PROJECT, JSON.stringify(project));
    setProjectSaved(true);
    setTimeout(() => setProjectSaved(false), 2500);
  };

  const handleTelegramSave = () => {
    localStorage.setItem(STORAGE_KEY_TELEGRAM, JSON.stringify(telegram));
    setTelegramSaved(true);
    setTimeout(() => setTelegramSaved(false), 2500);
  };

  const updateProject = (field: keyof ProjectSettings, value: string | number | boolean) => {
    setProject(prev => ({ ...prev, [field]: value }));
  };

  // Avoid hydration mismatch — show nothing until mounted
  if (!mounted) {
    return (
      <div className="animate-in">
        <div className="page-header">
          <h1 className="page-title"><Building2 size={24} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 8 }} />{lang === 'fr' ? 'Paramètres du Projet' : 'Project Settings'}</h1>
        </div>
        <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>
          {lang === 'fr' ? 'Chargement...' : 'Loading...'}
        </div>
      </div>
    );
  }

  return (
    <div className="animate-in">
      <div className="page-header">
        <h1 className="page-title"><Building2 size={24} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 8 }} />{lang === 'fr' ? 'Paramètres du Projet' : 'Project Settings'}</h1>
      </div>

      <div style={{ maxWidth: 800 }}>
        <div className="chart-card" style={{ marginBottom: 20 }}>
          <div className="chart-title">{lang === 'fr' ? 'Informations Générales' : 'General Information'}</div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">{lang === 'fr' ? 'Nom du projet' : 'Project name'}</label>
              <input className="form-input" value={project.name} onChange={(e) => updateProject('name', e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">{lang === 'fr' ? 'Localisation' : 'Location'}</label>
              <input className="form-input" value={project.location} onChange={(e) => updateProject('location', e.target.value)} />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">{lang === 'fr' ? 'Maître d\'ouvrage' : 'Client'}</label>
              <input className="form-input" value={project.client} onChange={(e) => updateProject('client', e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">{lang === 'fr' ? 'Nombre de lits' : 'Bed count'}</label>
              <input className="form-input" type="number" value={project.bedCount} onChange={(e) => updateProject('bedCount', parseInt(e.target.value) || 0)} />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">{lang === 'fr' ? 'Date début planifiée' : 'Planned start'}</label>
              <input className="form-input" type="date" value={project.startDate} onChange={(e) => updateProject('startDate', e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">{lang === 'fr' ? 'Date fin planifiée' : 'Planned end'}</label>
              <input className="form-input" type="date" value={project.endDate} onChange={(e) => updateProject('endDate', e.target.value)} />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">{lang === 'fr' ? 'Budget total' : 'Total budget'}</label>
              <input className="form-input" type="number" value={project.budget} onChange={(e) => updateProject('budget', parseInt(e.target.value) || 0)} />
            </div>
            <div className="form-group">
              <label className="form-label">{lang === 'fr' ? 'Devise' : 'Currency'}</label>
              <select className="form-select" value={project.currency} onChange={(e) => updateProject('currency', e.target.value)}>
                <option value="TND">TND - Dinar Tunisien</option>
                <option value="EUR">EUR - Euro</option>
                <option value="USD">USD - Dollar</option>
              </select>
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">{t('common.description', lang)}</label>
            <textarea className="form-textarea" value={project.description} onChange={(e) => updateProject('description', e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
              <input type="checkbox" checked={project.hseEnabled} onChange={(e) => updateProject('hseEnabled', e.target.checked)} style={{ width: 16, height: 16 }} />
              {lang === 'fr' ? 'Activer le module HSE (Hygiène Sécurité Environnement)' : 'Enable HSE module (Health Safety Environment)'}
            </label>
          </div>
          <div style={{ marginTop: 16, display: 'flex', alignItems: 'center', gap: 12 }}>
            <button className="btn btn-primary" onClick={handleProjectSave}>{t('common.save', lang)}</button>
            {projectSaved && (
              <span style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#10b981', fontSize: 14, fontWeight: 600, animation: 'fadeIn 0.3s ease' }}>
                <Check size={16} /> {lang === 'fr' ? 'Enregistré avec succès' : 'Saved successfully'}
              </span>
            )}
          </div>
        </div>

        {/* Telegram Config */}
        <div className="chart-card">
          <div className="chart-title"><Bell size={18} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 6 }} />Telegram {lang === 'fr' ? 'Notifications' : 'Notifications'}</div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Bot Token</label>
              <input className="form-input" type="password" placeholder="123456:ABC-DEF..." value={telegram.botToken} onChange={(e) => setTelegram(prev => ({ ...prev, botToken: e.target.value }))} />
            </div>
            <div className="form-group">
              <label className="form-label">Chat ID</label>
              <input className="form-input" placeholder="-1001234567890" value={telegram.chatId} onChange={(e) => setTelegram(prev => ({ ...prev, chatId: e.target.value }))} />
            </div>
          </div>
          <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 12 }}>
            {lang === 'fr'
              ? 'Recevez des alertes Telegram pour : retards de planning, risques critiques, nouvelles NCR'
              : 'Receive Telegram alerts for: schedule delays, critical risks, new NCRs'}
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button className="btn btn-secondary" onClick={handleTelegramSave}>{t('common.save', lang)}</button>
            {telegramSaved && (
              <span style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#10b981', fontSize: 14, fontWeight: 600, animation: 'fadeIn 0.3s ease' }}>
                <Check size={16} /> {lang === 'fr' ? 'Enregistré avec succès' : 'Saved successfully'}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
