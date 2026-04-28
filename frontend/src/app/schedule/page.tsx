'use client';

import React, { useState } from 'react';
import { useLanguage } from '../layout';
import { t } from '@/lib/i18n';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { BarChart3, ClipboardList, Upload } from 'lucide-react';

const demoActivities = [
  { id: 1, name: 'Terrassement', lot: 'VRD', planned_start: '2026-01-15', planned_end: '2026-03-15', actual_start: '2026-01-20', actual_progress: 100, planned_progress: 100, status: 'completed' },
  { id: 2, name: 'Fondations profondes', lot: 'Gros Œuvre', planned_start: '2026-02-01', planned_end: '2026-05-01', actual_start: '2026-02-10', actual_progress: 85, planned_progress: 95, status: 'delayed' },
  { id: 3, name: 'Infrastructure béton RDC', lot: 'Gros Œuvre', planned_start: '2026-04-01', planned_end: '2026-07-01', actual_start: '2026-04-15', actual_progress: 35, planned_progress: 45, status: 'in_progress' },
  { id: 4, name: 'Réseau assainissement', lot: 'VRD', planned_start: '2026-03-01', planned_end: '2026-05-15', actual_start: '2026-03-10', actual_progress: 60, planned_progress: 70, status: 'in_progress' },
  { id: 5, name: 'Superstructure 1er étage', lot: 'Gros Œuvre', planned_start: '2026-06-01', planned_end: '2026-09-01', actual_progress: 0, planned_progress: 0, status: 'not_started' },
  { id: 6, name: 'Chemin de câble principal', lot: 'Électricité', planned_start: '2026-07-01', planned_end: '2026-10-01', actual_progress: 0, planned_progress: 0, status: 'not_started' },
];

export default function SchedulePage() {
  const { lang } = useLanguage();
  const [showModal, setShowModal] = useState(false);

  const getStatusBadge = (status: string) => {
    const map: Record<string, string> = { completed: 'badge-success', in_progress: 'badge-info', delayed: 'badge-danger', not_started: 'badge-neutral' };
    return map[status] || 'badge-neutral';
  };

  const ganttData = demoActivities.map(a => ({
    name: a.name,
    planned: a.planned_progress,
    actual: a.actual_progress,
  }));

  return (
    <div className="animate-in">
      <div className="page-header">
        <h1 className="page-title">{t('schedule.title', lang)}</h1>
      </div>

      {/* Gantt-style bar chart */}
      <div className="chart-card" style={{ marginBottom: 24 }}>
        <div className="chart-title"><BarChart3 size={18} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 6 }} />{t('schedule.gantt', lang)} — {t('schedule.progress', lang)}</div>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={ganttData} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis type="number" domain={[0, 100]} stroke="#5c6478" fontSize={11} unit="%" />
            <YAxis type="category" dataKey="name" stroke="#5c6478" fontSize={11} width={160} />
            <Tooltip contentStyle={{ background: '#1a2236', border: '1px solid #334155', borderRadius: 8, color: '#f0f4fc' }} />
            <Bar dataKey="planned" name={t('common.planned', lang)} fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={14} />
            <Bar dataKey="actual" name={t('common.actual', lang)} fill="#10b981" radius={[0, 4, 4, 0]} barSize={14} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Activities Table */}
      <div className="toolbar">
        <h2 style={{ fontSize: 18, fontWeight: 700 }}><ClipboardList size={18} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 6 }} />{t('schedule.activities', lang)}</h2>
        <div className="toolbar-right">
          <button className="btn btn-secondary btn-sm"><Upload size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 4 }} />{lang === 'fr' ? 'Importer CSV' : 'Import CSV'}</button>
          <button className="btn btn-primary btn-sm" onClick={() => setShowModal(true)}>+ {t('schedule.addActivity', lang)}</button>
        </div>
      </div>
      <div className="data-table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              <th>{t('common.name', lang)}</th>
              <th>Lot</th>
              <th>{lang === 'fr' ? 'Début Planifié' : 'Planned Start'}</th>
              <th>{lang === 'fr' ? 'Fin Planifiée' : 'Planned End'}</th>
              <th>{t('common.planned', lang)} %</th>
              <th>{t('common.actual', lang)} %</th>
              <th>{lang === 'fr' ? 'Écart' : 'Variance'}</th>
              <th>{t('common.status', lang)}</th>
            </tr>
          </thead>
          <tbody>
            {demoActivities.map((a) => (
              <tr key={a.id}>
                <td style={{ fontWeight: 600 }}>{a.name}</td>
                <td><span className="badge badge-info">{a.lot}</span></td>
                <td style={{ color: 'var(--text-secondary)', fontSize: 13 }}>{a.planned_start}</td>
                <td style={{ color: 'var(--text-secondary)', fontSize: 13 }}>{a.planned_end}</td>
                <td>{a.planned_progress}%</td>
                <td style={{ fontWeight: 600 }}>{a.actual_progress}%</td>
                <td style={{ color: a.actual_progress >= a.planned_progress ? '#10b981' : '#ef4444', fontWeight: 600 }}>
                  {a.actual_progress - a.planned_progress >= 0 ? '+' : ''}{a.actual_progress - a.planned_progress}%
                </td>
                <td><span className={`badge ${getStatusBadge(a.status)}`}>{t(`status.${a.status}`, lang)}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">{t('schedule.addActivity', lang)}</h3>
              <button className="modal-close" onClick={() => setShowModal(false)}>✕</button>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">{t('common.name', lang)}</label>
                <input className="form-input" placeholder="Nom de l'activité" />
              </div>
              <div className="form-group">
                <label className="form-label">Lot</label>
                <select className="form-select"><option>Gros Œuvre</option><option>VRD</option><option>Électricité</option></select>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">{lang === 'fr' ? 'Date début' : 'Start date'}</label>
                <input className="form-input" type="date" />
              </div>
              <div className="form-group">
                <label className="form-label">{lang === 'fr' ? 'Date fin' : 'End date'}</label>
                <input className="form-input" type="date" />
              </div>
            </div>
            <div className="modal-actions">
              <button className="btn btn-secondary" onClick={() => setShowModal(false)}>{t('common.cancel', lang)}</button>
              <button className="btn btn-primary">{t('common.save', lang)}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
