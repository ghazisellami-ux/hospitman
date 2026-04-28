'use client';

import React from 'react';
import { useLanguage } from '../layout';
import { t } from '@/lib/i18n';
import { Building2, Bell } from 'lucide-react';

export default function ProjectPage() {
  const { lang } = useLanguage();

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
              <input className="form-input" defaultValue="Hôpital Régional 300 Lits" />
            </div>
            <div className="form-group">
              <label className="form-label">{lang === 'fr' ? 'Localisation' : 'Location'}</label>
              <input className="form-input" defaultValue="Tunis, Tunisie" />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">{lang === 'fr' ? 'Maître d\'ouvrage' : 'Client'}</label>
              <input className="form-input" defaultValue="Ministère de la Santé" />
            </div>
            <div className="form-group">
              <label className="form-label">{lang === 'fr' ? 'Nombre de lits' : 'Bed count'}</label>
              <input className="form-input" type="number" defaultValue={300} />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">{lang === 'fr' ? 'Date début planifiée' : 'Planned start'}</label>
              <input className="form-input" type="date" defaultValue="2026-01-15" />
            </div>
            <div className="form-group">
              <label className="form-label">{lang === 'fr' ? 'Date fin planifiée' : 'Planned end'}</label>
              <input className="form-input" type="date" defaultValue="2028-06-30" />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">{lang === 'fr' ? 'Budget total' : 'Total budget'}</label>
              <input className="form-input" type="number" defaultValue={85000000} />
            </div>
            <div className="form-group">
              <label className="form-label">{lang === 'fr' ? 'Devise' : 'Currency'}</label>
              <select className="form-select" defaultValue="TND">
                <option value="TND">TND - Dinar Tunisien</option>
                <option value="EUR">EUR - Euro</option>
                <option value="USD">USD - Dollar</option>
              </select>
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">{t('common.description', lang)}</label>
            <textarea className="form-textarea" defaultValue="Construction d'un hôpital régional de 300 lits avec bloc opératoire, urgences, imagerie médicale, et services d'hospitalisation." />
          </div>
          <div className="form-group">
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <input type="checkbox" defaultChecked={false} style={{ width: 16, height: 16 }} />
              {lang === 'fr' ? 'Activer le module HSE (Hygiène Sécurité Environnement)' : 'Enable HSE module (Health Safety Environment)'}
            </label>
          </div>
          <div style={{ marginTop: 16 }}>
            <button className="btn btn-primary">{t('common.save', lang)}</button>
          </div>
        </div>

        {/* Telegram Config */}
        <div className="chart-card">
          <div className="chart-title"><Bell size={18} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 6 }} />Telegram {lang === 'fr' ? 'Notifications' : 'Notifications'}</div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Bot Token</label>
              <input className="form-input" type="password" placeholder="123456:ABC-DEF..." />
            </div>
            <div className="form-group">
              <label className="form-label">Chat ID</label>
              <input className="form-input" placeholder="-1001234567890" />
            </div>
          </div>
          <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 12 }}>
            {lang === 'fr'
              ? 'Recevez des alertes Telegram pour : retards de planning, risques critiques, nouvelles NCR'
              : 'Receive Telegram alerts for: schedule delays, critical risks, new NCRs'}
          </p>
          <button className="btn btn-secondary">{t('common.save', lang)}</button>
        </div>
      </div>
    </div>
  );
}
