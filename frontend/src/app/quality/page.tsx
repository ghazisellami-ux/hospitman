'use client';

import React, { useState } from 'react';
import { useLanguage } from '../layout';
import { t } from '@/lib/i18n';
import { Search, ShieldAlert, X } from 'lucide-react';

interface Inspection {
  id: number;
  type: string;
  lot: string;
  date: string;
  inspector: string;
  result: string;
}

interface NCR {
  id: string;
  description: string;
  severity: string;
  lot: string;
  deadline: string;
  status: string;
}

const initialInspections: Inspection[] = [
  { id: 1, type: 'Béton', lot: 'Gros Œuvre', date: '2026-04-25', inspector: 'Ing. Trabelsi', result: 'conforming' },
  { id: 2, type: 'Acier', lot: 'Gros Œuvre', date: '2026-04-24', inspector: 'Ing. Trabelsi', result: 'conforming' },
  { id: 3, type: 'Étanchéité', lot: 'Étanchéité', date: '2026-04-22', inspector: 'Lab. CTTP', result: 'non_conforming' },
  { id: 4, type: 'Compactage', lot: 'VRD', date: '2026-04-20', inspector: 'Lab. Géotech', result: 'conforming' },
  { id: 5, type: 'Soudure', lot: 'Plomberie', date: '2026-04-18', inspector: 'Ing. Ben Ali', result: 'pending' },
];

const initialNCRs: NCR[] = [
  { id: 'NCR-001', description: 'Défaut étanchéité toiture zone B', severity: 'major', lot: 'Étanchéité', deadline: '2026-05-10', status: 'open' },
  { id: 'NCR-002', description: 'Résistance béton insuffisante pieu P12', severity: 'critical', lot: 'Gros Œuvre', deadline: '2026-05-01', status: 'in_progress' },
  { id: 'NCR-003', description: 'Alignement canalisation non conforme', severity: 'minor', lot: 'VRD', deadline: '2026-05-15', status: 'open' },
];

const lots = ['Gros Œuvre', 'VRD', 'Étanchéité', 'Plomberie', 'Électricité', 'CVC'];

