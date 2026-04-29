'use client';

import React, { useState } from 'react';
import { useLanguage } from '../layout';
import { t } from '@/lib/i18n';
import { MessageSquare, CheckCircle, X } from 'lucide-react';

interface CommItem {
  id: number;
  type: string;
  date: string;
  subject: string;
  participants: string;
}

interface ActionItem {
  id: number;
  desc: string;
  assigned: string;
  deadline: string;
  status: string;
}

const initialComms: CommItem[] = [
  { id: 1, type: 'meeting', date: '2026-04-28', subject: 'Réunion hebdomadaire de chantier #18', participants: 'Direction, BTP STAR, Supervision' },
  { id: 2, type: 'rfi', date: '2026-04-26', subject: 'RFI-045: Épaisseur dalle bloc opératoire', participants: 'BET Structure, Direction' },
  { id: 3, type: 'correspondence', date: '2026-04-24', subject: 'Mise en demeure retard lot VRD', participants: 'Direction, VRD Tunisie' },
  { id: 4, type: 'meeting', date: '2026-04-21', subject: 'Réunion coordination MEP', participants: 'ElecPro, HydroTech, ClimaPro, Direction' },
];

const initialActions: ActionItem[] = [
  { id: 1, desc: 'Fournir plan d\'exécution révisé zone B', assigned: 'BTP STAR', deadline: '2026-05-02', status: 'open' },
  { id: 2, desc: 'Soumettre fiches techniques gaz médicaux', assigned: 'ClimaPro', deadline: '2026-05-05', status: 'open' },
  { id: 3, desc: 'Valider échantillons carrelage hall principal', assigned: 'Direction', deadline: '2026-04-30', status: 'in_progress' },
  { id: 4, desc: 'Corriger NCR-002 résistance béton', assigned: 'BTP STAR', deadline: '2026-05-01', status: 'open' },
];

const commTypes = ['meeting', 'rfi', 'correspondence', 'minutes'];
const assignees = ['BTP STAR', 'Direction', 'ClimaPro', 'ElecPro', 'HydroTech', 'VRD Tunisie', 'BET Structure'];

