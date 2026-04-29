'use client';

import React, { useState } from 'react';
import { useLanguage } from '../layout';
import { t } from '@/lib/i18n';
import { scopeLots, scopeCRs, lotNames, type Language } from '@/lib/demoData';
import { useProjectSettings } from '@/lib/useProjectSettings';
import { Target, FileEdit, X, Users, Plus, Building2 } from 'lucide-react';

// ── Types ──────────────────────────────────────────────────
interface Contractor { id: number; name: string; speciality_fr: string; speciality_en: string; contact: string; }
interface LotItem { id: number; name_fr: string; name_en: string; desc_fr: string; desc_en: string; contractor: string; status: string; }
interface CRItem { id: number; title: string; cost_impact: number; schedule_impact_days: number; status: string; }

// ── Demo contractors ───────────────────────────────────────
const demoContractors: Contractor[] = [
  { id: 1, name: 'BTP STAR', speciality_fr: 'Gros Œuvre / Structure', speciality_en: 'Structural Work', contact: 'contact@btpstar.tn' },
  { id: 2, name: 'VRD Tunisie', speciality_fr: 'Voirie et Réseaux', speciality_en: 'Roads & Utilities', contact: 'info@vrdtunisie.tn' },
  { id: 3, name: 'ElecPro', speciality_fr: 'Électricité', speciality_en: 'Electrical', contact: 'direction@elecpro.tn' },
  { id: 4, name: 'HydroTech', speciality_fr: 'Plomberie Sanitaire', speciality_en: 'Plumbing', contact: 'info@hydrotech.tn' },
  { id: 5, name: 'ClimaPro', speciality_fr: 'CVC / Climatisation', speciality_en: 'HVAC', contact: 'contact@climapro.tn' },
  { id: 6, name: 'AluDesign', speciality_fr: 'Menuiserie Aluminium', speciality_en: 'Aluminum Joinery', contact: 'devis@aludesign.tn' },
  { id: 7, name: 'WaterStop', speciality_fr: 'Étanchéité', speciality_en: 'Waterproofing', contact: 'info@waterstop.tn' },
];

