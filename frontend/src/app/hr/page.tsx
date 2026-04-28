'use client';

import React from 'react';
import { useLanguage } from '../layout';
import { t } from '@/lib/i18n';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const demoPersonnel = [
  { id: 1, name: 'Ahmed Ben Salem', role: 'engineer', company: 'BTP STAR', lot: 'Gros Œuvre' },
  { id: 2, name: 'Mehdi Khelifi', role: 'technician', company: 'ElecPro', lot: 'Électricité' },
  { id: 3, name: 'Sami Trabelsi', role: 'engineer', company: 'Supervision', lot: '-' },
  { id: 4, name: 'Karim Bouazizi', role: 'worker', company: 'VRD Tunisie', lot: 'VRD' },
  { id: 5, name: 'Youssef Mansour', role: 'director', company: 'Direction', lot: 'Tous' },
];

const demoAttendance = [
  { date: 'Lun', btp: 85, vrd: 32, elec: 15, plomb: 12, cvc: 8 },
  { date: 'Mar', btp: 90, vrd: 35, elec: 18, plomb: 14, cvc: 10 },
  { date: 'Mer', btp: 88, vrd: 30, elec: 16, plomb: 13, cvc: 9 },
  { date: 'Jeu', btp: 92, vrd: 33, elec: 20, plomb: 15, cvc: 11 },
  { date: 'Ven', btp: 78, vrd: 28, elec: 14, plomb: 10, cvc: 7 },
  { date: 'Sam', btp: 45, vrd: 15, elec: 8, plomb: 6, cvc: 4 },
];

export default function HRPage() {
  const { lang } = useLanguage();
  const roleLabel = (r: string) => {
    const map: Record<string, Record<string, string>> = {
      fr: { director: 'Directeur', engineer: 'Ingénieur', technician: 'Technicien', worker: 'Ouvrier' },
      en: { director: 'Director', engineer: 'Engineer', technician: 'Technician', worker: 'Worker' },
    };
    return map[lang]?.[r] || r;
  };

  return (
    <div className="animate-in">
      <div className="page-header">
        <h1 className="page-title">{t('hr.title', lang)}</h1>
      </div>

      {/* Attendance Chart */}
      <div className="chart-card" style={{ marginBottom: 24 }}>
        <div className="chart-title">👷 {t('hr.attendance', lang)} — {lang === 'fr' ? 'Cette semaine' : 'This week'}</div>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={demoAttendance}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis dataKey="date" stroke="#5c6478" fontSize={12} />
            <YAxis stroke="#5c6478" fontSize={12} />
            <Tooltip contentStyle={{ background: '#1a2236', border: '1px solid #334155', borderRadius: 8, color: '#f0f4fc' }} />
            <Legend />
            <Bar dataKey="btp" name="BTP STAR" fill="#3b82f6" stackId="a" />
            <Bar dataKey="vrd" name="VRD" fill="#10b981" stackId="a" />
            <Bar dataKey="elec" name="Électricité" fill="#f59e0b" stackId="a" />
            <Bar dataKey="plomb" name="Plomberie" fill="#8b5cf6" stackId="a" />
            <Bar dataKey="cvc" name="CVC" fill="#06b6d4" stackId="a" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Personnel Table */}
      <div className="toolbar">
        <h2 style={{ fontSize: 18, fontWeight: 700 }}>{t('hr.personnel', lang)}</h2>
        <button className="btn btn-primary btn-sm">+ {t('hr.addPersonnel', lang)}</button>
      </div>
      <div className="data-table-wrapper">
        <table className="data-table">
          <thead><tr><th>{t('common.name', lang)}</th><th>{lang === 'fr' ? 'Rôle' : 'Role'}</th><th>{lang === 'fr' ? 'Entreprise' : 'Company'}</th><th>Lot</th></tr></thead>
          <tbody>
            {demoPersonnel.map((p) => (
              <tr key={p.id}>
                <td style={{ fontWeight: 600 }}>{p.name}</td>
                <td><span className="badge badge-info">{roleLabel(p.role)}</span></td>
                <td>{p.company}</td>
                <td>{p.lot}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