export default function CommunicationPage() {
  const { lang } = useLanguage();
  const [comms, setComms] = useState<CommItem[]>(initialComms);
  const [actions, setActions] = useState<ActionItem[]>(initialActions);

  // Communication modal
  const [showCommModal, setShowCommModal] = useState(false);
  const [commForm, setCommForm] = useState({ type: 'meeting', date: '', subject: '', participants: '' });

  // Action modal
  const [showActionModal, setShowActionModal] = useState(false);
  const [actionForm, setActionForm] = useState({ desc: '', assigned: assignees[0], deadline: '', status: 'open' });

  const typeLabel = (tp: string) => {
    const map: Record<string, Record<string, string>> = {
      fr: { meeting: 'Réunion', rfi: 'RFI', correspondence: 'Correspondance', minutes: 'PV' },
      en: { meeting: 'Meeting', rfi: 'RFI', correspondence: 'Correspondence', minutes: 'Minutes' },
    };
    return map[lang]?.[tp] || tp;
  };

  const handleAddComm = () => {
    if (!commForm.subject.trim() || !commForm.date) return;
    const newComm: CommItem = {
      id: comms.length + 1,
      type: commForm.type,
      date: commForm.date,
      subject: commForm.subject,
      participants: commForm.participants,
    };
    setComms([...comms, newComm]);
    setShowCommModal(false);
    setCommForm({ type: 'meeting', date: '', subject: '', participants: '' });
  };

  const handleAddAction = () => {
    if (!actionForm.desc.trim() || !actionForm.deadline) return;
    const newAction: ActionItem = {
      id: actions.length + 1,
      desc: actionForm.desc,
      assigned: actionForm.assigned,
      deadline: actionForm.deadline,
      status: actionForm.status,
    };
    setActions([...actions, newAction]);
    setShowActionModal(false);
    setActionForm({ desc: '', assigned: assignees[0], deadline: '', status: 'open' });
  };

  return (
    <div className="animate-in">
      <div className="page-header">
        <h1 className="page-title">{t('comm.title', lang)}</h1>
      </div>

      {/* Communications */}
      <div className="toolbar">
        <h2 style={{ fontSize: 18, fontWeight: 700 }}><MessageSquare size={18} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 6 }} />{t('comm.meetings', lang)}</h2>
        <button className="btn btn-primary btn-sm" onClick={() => setShowCommModal(true)}>+ {t('comm.add', lang)}</button>
      </div>
      <div className="data-table-wrapper">
        <table className="data-table">
          <thead><tr><th>Type</th><th>{t('common.date', lang)}</th><th>{lang === 'fr' ? 'Objet' : 'Subject'}</th><th>{lang === 'fr' ? 'Participants' : 'Participants'}</th></tr></thead>
          <tbody>
            {comms.map((c) => (
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

      {/* Actions */}
      <div className="toolbar" style={{ marginTop: 32 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700 }}><CheckCircle size={18} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 6 }} />{t('comm.actions', lang)}</h2>
        <button className="btn btn-primary btn-sm" onClick={() => setShowActionModal(true)}>+ {lang === 'fr' ? 'Ajouter Action' : 'Add Action'}</button>
      </div>
      <div className="data-table-wrapper">
        <table className="data-table">
          <thead><tr><th>{t('common.description', lang)}</th><th>{lang === 'fr' ? 'Assigné à' : 'Assigned to'}</th><th>Deadline</th><th>{t('common.status', lang)}</th></tr></thead>
          <tbody>
            {actions.map((a) => (
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

      {/* Communication Modal */}
      {showCommModal && (
        <div className="modal-overlay" onClick={() => setShowCommModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">{lang === 'fr' ? 'Nouvelle Communication' : 'New Communication'}</h3>
              <button className="modal-close" onClick={() => setShowCommModal(false)}><X size={20} /></button>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Type</label>
                <select className="form-select" value={commForm.type} onChange={(e) => setCommForm({ ...commForm, type: e.target.value })}>
                  {commTypes.map(ct => <option key={ct} value={ct}>{typeLabel(ct)}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">{t('common.date', lang)}</label>
                <input className="form-input" type="date" value={commForm.date} onChange={(e) => setCommForm({ ...commForm, date: e.target.value })} />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">{lang === 'fr' ? 'Objet' : 'Subject'}</label>
              <input className="form-input" placeholder={lang === 'fr' ? 'Objet de la communication...' : 'Communication subject...'} value={commForm.subject} onChange={(e) => setCommForm({ ...commForm, subject: e.target.value })} />
            </div>
            <div className="form-group">
              <label className="form-label">{lang === 'fr' ? 'Participants' : 'Participants'}</label>
              <input className="form-input" placeholder={lang === 'fr' ? 'Ex: Direction, BTP STAR...' : 'E.g.: Management, BTP STAR...'} value={commForm.participants} onChange={(e) => setCommForm({ ...commForm, participants: e.target.value })} />
            </div>
            <div className="modal-actions">
              <button className="btn btn-secondary" onClick={() => setShowCommModal(false)}>{lang === 'fr' ? 'Annuler' : 'Cancel'}</button>
              <button className="btn btn-primary" onClick={handleAddComm}>{lang === 'fr' ? 'Ajouter' : 'Add'}</button>
            </div>
          </div>
        </div>
      )}

      {/* Action Modal */}
      {showActionModal && (
        <div className="modal-overlay" onClick={() => setShowActionModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">{lang === 'fr' ? 'Nouvelle Action' : 'New Action'}</h3>
              <button className="modal-close" onClick={() => setShowActionModal(false)}><X size={20} /></button>
            </div>
            <div className="form-group">
              <label className="form-label">{t('common.description', lang)}</label>
              <textarea className="form-textarea" placeholder={lang === 'fr' ? 'Décrivez l\'action à réaliser...' : 'Describe the action item...'} value={actionForm.desc} onChange={(e) => setActionForm({ ...actionForm, desc: e.target.value })} />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">{lang === 'fr' ? 'Assigné à' : 'Assigned to'}</label>
                <select className="form-select" value={actionForm.assigned} onChange={(e) => setActionForm({ ...actionForm, assigned: e.target.value })}>
                  {assignees.map(a => <option key={a} value={a}>{a}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Deadline</label>
                <input className="form-input" type="date" value={actionForm.deadline} onChange={(e) => setActionForm({ ...actionForm, deadline: e.target.value })} />
              </div>
            </div>
            <div className="modal-actions">
              <button className="btn btn-secondary" onClick={() => setShowActionModal(false)}>{lang === 'fr' ? 'Annuler' : 'Cancel'}</button>
              <button className="btn btn-primary" onClick={handleAddAction}>{lang === 'fr' ? 'Ajouter' : 'Add'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
