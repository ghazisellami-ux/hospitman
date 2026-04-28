'use client';

import React, { useState } from 'react';
import { useLanguage } from '../layout';
import { t } from '@/lib/i18n';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Users } from 'lucide-react';

interface PersonnelItem {
  id: number;
  name: string;
  role: string;
  company: string;
  lot_fr: string;
  lot_en: string;
  phone: string;
  email: string;
  start_date: string;
}

const initialPersonnel: PersonnelItem[] = [
  { id: 1, name: 'Ahmed Ben Salem', role: 'engineer', company: 'BTP STAR', lot_fr: 'Gros Œuvre', lot_en: 'Structural Work', phone: '+216 98 123 456', email: 'ahmed@btpstar.tn', start_date: '2026-01-15' },
  { id: 2, name: 'Mehdi Khelifi', role: 'technician', company: 'ElecPro', lot_fr: 'Électricité', lot_en: 'Electrical', phone: '+216 97 654 321', email: 'mehdi@elecpro.tn', start_date: '2026-03-01' },
  { id: 3, name: 'Sami Trabelsi', role: 'engineer', company: 'Supervision', lot_fr: 'Tous les lots', lot_en: 'All lots', phone: '+216 95 111 222', email: 'sami@supervision.tn', start_date: '2026-01-10' },
  { id: 4, name: 'Karim Bouazizi', role: 'worker', company: 'VRD Tunisie', lot_fr: 'VRD', lot_en: 'Roads & Utilities', phone: '+216 96 333 444', email: '', start_date: '2026-02-01' },
  { id: 5, name: 'Youssef Mansour', role: 'director', company: 'Direction', lot_fr: 'Tous les lots', lot_en: 'All lots', phone: '+216 98 555 666', email: 'youssef@hospitman.tn', start_date: '2026-01-05' },
];

const demoAttendanceFr = [
  { date: 'Lun', btp: 85, vrd: 32, elec: 15, plomb: 12, cvc: 8 },
  { date: 'Mar', btp: 90, vrd: 35, elec: 18, plomb: 14, cvc: 10 },
  { date: 'Mer', btp: 88, vrd: 30, elec: 16, plomb: 13, cvc: 9 },
  { date: 'Jeu', btp: 92, vrd: 33, elec: 20, plomb: 15, cvc: 11 },
  { date: 'Ven', btp: 78, vrd: 28, elec: 14, plomb: 10, cvc: 7 },
  { date: 'Sam', btp: 45, vrd: 15, elec: 8, plomb: 6, cvc: 4 },
];

const demoAttendanceEn = [
  { date: 'Mon', btp: 85, vrd: 32, elec: 15, plomb: 12, cvc: 8 },
  { date: 'Tue', btp: 90, vrd: 35, elec: 18, plomb: 14, cvc: 10 },
  { date: 'Wed', btp: 88, vrd: 30, elec: 16, plomb: 13, cvc: 9 },
  { date: 'Thu', btp: 92, vrd: 33, elec: 20, plomb: 15, cvc: 11 },
  { date: 'Fri', btp: 78, vrd: 28, elec: 14, plomb: 10, cvc: 7 },
  { date: 'Sat', btp: 45, vrd: 15, elec: 8, plomb: 6, cvc: 4 },
];

const roles: Record<string, Record<string, string>> = {
  fr: { director: 'Directeur', engineer: 'Ingénieur', technician: 'Technicien', worker: 'Ouvrier', supervisor: 'Superviseur' },
  en: { director: 'Director', engineer: 'Engineer', technician: 'Technician', worker: 'Worker', supervisor: 'Supervisor' },
};

const lotsOptions = [
  { fr: 'Gros Œuvre', en: 'Structural Work' },
  { fr: 'VRD', en: 'Roads & Utilities' },
  { fr: 'Électricité', en: 'Electrical' },
  { fr: 'Plomberie', en: 'Plumbing' },
  { fr: 'CVC', en: 'HVAC' },
  { fr: 'Menuiserie', en: 'Carpentry' },
  { fr: 'Étanchéité', en: 'Waterproofing' },
  { fr: 'Tous les lots', en: 'All lots' },
];

const companyLabels: Record<string, Record<string, string>> = {
  'Supervision': { fr: 'Supervision', en: 'Supervision' },
  'Direction': { fr: 'Direction', en: 'Management' },
};

