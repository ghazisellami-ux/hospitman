'use client';

import React from 'react';
import { useLanguage } from '../layout';
import { t } from '@/lib/i18n';
import { MessageSquare, HelpCircle, Mail, FileText, CheckCircle } from 'lucide-react';

const demoComms = [
  { id: 1, type: 'meeting', date: '2026-04-28', subject: 'Réunion hebdomadaire de chantier #18', participants: 'Direction, BTP STAR, Supervision' },
  { id: 2, type: 'rfi', date: '2026-04-26', subject: 'RFI-045: Épaisseur dalle bloc opératoire', participants: 'BET Structure, Direction' },
  { id: 3, type: 'correspondence', date: '2026-04-24', subject: 'Mise en demeure retard lot VRD', participants: 'Direction, VRD Tunisie' },
  { id: 4, type: 'meeting', date: '2026-04-21', subject: 'Réunion coordination MEP', participants: 'ElecPro, HydroTech, ClimaPro, Direction' },
];

const demoActions = [
  { id: 1, desc: 'Fournir plan d\'exécution révisé zone B', assigned: 'BTP STAR', deadline: '2026-05-02', status: 'open' },
  { id: 2, desc: 'Soumettre fiches techniques gaz médicaux', assigned: 'ClimaPro', deadline: '2026-05-05', status: 'open' },
  { id: 3, desc: 'Valider échantillons carrelage hall principal', assigned: 'Direction', deadline: '2026-04-30', status: 'in_progress' },
  { id: 4, desc: 'Corriger NCR-002 résistance béton', assigned: 'BTP STAR', deadline: '2026-05-01', status: 'open' },
];

export default function CommunicationPage() {
  const { lang } = useLanguage();
  const typeLabel = (tp: string) => {
    const map: Record<string, Record<string, string>> = {
      fr: { meeting: 'Réunion', rfi: 'RFI', correspondence: 'Correspondance', minutes: 'PV' },
      en: { meeting: 'Meeting', rfi: 'RFI', correspondence: 'Correspondence', minutes: 'Minutes' },
    };
    return map[lang]?.[tp] || tp;
  };

  return (
    <div className="animate-in">
      <div className="page-header">
        <h1 className="page-title">{t('comm.title', lang)}</h1>
      </div>

      <div className="toolbar">
        <h2 style={{ fontSize: 18, fontWeight: 700 }}><MessageSquare size={18} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 6 }} />{t('comm.meetings', lang)}</h2>
        <button className="btn btn-primary btn-sm">+ {t('comm.add', lang)}</button>
      </div>
      <div className="data-table-wrapper">
        <table className="data-table">
          <thead><tr><th>Type</th><th>{t('common.date', lang)}</th><th>{lang === 'fr' ? 'Objet' : 'Subject'}</th><th>{lang === 'fr' ? 'Participants' : 'Participants'}</th></tr></thead>
          <tbody>
            {demoComms.map((c) => (
              <tr key={c.id}>
                <td>{typeLabel(c.type)}</td>
                <td style={{ color: 'var(--text-secondary)' }}>{c.date}</td>
                <td style={{ fontWeight: 600 }}>{c.subject}</td>
                <td style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{c.participants}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="toolbar" style={{ marginTop: 32 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700 }}><CheckCircle size={18} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 6 }} />{t('comm.actions', lang)}</h2>
      </div>
      <div className="data-table-wrapper">
        <table className="data-table">
          <thead><tr><th>{t('common.description', lang)}</th><th>{lang === 'fr' ? 'Assigné à' : 'Assigned to'}</th><th>Deadline</th><th>{t('common.status', lang)}</th></tr></thead>
          <tbody>
            {demoActions.map((a) => (
              <tr key={a.id}>
                <td style={{ fontWeight: 500 }}>{a.desc}</td>
                <td><span className="badge badge-info">{a.assigned}</span></td>
                <td style={{ color: new Date(a.deadline) < new Date() ? '#ef4444' : 'var(--text-secondary)', fontWeight: new Date(a.deadline) < new Date() ? 700 : 400 }}>{a.deadline}</td>
                <td><span className={`badge ${a.status === 'open' ? 'badge-warning' : 'badge-info'}`}>{t(`status.${a.status}`, lang)}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
