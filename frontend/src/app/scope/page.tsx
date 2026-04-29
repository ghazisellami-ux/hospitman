'use client';

import React, { useState } from 'react';
import { useLanguage } from '../layout';
import { t } from '@/lib/i18n';
import { scopeLots, scopeCRs, lotNames, type Language } from '@/lib/demoData';
import { useProjectSettings } from '@/lib/useProjectSettings';
import { Target, FileEdit, X } from 'lucide-react';

interface CRItem {
  id: number;
  title: string;
  cost_impact: number;
  schedule_impact_days: number;
  status: string;
}

export default function ScopePage() {
  const { lang } = useLanguage();
  const l = lang as Language;
  const { currency } = useProjectSettings();
  const [showLotModal, setShowLotModal] = useState(false);
  const [showCRModal, setShowCRModal] = useState(false);

  // CR state with bilingual initial data
  const [crs, setCRs] = useState<CRItem[]>([]);
  const [crsMounted, setCRsMounted] = useState(false);

  // Build translated CRs reactively from lang
  const displayCRs: CRItem[] = crsMounted ? crs : scopeCRs.map(cr => ({
    id: cr.id,
    title: cr[`title_${l}`],
    cost_impact: cr.cost_impact,
    schedule_impact_days: cr.schedule_impact_days,
    status: cr.status,
  }));

  // CR form
  const [crForm, setCRForm] = useState({ title: '', cost_impact: 0, schedule_impact_days: 0 });

  const handleAddCR = () => {
    if (!crForm.title.trim()) return;
    const newCR: CRItem = {
      id: (crsMounted ? crs : displayCRs).length + 1,
      title: crForm.title,
      cost_impact: crForm.cost_impact,
      schedule_impact_days: crForm.schedule_impact_days,
      status: 'pending',
    };
    if (!crsMounted) {
      setCRs([...displayCRs, newCR]);
      setCRsMounted(true);
    } else {
      setCRs([...crs, newCR]);
    }
    setShowCRModal(false);
    setCRForm({ title: '', cost_impact: 0, schedule_impact_days: 0 });
  };

  const getStatusBadge = (status: string) => {
    const map: Record<string, string> = {
      in_progress: 'badge-info', planned: 'badge-neutral', completed: 'badge-success',
      not_started: 'badge-neutral', pending: 'badge-warning', approved: 'badge-success', rejected: 'badge-danger',
    };
    return map[status] || 'badge-neutral';
  };

  return (
    <div className="animate-in">
      <div className="page-header">
        <h1 className="page-title">{t('scope.title', lang)}</h1>
      </div>

      {/* Lots Table */}
      <div className="toolbar">
        <h2 style={{ fontSize: 18, fontWeight: 700 }}><Target size={18} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 6 }} />{t('scope.lots', lang)}</h2>
        <button className="btn btn-primary btn-sm" onClick={() => setShowLotModal(true)}>+ {t('scope.addLot', lang)}</button>
      </div>
      <div className="data-table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              <th>#</th>
              <th>{t('common.name', lang)}</th>
              <th>{t('common.description', lang)}</th>
              <th>{l === 'fr' ? 'Entrepreneur' : 'Contractor'}</th>
              <th>{t('common.status', lang)}</th>
            </tr>
          </thead>
          <tbody>
            {scopeLots.map((lot) => (
              <tr key={lot.id}>
                <td style={{ color: 'var(--text-muted)' }}>{lot.id}</td>
                <td style={{ fontWeight: 600 }}>{lot[`name_${l}`]}</td>
                <td style={{ color: 'var(--text-secondary)' }}>{lot[`desc_${l}`]}</td>
                <td>{lot.contractor}</td>
                <td><span className={`badge ${getStatusBadge(lot.status)}`}>{t(`status.${lot.status}`, lang)}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Change Requests */}
      <div className="toolbar" style={{ marginTop: 32 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700 }}><FileEdit size={18} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 6 }} />{t('scope.changeRequests', lang)}</h2>
        <button className="btn btn-secondary btn-sm" onClick={() => setShowCRModal(true)}>+ {l === 'fr' ? 'Nouvelle demande' : 'New request'}</button>
      </div>
      <div className="data-table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              <th>#</th>
              <th>{l === 'fr' ? 'Titre' : 'Title'}</th>
              <th>{l === 'fr' ? 'Impact Coût' : 'Cost Impact'}</th>
              <th>{l === 'fr' ? 'Impact Délai' : 'Schedule Impact'}</th>
              <th>{t('common.status', lang)}</th>
            </tr>
          </thead>
          <tbody>
            {displayCRs.map((cr) => (
              <tr key={cr.id}>
                <td style={{ color: 'var(--text-muted)' }}>CR-{cr.id}</td>
                <td style={{ fontWeight: 600 }}>{cr.title}</td>
                <td style={{ color: '#f59e0b' }}>+{cr.cost_impact.toLocaleString()} {currency}</td>
                <td style={{ color: '#ef4444' }}>+{cr.schedule_impact_days}{l === 'fr' ? 'j' : 'd'}</td>
                <td><span className={`badge ${getStatusBadge(cr.status)}`}>{t(`status.${cr.status}`, lang)}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Lot Modal */}
      {showLotModal && (
        <div className="modal-overlay" onClick={() => setShowLotModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">{t('scope.addLot', lang)}</h3>
              <button className="modal-close" onClick={() => setShowLotModal(false)}><X size={20} /></button>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">{t('common.name', lang)}</label>
                <input className="form-input" placeholder={l === 'fr' ? 'Ex: Gros Œuvre' : 'Ex: Structural Work'} />
              </div>
              <div className="form-group">
                <label className="form-label">{l === 'fr' ? 'Entrepreneur' : 'Contractor'}</label>
                <select className="form-select">
                  <option>{l === 'fr' ? '-- Sélectionner --' : '-- Select --'}</option>
                  <option>BTP STAR</option>
                  <option>ElecPro</option>
                </select>
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">{t('common.description', lang)}</label>
              <textarea className="form-textarea" placeholder={l === 'fr' ? 'Description du lot...' : 'Lot description...'} />
            </div>
            <div className="modal-actions">
              <button className="btn btn-secondary" onClick={() => setShowLotModal(false)}>{t('common.cancel', lang)}</button>
              <button className="btn btn-primary">{t('common.save', lang)}</button>
            </div>
          </div>
        </div>
      )}

      {/* Add Change Request Modal */}
      {showCRModal && (
        <div className="modal-overlay" onClick={() => setShowCRModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">{l === 'fr' ? 'Nouvelle Demande de Modification' : 'New Change Request'}</h3>
              <button className="modal-close" onClick={() => setShowCRModal(false)}><X size={20} /></button>
            </div>
            <div className="form-group">
              <label className="form-label">{l === 'fr' ? 'Titre' : 'Title'}</label>
              <input className="form-input" placeholder={l === 'fr' ? 'Ex: Modification emplacement bloc opératoire' : 'Ex: Operating theater location change'} value={crForm.title} onChange={(e) => setCRForm({ ...crForm, title: e.target.value })} />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">{l === 'fr' ? 'Impact Coût' : 'Cost Impact'} ({currency})</label>
                <input className="form-input" type="number" placeholder="0" value={crForm.cost_impact || ''} onChange={(e) => setCRForm({ ...crForm, cost_impact: parseInt(e.target.value) || 0 })} />
              </div>
              <div className="form-group">
                <label className="form-label">{l === 'fr' ? 'Impact Délai (jours)' : 'Schedule Impact (days)'}</label>
                <input className="form-input" type="number" placeholder="0" value={crForm.schedule_impact_days || ''} onChange={(e) => setCRForm({ ...crForm, schedule_impact_days: parseInt(e.target.value) || 0 })} />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Lot</label>
              <select className="form-select">
                {lotNames[l].map(lot => <option key={lot}>{lot}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">{l === 'fr' ? 'Justification' : 'Justification'}</label>
              <textarea className="form-textarea" placeholder={l === 'fr' ? 'Expliquez la raison de cette demande...' : 'Explain the reason for this request...'} />
            </div>
            <div className="modal-actions">
              <button className="btn btn-secondary" onClick={() => setShowCRModal(false)}>{t('common.cancel', lang)}</button>
              <button className="btn btn-primary" onClick={handleAddCR}>{l === 'fr' ? 'Soumettre' : 'Submit'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