export default function QualityPage() {
  const { lang } = useLanguage();
  const [inspections, setInspections] = useState<Inspection[]>(initialInspections);
  const [ncrs, setNCRs] = useState<NCR[]>(initialNCRs);

  // Inspection modal
  const [showInspModal, setShowInspModal] = useState(false);
  const [inspForm, setInspForm] = useState({ type: '', lot: lots[0], date: '', inspector: '', result: 'pending' });

  // NCR modal
  const [showNCRModal, setShowNCRModal] = useState(false);
  const [ncrForm, setNCRForm] = useState({ description: '', severity: 'minor', lot: lots[0], deadline: '', status: 'open' });

  const resultBadge = (r: string) => r === 'conforming' ? 'badge-success' : r === 'non_conforming' ? 'badge-danger' : 'badge-warning';
  const severityBadge = (s: string) => s === 'critical' ? 'badge-danger' : s === 'major' ? 'badge-warning' : 'badge-info';

  const handleAddInspection = () => {
    if (!inspForm.type.trim() || !inspForm.date || !inspForm.inspector.trim()) return;
    const newInsp: Inspection = {
      id: inspections.length + 1,
      type: inspForm.type,
      lot: inspForm.lot,
      date: inspForm.date,
      inspector: inspForm.inspector,
      result: inspForm.result,
    };
    setInspections([...inspections, newInsp]);
    setShowInspModal(false);
    setInspForm({ type: '', lot: lots[0], date: '', inspector: '', result: 'pending' });
  };

  const handleAddNCR = () => {
    if (!ncrForm.description.trim() || !ncrForm.deadline) return;
    const newNCR: NCR = {
      id: `NCR-${String(ncrs.length + 1).padStart(3, '0')}`,
      description: ncrForm.description,
      severity: ncrForm.severity,
      lot: ncrForm.lot,
      deadline: ncrForm.deadline,
      status: ncrForm.status,
    };
    setNCRs([...ncrs, newNCR]);
    setShowNCRModal(false);
    setNCRForm({ description: '', severity: 'minor', lot: lots[0], deadline: '', status: 'open' });
  };

  const conforming = inspections.filter(i => i.result === 'conforming').length;
  const nonConforming = inspections.filter(i => i.result === 'non_conforming').length;
  const openNCRs = ncrs.filter(n => n.status === 'open' || n.status === 'in_progress').length;

  return (
    <div className="animate-in">
      <div className="page-header">
        <h1 className="page-title">{t('quality.title', lang)}</h1>
      </div>

      {/* Summary KPIs */}
      <div className="kpi-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', marginBottom: 24 }}>
        <div className="kpi-card success"><div className="kpi-label">{lang === 'fr' ? 'Conformes' : 'Conforming'}</div><div className="kpi-value" style={{ fontSize: 28, color: '#10b981' }}>{conforming}</div></div>
        <div className="kpi-card danger"><div className="kpi-label">{lang === 'fr' ? 'Non Conformes' : 'Non-Conforming'}</div><div className="kpi-value" style={{ fontSize: 28, color: '#ef4444' }}>{nonConforming}</div></div>
        <div className="kpi-card warning"><div className="kpi-label">{lang === 'fr' ? 'NCR Ouvertes' : 'Open NCRs'}</div><div className="kpi-value" style={{ fontSize: 28, color: '#f59e0b' }}>{openNCRs}</div></div>
        <div className="kpi-card info"><div className="kpi-label">{lang === 'fr' ? 'Total inspections' : 'Total inspections'}</div><div className="kpi-value" style={{ fontSize: 28 }}>{inspections.length}</div></div>
      </div>

      {/* Inspections */}
      <div className="toolbar">
        <h2 style={{ fontSize: 18, fontWeight: 700 }}><Search size={18} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 6 }} />{t('quality.inspections', lang)}</h2>
        <button className="btn btn-primary btn-sm" onClick={() => setShowInspModal(true)}>+ {t('quality.addInspection', lang)}</button>
      </div>
      <div className="data-table-wrapper">
        <table className="data-table">
          <thead><tr><th>Type</th><th>Lot</th><th>{t('common.date', lang)}</th><th>{lang === 'fr' ? 'Inspecteur' : 'Inspector'}</th><th>{lang === 'fr' ? 'Résultat' : 'Result'}</th></tr></thead>
          <tbody>
            {inspections.map((i) => (
              <tr key={i.id}>
                <td style={{ fontWeight: 600 }}>{i.type}</td>
                <td>{i.lot}</td>
                <td style={{ color: 'var(--text-secondary)' }}>{i.date}</td>
                <td>{i.inspector}</td>
                <td><span className={`badge ${resultBadge(i.result)}`}>{t(`status.${i.result}`, lang)}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* NCRs */}
      <div className="toolbar" style={{ marginTop: 32 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700 }}><ShieldAlert size={18} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 6 }} />{t('quality.ncrs', lang)}</h2>
        <button className="btn btn-danger btn-sm" onClick={() => setShowNCRModal(true)}>+ {t('quality.addNCR', lang)}</button>
      </div>
      <div className="data-table-wrapper">
        <table className="data-table">
          <thead><tr><th>N°</th><th>{t('common.description', lang)}</th><th>{lang === 'fr' ? 'Sévérité' : 'Severity'}</th><th>Lot</th><th>Deadline</th><th>{t('common.status', lang)}</th></tr></thead>
          <tbody>
            {ncrs.map((n) => (
              <tr key={n.id}>
                <td style={{ fontWeight: 600, color: '#ef4444' }}>{n.id}</td>
                <td>{n.description}</td>
                <td><span className={`badge ${severityBadge(n.severity)}`}>{n.severity.toUpperCase()}</span></td>
                <td>{n.lot}</td>
                <td style={{ color: 'var(--text-secondary)' }}>{n.deadline}</td>
                <td><span className={`badge ${n.status === 'open' ? 'badge-warning' : 'badge-info'}`}>{t(`status.${n.status}`, lang)}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Inspection Modal */}
      {showInspModal && (
        <div className="modal-overlay" onClick={() => setShowInspModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">{lang === 'fr' ? 'Nouvelle Inspection' : 'New Inspection'}</h3>
              <button className="modal-close" onClick={() => setShowInspModal(false)}><X size={20} /></button>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">{lang === 'fr' ? 'Type d\'inspection' : 'Inspection Type'}</label>
                <input className="form-input" placeholder={lang === 'fr' ? 'Ex: Béton, Acier...' : 'Ex: Concrete, Steel...'} value={inspForm.type} onChange={(e) => setInspForm({ ...inspForm, type: e.target.value })} />
              </div>
              <div className="form-group">
                <label className="form-label">Lot</label>
                <select className="form-select" value={inspForm.lot} onChange={(e) => setInspForm({ ...inspForm, lot: e.target.value })}>
                  {lots.map(l => <option key={l} value={l}>{l}</option>)}
                </select>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">{t('common.date', lang)}</label>
                <input className="form-input" type="date" value={inspForm.date} onChange={(e) => setInspForm({ ...inspForm, date: e.target.value })} />
              </div>
              <div className="form-group">
                <label className="form-label">{lang === 'fr' ? 'Inspecteur' : 'Inspector'}</label>
                <input className="form-input" placeholder={lang === 'fr' ? 'Nom de l\'inspecteur' : 'Inspector name'} value={inspForm.inspector} onChange={(e) => setInspForm({ ...inspForm, inspector: e.target.value })} />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">{lang === 'fr' ? 'Résultat' : 'Result'}</label>
              <select className="form-select" value={inspForm.result} onChange={(e) => setInspForm({ ...inspForm, result: e.target.value })}>
                <option value="pending">{lang === 'fr' ? 'En attente' : 'Pending'}</option>
                <option value="conforming">{lang === 'fr' ? 'Conforme' : 'Conforming'}</option>
                <option value="non_conforming">{lang === 'fr' ? 'Non conforme' : 'Non-conforming'}</option>
              </select>
            </div>
            <div className="modal-actions">
              <button className="btn btn-secondary" onClick={() => setShowInspModal(false)}>{lang === 'fr' ? 'Annuler' : 'Cancel'}</button>
              <button className="btn btn-primary" onClick={handleAddInspection}>{lang === 'fr' ? 'Ajouter' : 'Add'}</button>
            </div>
          </div>
        </div>
      )}

      {/* NCR Modal */}
      {showNCRModal && (
        <div className="modal-overlay" onClick={() => setShowNCRModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">{lang === 'fr' ? 'Nouvelle NCR' : 'New NCR'}</h3>
              <button className="modal-close" onClick={() => setShowNCRModal(false)}><X size={20} /></button>
            </div>
            <div className="form-group">
              <label className="form-label">{t('common.description', lang)}</label>
              <textarea className="form-textarea" placeholder={lang === 'fr' ? 'Décrivez la non-conformité...' : 'Describe the non-conformity...'} value={ncrForm.description} onChange={(e) => setNCRForm({ ...ncrForm, description: e.target.value })} />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">{lang === 'fr' ? 'Sévérité' : 'Severity'}</label>
                <select className="form-select" value={ncrForm.severity} onChange={(e) => setNCRForm({ ...ncrForm, severity: e.target.value })}>
                  <option value="minor">{lang === 'fr' ? 'Mineur' : 'Minor'}</option>
                  <option value="major">{lang === 'fr' ? 'Majeur' : 'Major'}</option>
                  <option value="critical">{lang === 'fr' ? 'Critique' : 'Critical'}</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Lot</label>
                <select className="form-select" value={ncrForm.lot} onChange={(e) => setNCRForm({ ...ncrForm, lot: e.target.value })}>
                  {lots.map(l => <option key={l} value={l}>{l}</option>)}
                </select>
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Deadline</label>
              <input className="form-input" type="date" value={ncrForm.deadline} onChange={(e) => setNCRForm({ ...ncrForm, deadline: e.target.value })} />
            </div>
            <div className="modal-actions">
              <button className="btn btn-secondary" onClick={() => setShowNCRModal(false)}>{lang === 'fr' ? 'Annuler' : 'Cancel'}</button>
              <button className="btn btn-danger" onClick={handleAddNCR}>{lang === 'fr' ? 'Créer NCR' : 'Create NCR'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
