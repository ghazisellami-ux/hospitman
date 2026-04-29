export type Language = 'fr' | 'en';

export const translations: Record<Language, Record<string, string>> = {
  fr: {
    // Navigation
    'nav.dashboard': 'Tableau de Bord',
    'nav.project': 'Projet',
    'nav.scope': 'Périmètre',
    'nav.schedule': 'Planning',
    'nav.cost': 'Coûts',
    'nav.hr': 'Ressources Humaines',
    'nav.quality': 'Qualité',
    'nav.communication': 'Communication',
    'nav.risk': 'Risques',
    'nav.reports': 'Rapports',
    'nav.management': 'GESTION',
    'nav.support': 'SUPPORT',

    // Dashboard
    'dashboard.title': 'Tableau de Bord',
    'dashboard.subtitle': 'Vue d\'ensemble du projet de construction',
    'dashboard.progress': 'Avancement Global',
    'dashboard.spi': 'Indice Performance Délais',
    'dashboard.cpi': 'Indice Performance Coûts',
    'dashboard.budget': 'Budget Consommé',
    'dashboard.days': 'Jours Restants',
    'dashboard.risks': 'Risques Critiques',
    'dashboard.ncrs': 'NCR Ouvertes',
    'dashboard.crs': 'Change Requests',
    'dashboard.personnel': 'Effectif Aujourd\'hui',
    'dashboard.scurve': 'Courbe en S',
    'dashboard.budgetBreakdown': 'Répartition Budget',
    'dashboard.riskMatrix': 'Matrice des Risques',
    'dashboard.qualityOverview': 'Aperçu Qualité',

    // Common
    'common.add': 'Ajouter',
    'common.save': 'Enregistrer',
    'common.cancel': 'Annuler',
    'common.delete': 'Supprimer',
    'common.edit': 'Modifier',
    'common.search': 'Rechercher...',
    'common.status': 'Statut',
    'common.date': 'Date',
    'common.actions': 'Actions',
    'common.name': 'Nom',
    'common.description': 'Description',
    'common.noData': 'Aucune donnée',
    'common.loading': 'Chargement...',
    'common.planned': 'Planifié',
    'common.actual': 'Réel',
    'common.export': 'Exporter',

    // Status labels
    'status.in_progress': 'En cours',
    'status.completed': 'Terminé',
    'status.delayed': 'En retard',
    'status.not_started': 'Non démarré',
    'status.pending': 'En attente',
    'status.approved': 'Approuvé',
    'status.rejected': 'Rejeté',
    'status.open': 'Ouvert',
    'status.closed': 'Fermé',
    'status.conforming': 'Conforme',
    'status.non_conforming': 'Non conforme',
    'status.identified': 'Identifié',
    'status.mitigating': 'En traitement',
    'status.resolved': 'Résolu',
    'status.accepted': 'Accepté',
    'status.on_track': 'Dans les temps',

    // Scope
    'scope.title': 'Gestion du Périmètre',
    'scope.lots': 'Lots / Work Packages',
    'scope.contractors': 'Entrepreneurs',
    'scope.deliverables': 'Livrables',
    'scope.changeRequests': 'Demandes de Modification',
    'scope.addLot': 'Ajouter un lot',
    'scope.addContractor': 'Ajouter un entrepreneur',

    // Schedule
    'schedule.title': 'Gestion du Planning',
    'schedule.activities': 'Activités',
    'schedule.gantt': 'Diagramme de Gantt',
    'schedule.addActivity': 'Ajouter une activité',
    'schedule.progress': 'Avancement',

    // Cost
    'cost.title': 'Gestion des Coûts',
    'cost.budgets': 'Budgets par Lot',
    'cost.invoices': 'Décomptes / Factures',
    'cost.variations': 'Avenants',
    'cost.addBudget': 'Ajouter budget',
    'cost.addInvoice': 'Ajouter facture',

    // HR
    'hr.title': 'Ressources Humaines',
    'hr.personnel': 'Personnel',
    'hr.attendance': 'Présence Journalière',
    'hr.addPersonnel': 'Ajouter personnel',
    'hr.addAttendance': 'Saisir présence',

    // Quality
    'quality.title': 'Gestion de la Qualité',
    'quality.inspections': 'Inspections',
    'quality.ncrs': 'Non-Conformités (NCR)',
    'quality.addInspection': 'Nouvelle inspection',
    'quality.addNCR': 'Nouvelle NCR',

    // Communication
    'comm.title': 'Gestion de la Communication',
    'comm.meetings': 'Réunions & Correspondances',
    'comm.actions': 'Actions à Suivre',
    'comm.add': 'Nouvelle communication',

    // Risk
    'risk.title': 'Gestion des Risques',
    'risk.register': 'Registre des Risques',
    'risk.matrix': 'Matrice des Risques',
    'risk.add': 'Ajouter un risque',

    // Auth
    'auth.login': 'Connexion',
    'auth.email': 'Adresse email',
    'auth.password': 'Mot de passe',
    'auth.signIn': 'Se connecter',
    'auth.welcome': 'Bienvenue sur HospitMan',
    'auth.subtitle': 'Plateforme de suivi de construction hospitalière',
  },
  en: {
    // Navigation
    'nav.dashboard': 'Dashboard',
    'nav.project': 'Project',
    'nav.scope': 'Scope',
    'nav.schedule': 'Schedule',
    'nav.cost': 'Cost',
    'nav.hr': 'Human Resources',
    'nav.quality': 'Quality',
    'nav.communication': 'Communication',
    'nav.risk': 'Risk',
    'nav.reports': 'Reports',
    'nav.management': 'MANAGEMENT',
    'nav.support': 'SUPPORT',

    // Dashboard
    'dashboard.title': 'Dashboard',
    'dashboard.subtitle': 'Construction project overview',
    'dashboard.progress': 'Overall Progress',
    'dashboard.spi': 'Schedule Performance Index',
    'dashboard.cpi': 'Cost Performance Index',
    'dashboard.budget': 'Budget Consumed',
    'dashboard.days': 'Days Remaining',
    'dashboard.risks': 'Critical Risks',
    'dashboard.ncrs': 'Open NCRs',
    'dashboard.crs': 'Change Requests',
    'dashboard.personnel': 'Today\'s Workforce',
    'dashboard.scurve': 'S-Curve',
    'dashboard.budgetBreakdown': 'Budget Breakdown',
    'dashboard.riskMatrix': 'Risk Matrix',
    'dashboard.qualityOverview': 'Quality Overview',

    // Common
    'common.add': 'Add',
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.delete': 'Delete',
    'common.edit': 'Edit',
    'common.search': 'Search...',
    'common.status': 'Status',
    'common.date': 'Date',
    'common.actions': 'Actions',
    'common.name': 'Name',
    'common.description': 'Description',
    'common.noData': 'No data',
    'common.loading': 'Loading...',
    'common.planned': 'Planned',
    'common.actual': 'Actual',
    'common.export': 'Export',

    // Status labels
    'status.in_progress': 'In Progress',
    'status.completed': 'Completed',
    'status.delayed': 'Delayed',
    'status.not_started': 'Not Started',
    'status.pending': 'Pending',
    'status.approved': 'Approved',
    'status.rejected': 'Rejected',
    'status.open': 'Open',
    'status.closed': 'Closed',
    'status.conforming': 'Conforming',
    'status.non_conforming': 'Non-conforming',
    'status.identified': 'Identified',
    'status.mitigating': 'Mitigating',
    'status.resolved': 'Resolved',
    'status.accepted': 'Accepted',
    'status.on_track': 'On Track',

    // Scope
    'scope.title': 'Scope Management',
    'scope.lots': 'Lots / Work Packages',
    'scope.contractors': 'Contractors',
    'scope.deliverables': 'Deliverables',
    'scope.changeRequests': 'Change Requests',
    'scope.addLot': 'Add lot',
    'scope.addContractor': 'Add contractor',

    // Schedule
    'schedule.title': 'Schedule Management',
    'schedule.activities': 'Activities',
    'schedule.gantt': 'Gantt Chart',
    'schedule.addActivity': 'Add activity',
    'schedule.progress': 'Progress',

    // Cost
    'cost.title': 'Cost Management',
    'cost.budgets': 'Budgets per Lot',
    'cost.invoices': 'Invoices',
    'cost.variations': 'Variations',
    'cost.addBudget': 'Add budget',
    'cost.addInvoice': 'Add invoice',

    // HR
    'hr.title': 'Human Resources',
    'hr.personnel': 'Personnel',
    'hr.attendance': 'Daily Attendance',
    'hr.addPersonnel': 'Add personnel',
    'hr.addAttendance': 'Record attendance',

    // Quality
    'quality.title': 'Quality Management',
    'quality.inspections': 'Inspections',
    'quality.ncrs': 'Non-Conformity Reports',
    'quality.addInspection': 'New inspection',
    'quality.addNCR': 'New NCR',

    // Communication
    'comm.title': 'Communication Management',
    'comm.meetings': 'Meetings & Correspondence',
    'comm.actions': 'Action Items',
    'comm.add': 'New communication',

    // Risk
    'risk.title': 'Risk Management',
    'risk.register': 'Risk Register',
    'risk.matrix': 'Risk Matrix',
    'risk.add': 'Add risk',

    // Auth
    'auth.login': 'Login',
    'auth.email': 'Email address',
    'auth.password': 'Password',
    'auth.signIn': 'Sign In',
    'auth.welcome': 'Welcome to HospitMan',
    'auth.subtitle': 'Hospital construction management platform',
  },
};

export function t(key: string, lang: Language = 'fr'): string {
  return translations[lang]?.[key] || key;
}