export default function ScopePage() {
  const { lang } = useLanguage();
  const l = lang as Language;
  const { currency } = useProjectSettings();

  // ── Contractors state ──────────────────────────────────
  const [contractors, setContractors] = useState<Contractor[]>(demoContractors);
  const [showContractorModal, setShowContractorModal] = useState(false);
  const [contractorForm, setContractorForm] = useState({ name: '', speciality_fr: '', speciality_en: '', contact: '' });

  const handleAddContractor = () => {
    if (!contractorForm.name.trim()) return;
    setContractors(prev => [...prev, { id: prev.length + 1, ...contractorForm }]);
    setShowContractorModal(false);
    setContractorForm({ name: '', speciality_fr: '', speciality_en: '', contact: '' });
  };

  // ── Lots state ─────────────────────────────────────────
  const [userLots, setUserLots] = useState<LotItem[]>([]);
  const [showLotModal, setShowLotModal] = useState(false);
  const [lotForm, setLotForm] = useState({ name_fr: '', name_en: '', desc_fr: '', desc_en: '', contractor: '', status: 'not_started' });

  const displayLots: LotItem[] = [
    ...scopeLots.map(lot => ({ ...lot, name_fr: lot.name_fr, name_en: lot.name_en, desc_fr: lot.desc_fr, desc_en: lot.desc_en })),
    ...userLots,
  ];

  const handleAddLot = () => {
    if (!lotForm.name_fr.trim() && !lotForm.name_en.trim()) return;
    const newLot: LotItem = {
      id: displayLots.length + 1,
      name_fr: lotForm.name_fr || lotForm.name_en,
      name_en: lotForm.name_en || lotForm.name_fr,
      desc_fr: lotForm.desc_fr,
      desc_en: lotForm.desc_en || lotForm.desc_fr,
      contractor: lotForm.contractor,
      status: lotForm.status,
    };
    setUserLots(prev => [...prev, newLot]);
    setShowLotModal(false);
    setLotForm({ name_fr: '', name_en: '', desc_fr: '', desc_en: '', contractor: '', status: 'not_started' });
  };

  // ── CRs state ──────────────────────────────────────────
  const [crs, setCRs] = useState<CRItem[]>([]);
  const [crsMounted, setCRsMounted] = useState(false);
  const [showCRModal, setShowCRModal] = useState(false);
  const [crForm, setCRForm] = useState({ title: '', cost_impact: 0, schedule_impact_days: 0, lot: '' });

  const displayCRs: CRItem[] = crsMounted ? crs : scopeCRs.map(cr => ({
    id: cr.id, title: cr[`title_${l}`], cost_impact: cr.cost_impact, schedule_impact_days: cr.schedule_impact_days, status: cr.status,
  }));

  const handleAddCR = () => {
    if (!crForm.title.trim()) return;
    const newCR: CRItem = { id: (crsMounted ? crs : displayCRs).length + 1, title: crForm.title, cost_impact: crForm.cost_impact, schedule_impact_days: crForm.schedule_impact_days, status: 'pending' };
    if (!crsMounted) { setCRs([...displayCRs, newCR]); setCRsMounted(true); } else { setCRs([...crs, newCR]); }
    setShowCRModal(false);
    setCRForm({ title: '', cost_impact: 0, schedule_impact_days: 0, lot: '' });
  };

  // ── Helpers ────────────────────────────────────────────
  const badge = (status: string) => {
    const m: Record<string, string> = { in_progress: 'badge-info', planned: 'badge-neutral', completed: 'badge-success', not_started: 'badge-neutral', pending: 'badge-warning', approved: 'badge-success', rejected: 'badge-danger' };
    return m[status] || 'badge-neutral';
  };

  const statusOptions = [
    { value: 'not_started', label: l === 'fr' ? 'Non démarré' : 'Not Started' },
    { value: 'planned', label: l === 'fr' ? 'Planifié' : 'Planned' },
    { value: 'in_progress', label: l === 'fr' ? 'En cours' : 'In Progress' },
    { value: 'completed', label: l === 'fr' ? 'Terminé' : 'Completed' },
  ];

  return (
    <div className="animate-in">
      <div className="page-header">
        <h1 className="page-title">{t('scope.title', lang)}</h1>
      </div>

      {/* ═══ CONTRACTORS ═══ */}
      <div className="toolbar">
        <h2 style={{ fontSize: 18, fontWeight: 700 }}><Building2 size={18} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 6 }} />{l === 'fr' ? 'Entrepreneurs' : 'Contractors'}</h2>
        <button className="btn btn-primary btn-sm" onClick={() => setShowContractorModal(true)}><Plus size={14} style={{ marginRight: 4 }} />{l === 'fr' ? 'Ajouter' : 'Add'}</button>
      </div>
      <div className="data-table-wrapper">
        <table className="data-table">
          <thead><tr>
            <th>#</th>
            <th>{l === 'fr' ? 'Nom' : 'Name'}</th>
            <th>{l === 'fr' ? 'Spécialité' : 'Speciality'}</th>
            <th>Contact</th>
            <th>{l === 'fr' ? 'Lots Associés' : 'Assigned Lots'}</th>
          </tr></thead>
          <tbody>
            {contractors.map(c => {
              const assignedLots = displayLots.filter(lot => lot.contractor === c.name).map(lot => lot[`name_${l}`]);
              return (
                <tr key={c.id}>
                  <td style={{ color: 'var(--text-muted)' }}>{c.id}</td>
                  <td style={{ fontWeight: 600 }}>{c.name}</td>
                  <td style={{ color: 'var(--text-secondary)' }}>{l === 'fr' ? c.speciality_fr : c.speciality_en}</td>
                  <td style={{ color: 'var(--text-secondary)', fontSize: 13 }}>{c.contact}</td>
                  <td>{assignedLots.length > 0
                    ? assignedLots.map(name => <span key={name} className="badge badge-info" style={{ marginRight: 4, marginBottom: 2 }}>{name}</span>)
                    : <span style={{ color: 'var(--text-muted)', fontStyle: 'italic', fontSize: 13 }}>{l === 'fr' ? 'Aucun lot' : 'No lots'}</span>}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* ═══ LOTS ═══ */}
      <div className="toolbar" style={{ marginTop: 32 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700 }}><Target size={18} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 6 }} />{t('scope.lots', lang)}</h2>
        <button className="btn btn-primary btn-sm" onClick={() => setShowLotModal(true)}>+ {t('scope.addLot', lang)}</button>
      </div>
      <div className="data-table-wrapper">
        <table className="data-table">
          <thead><tr>
            <th>#</th><th>{t('common.name', lang)}</th><th>{t('common.description', lang)}</th><th>{l === 'fr' ? 'Entrepreneur' : 'Contractor'}</th><th>{t('common.status', lang)}</th>
          </tr></thead>
          <tbody>
            {displayLots.map(lot => (
              <tr key={lot.id}>
                <td style={{ color: 'var(--text-muted)' }}>{lot.id}</td>
                <td style={{ fontWeight: 600 }}>{lot[`name_${l}`]}</td>
                <td style={{ color: 'var(--text-secondary)' }}>{lot[`desc_${l}`]}</td>
                <td><span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}><Users size={14} style={{ color: 'var(--text-muted)' }} />{lot.contractor || '—'}</span></td>
                <td><span className={`badge ${badge(lot.status)}`}>{t(`status.${lot.status}`, lang)}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ═══ CHANGE REQUESTS ═══ */}
      <div className="toolbar" style={{ marginTop: 32 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700 }}><FileEdit size={18} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 6 }} />{t('scope.changeRequests', lang)}</h2>
        <button className="btn btn-secondary btn-sm" onClick={() => setShowCRModal(true)}>+ {l === 'fr' ? 'Nouvelle demande' : 'New request'}</button>
      </div>
      <div className="data-table-wrapper">
        <table className="data-table">
          <thead><tr>
            <th>#</th><th>{l === 'fr' ? 'Titre' : 'Title'}</th><th>{l === 'fr' ? 'Impact Coût' : 'Cost Impact'}</th><th>{l === 'fr' ? 'Impact Délai' : 'Schedule Impact'}</th><th>{t('common.status', lang)}</th>
          </tr></thead>
          <tbody>
            {displayCRs.map(cr => (
              <tr key={cr.id}>
                <td style={{ color: 'var(--text-muted)' }}>CR-{cr.id}</td>
                <td style={{ fontWeight: 600 }}>{cr.title}</td>
                <td style={{ color: '#f59e0b' }}>+{cr.cost_impact.toLocaleString()} {currency}</td>
                <td style={{ color: '#ef4444' }}>+{cr.schedule_impact_days}{l === 'fr' ? 'j' : 'd'}</td>
                <td><span className={`badge ${badge(cr.status)}`}>{t(`status.${cr.status}`, lang)}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ═══ ADD CONTRACTOR MODAL ═══ */}
      {showContractorModal && (
        <div className="modal-overlay" onClick={() => setShowContractorModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">{l === 'fr' ? 'Ajouter un Entrepreneur' : 'Add Contractor'}</h3>
              <button className="modal-close" onClick={() => setShowContractorModal(false)}><X size={20} /></button>
            </div>
            <div className="form-group">
              <label className="form-label">{l === 'fr' ? 'Nom de l\'entreprise' : 'Company Name'} *</label>
              <input className="form-input" placeholder="Ex: SociétéBTP" value={contractorForm.name} onChange={e => setContractorForm({ ...contractorForm, name: e.target.value })} />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">{l === 'fr' ? 'Spécialité (FR)' : 'Speciality (FR)'}</label>
                <input className="form-input" placeholder="Ex: Peinture" value={contractorForm.speciality_fr} onChange={e => setContractorForm({ ...contractorForm, speciality_fr: e.target.value })} />
              </div>
              <div className="form-group">
                <label className="form-label">{l === 'fr' ? 'Spécialité (EN)' : 'Speciality (EN)'}</label>
                <input className="form-input" placeholder="Ex: Painting" value={contractorForm.speciality_en} onChange={e => setContractorForm({ ...contractorForm, speciality_en: e.target.value })} />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">{l === 'fr' ? 'Contact (email/tél)' : 'Contact (email/phone)'}</label>
              <input className="form-input" placeholder="contact@company.tn" value={contractorForm.contact} onChange={e => setContractorForm({ ...contractorForm, contact: e.target.value })} />
            </div>
            <div className="modal-actions">
              <button className="btn btn-secondary" onClick={() => setShowContractorModal(false)}>{t('common.cancel', lang)}</button>
              <button className="btn btn-primary" onClick={handleAddContractor}>{t('common.save', lang)}</button>
            </div>
          </div>
        </div>
      )}

      {/* ═══ ADD LOT MODAL ═══ */}
      {showLotModal && (
        <div className="modal-overlay" onClick={() => setShowLotModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">{t('scope.addLot', lang)}</h3>
              <button className="modal-close" onClick={() => setShowLotModal(false)}><X size={20} /></button>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">{l === 'fr' ? 'Nom (FR)' : 'Name (FR)'} *</label>
                <input className="form-input" placeholder="Ex: Peinture" value={lotForm.name_fr} onChange={e => setLotForm({ ...lotForm, name_fr: e.target.value })} />
              </div>
              <div className="form-group">
                <label className="form-label">{l === 'fr' ? 'Nom (EN)' : 'Name (EN)'}</label>
                <input className="form-input" placeholder="Ex: Painting" value={lotForm.name_en} onChange={e => setLotForm({ ...lotForm, name_en: e.target.value })} />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">{l === 'fr' ? 'Description (FR)' : 'Description (FR)'}</label>
                <input className="form-input" value={lotForm.desc_fr} onChange={e => setLotForm({ ...lotForm, desc_fr: e.target.value })} />
              </div>
              <div className="form-group">
                <label className="form-label">{l === 'fr' ? 'Description (EN)' : 'Description (EN)'}</label>
                <input className="form-input" value={lotForm.desc_en} onChange={e => setLotForm({ ...lotForm, desc_en: e.target.value })} />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">{l === 'fr' ? 'Entrepreneur' : 'Contractor'} *</label>
                <select className="form-select" value={lotForm.contractor} onChange={e => setLotForm({ ...lotForm, contractor: e.target.value })}>
                  <option value="">{l === 'fr' ? '-- Sélectionner --' : '-- Select --'}</option>
                  {contractors.map(c => <option key={c.id} value={c.name}>{c.name} — {l === 'fr' ? c.speciality_fr : c.speciality_en}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">{t('common.status', lang)}</label>
                <select className="form-select" value={lotForm.status} onChange={e => setLotForm({ ...lotForm, status: e.target.value })}>
                  {statusOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </div>
            </div>
            <div className="modal-actions">
              <button className="btn btn-secondary" onClick={() => setShowLotModal(false)}>{t('common.cancel', lang)}</button>
              <button className="btn btn-primary" onClick={handleAddLot}>{t('common.save', lang)}</button>
            </div>
          </div>
        </div>
      )}

      {/* ═══ ADD CR MODAL ═══ */}
      {showCRModal && (
        <div className="modal-overlay" onClick={() => setShowCRModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">{l === 'fr' ? 'Nouvelle Demande de Modification' : 'New Change Request'}</h3>
              <button className="modal-close" onClick={() => setShowCRModal(false)}><X size={20} /></button>
            </div>
            <div className="form-group">
              <label className="form-label">{l === 'fr' ? 'Titre' : 'Title'} *</label>
              <input className="form-input" placeholder={l === 'fr' ? 'Ex: Modification emplacement bloc opératoire' : 'Ex: Operating theater location change'} value={crForm.title} onChange={e => setCRForm({ ...crForm, title: e.target.value })} />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">{l === 'fr' ? 'Impact Coût' : 'Cost Impact'} ({currency})</label>
                <input className="form-input" type="number" placeholder="0" value={crForm.cost_impact || ''} onChange={e => setCRForm({ ...crForm, cost_impact: parseInt(e.target.value) || 0 })} />
              </div>
              <div className="form-group">
                <label className="form-label">{l === 'fr' ? 'Impact Délai (jours)' : 'Schedule Impact (days)'}</label>
                <input className="form-input" type="number" placeholder="0" value={crForm.schedule_impact_days || ''} onChange={e => setCRForm({ ...crForm, schedule_impact_days: parseInt(e.target.value) || 0 })} />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Lot</label>
              <select className="form-select" value={crForm.lot} onChange={e => setCRForm({ ...crForm, lot: e.target.value })}>
                {displayLots.map(lot => <option key={lot.id} value={lot[`name_${l}`]}>{lot[`name_${l}`]}</option>)}
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