const chartLegend: Record<string, Record<string, string>> = {
  elec: { fr: 'Électricité', en: 'Electrical' },
  plomb: { fr: 'Plomberie', en: 'Plumbing' },
};

export default function HRPage() {
  const { lang } = useLanguage();
  const [personnel, setPersonnel] = useState<PersonnelItem[]>(initialPersonnel);
  const [showModal, setShowModal] = useState(false);
  const [mounted, setMounted] = useState(false);
  React.useEffect(() => { setMounted(true); }, []);
  const [formData, setFormData] = useState({
    name: '',
    role: 'engineer',
    company: '',
    lot_index: 0,
    phone: '',
    email: '',
    start_date: '',
  });

  const roleLabel = (r: string) => roles[lang]?.[r] || r;
  const lotLabel = (p: PersonnelItem) => lang === 'en' ? p.lot_en : p.lot_fr;
  const companyLabel = (c: string) => companyLabels[c]?.[lang] || c;

  const demoAttendance = lang === 'en' ? demoAttendanceEn : demoAttendanceFr;

  const handleAdd = () => {
    setFormData({ name: '', role: 'engineer', company: '', lot_index: 0, phone: '', email: '', start_date: '' });
    setShowModal(true);
  };

  const handleSubmit = () => {
    if (!formData.name.trim()) return;
    const lot = lotsOptions[formData.lot_index];
    const newPerson: PersonnelItem = {
      id: Date.now(),
      name: formData.name,
      role: formData.role,
      company: formData.company,
      lot_fr: lot.fr,
      lot_en: lot.en,
      phone: formData.phone,
      email: formData.email,
      start_date: formData.start_date,
    };
    setPersonnel((prev) => [...prev, newPerson]);
    setShowModal(false);
  };

  const handleDelete = (id: number) => {
    setPersonnel((prev) => prev.filter((p) => p.id !== id));
  };

  // Summary KPIs
  const totalPersonnel = personnel.length;
  const totalByRole = (r: string) => personnel.filter((p) => p.role === r).length;

  return (
    <div className="animate-in">
      <div className="page-header">
        <h1 className="page-title">{t('hr.title', lang)}</h1>
      </div>

      {/* Summary KPIs */}
      <div className="kpi-grid" style={{ gridTemplateColumns: 'repeat(5, 1fr)', marginBottom: 24 }}>
        <div className="kpi-card info">
          <div className="kpi-label">{lang === 'fr' ? 'Total Personnel' : 'Total Personnel'}</div>
          <div className="kpi-value" style={{ fontSize: 28 }}>{totalPersonnel}</div>
        </div>
        <div className="kpi-card purple">
          <div className="kpi-label">{roleLabel('director')}s</div>
          <div className="kpi-value" style={{ fontSize: 28 }}>{totalByRole('director')}</div>
        </div>
        <div className="kpi-card success">
          <div className="kpi-label">{roleLabel('engineer')}s</div>
          <div className="kpi-value" style={{ fontSize: 28 }}>{totalByRole('engineer')}</div>
        </div>
        <div className="kpi-card warning">
          <div className="kpi-label">{roleLabel('technician')}s</div>
          <div className="kpi-value" style={{ fontSize: 28 }}>{totalByRole('technician')}</div>
        </div>
        <div className="kpi-card danger">
          <div className="kpi-label">{roleLabel('worker')}s</div>
          <div className="kpi-value" style={{ fontSize: 28 }}>{totalByRole('worker')}</div>
        </div>
      </div>

      {/* Attendance Chart */}
      {mounted && (
      <div className="chart-card" style={{ marginBottom: 24 }}>
        <div className="chart-title"><Users size={18} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 6 }} />{t('hr.attendance', lang)} — {lang === 'fr' ? 'Cette semaine' : 'This week'}</div>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={demoAttendance}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis dataKey="date" stroke="#5c6478" fontSize={12} />
            <YAxis stroke="#5c6478" fontSize={12} />
            <Tooltip contentStyle={{ background: '#1a2236', border: '1px solid #334155', borderRadius: 8, color: '#f0f4fc' }} />
            <Legend />
            <Bar dataKey="btp" name="BTP STAR" fill="#3b82f6" stackId="a" />
            <Bar dataKey="vrd" name="VRD" fill="#10b981" stackId="a" />
            <Bar dataKey="elec" name={chartLegend.elec[lang]} fill="#f59e0b" stackId="a" />
            <Bar dataKey="plomb" name={chartLegend.plomb[lang]} fill="#8b5cf6" stackId="a" />
            <Bar dataKey="cvc" name={lang === 'fr' ? 'CVC' : 'HVAC'} fill="#06b6d4" stackId="a" />
          </BarChart>
        </ResponsiveContainer>
      </div>
      )}

      {/* Personnel Table */}
      <div className="toolbar">
        <h2 style={{ fontSize: 18, fontWeight: 700 }}>{t('hr.personnel', lang)}</h2>
        <button className="btn btn-primary btn-sm" onClick={handleAdd}>+ {t('hr.addPersonnel', lang)}</button>
      </div>
      <div className="data-table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              <th>{t('common.name', lang)}</th>
              <th>{lang === 'fr' ? 'Rôle' : 'Role'}</th>
              <th>{lang === 'fr' ? 'Entreprise' : 'Company'}</th>
              <th>Lot</th>
              <th>{lang === 'fr' ? 'Téléphone' : 'Phone'}</th>
              <th>{lang === 'fr' ? 'Date d\'arrivée' : 'Start Date'}</th>
              <th>{t('common.actions', lang)}</th>
            </tr>
          </thead>
          <tbody>
            {personnel.map((p) => (
              <tr key={p.id}>
                <td style={{ fontWeight: 600 }}>{p.name}</td>
                <td><span className="badge badge-info">{roleLabel(p.role)}</span></td>
                <td>{companyLabel(p.company)}</td>
                <td>{lotLabel(p)}</td>
                <td style={{ color: 'var(--text-secondary)', fontSize: 13 }}>{p.phone || '—'}</td>
                <td style={{ color: 'var(--text-secondary)', fontSize: 13 }}>{p.start_date || '—'}</td>
                <td>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDelete(p.id)}
                    style={{ padding: '4px 8px', fontSize: 11 }}
                  >
                    {t('common.delete', lang)}
                  </button>
                </td>
              </tr>
            ))}
            {personnel.length === 0 && (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>
                  {t('common.noData', lang)}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add Personnel Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">{t('hr.addPersonnel', lang)}</h3>
              <button className="modal-close" onClick={() => setShowModal(false)}>✕</button>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">{lang === 'fr' ? 'Nom complet' : 'Full name'} *</label>
                <input
                  className="form-input"
                  placeholder={lang === 'fr' ? 'Ex: Mohamed Ali' : 'E.g. Mohamed Ali'}
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label className="form-label">{lang === 'fr' ? 'Rôle' : 'Role'} *</label>
                <select
                  className="form-select"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                >
                  {Object.entries(roles[lang]).map(([key, label]) => (
                    <option key={key} value={key}>{label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">{lang === 'fr' ? 'Entreprise' : 'Company'} *</label>
                <input
                  className="form-input"
                  placeholder={lang === 'fr' ? 'Ex: BTP STAR' : 'E.g. BTP STAR'}
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label className="form-label">{lang === 'fr' ? 'Lot assigné' : 'Assigned Lot'}</label>
                <select
                  className="form-select"
                  value={formData.lot_index}
                  onChange={(e) => setFormData({ ...formData, lot_index: parseInt(e.target.value) })}
                >
                  {lotsOptions.map((lot, i) => (
                    <option key={i} value={i}>{lang === 'en' ? lot.en : lot.fr}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">{lang === 'fr' ? 'Téléphone' : 'Phone'}</label>
                <input
                  className="form-input"
                  placeholder="+216 XX XXX XXX"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Email</label>
                <input
                  className="form-input"
                  type="email"
                  placeholder="email@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">{lang === 'fr' ? 'Date d\'arrivée' : 'Start date'}</label>
              <input
                className="form-input"
                type="date"
                value={formData.start_date}
                onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
              />
            </div>

            <div className="modal-actions">
              <button className="btn btn-secondary" onClick={() => setShowModal(false)}>{t('common.cancel', lang)}</button>
              <button className="btn btn-primary" onClick={handleSubmit}>{t('common.save', lang)}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
