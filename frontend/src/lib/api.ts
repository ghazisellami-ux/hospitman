const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

class ApiClient {
  private token: string | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('token');
    }
  }

  setToken(token: string) {
    this.token = token;
    if (typeof window !== 'undefined') {
      localStorage.setItem('token', token);
    }
  }

  clearToken() {
    this.token = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
    }
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...((options.headers as Record<string, string>) || {}),
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (response.status === 401) {
      this.clearToken();
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
      throw new Error('Unauthorized');
    }

    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: 'Request failed' }));
      throw new Error(error.detail || 'Request failed');
    }

    return response.json();
  }

  // Auth
  login(email: string, password: string) {
    return this.request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  register(data: any) {
    return this.request('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  getMe() {
    return this.request('/api/auth/me');
  }

  // Projects
  listProjects() {
    return this.request('/api/projects/');
  }

  getProject(id: number) {
    return this.request(`/api/projects/${id}`);
  }

  createProject(data: any) {
    return this.request('/api/projects/', { method: 'POST', body: JSON.stringify(data) });
  }

  updateProject(id: number, data: any) {
    return this.request(`/api/projects/${id}`, { method: 'PUT', body: JSON.stringify(data) });
  }

  // Dashboard
  getDashboardKPIs(projectId: number) {
    return this.request(`/api/projects/${projectId}/dashboard/kpis`);
  }

  getSCurve(projectId: number) {
    return this.request(`/api/projects/${projectId}/dashboard/s-curve`);
  }

  getBudgetBreakdown(projectId: number) {
    return this.request(`/api/projects/${projectId}/dashboard/budget-breakdown`);
  }

  // Scope
  listLots(projectId: number) {
    return this.request(`/api/projects/${projectId}/scope/lots`);
  }

  createLot(projectId: number, data: any) {
    return this.request(`/api/projects/${projectId}/scope/lots`, { method: 'POST', body: JSON.stringify(data) });
  }

  listContractors(projectId: number) {
    return this.request(`/api/projects/${projectId}/scope/contractors`);
  }

  createContractor(projectId: number, data: any) {
    return this.request(`/api/projects/${projectId}/scope/contractors`, { method: 'POST', body: JSON.stringify(data) });
  }

  listChangeRequests(projectId: number) {
    return this.request(`/api/projects/${projectId}/scope/change-requests`);
  }

  createChangeRequest(projectId: number, data: any) {
    return this.request(`/api/projects/${projectId}/scope/change-requests`, { method: 'POST', body: JSON.stringify(data) });
  }

  // Schedule
  listActivities(projectId: number) {
    return this.request(`/api/projects/${projectId}/schedule/activities`);
  }

  createActivity(projectId: number, data: any) {
    return this.request(`/api/projects/${projectId}/schedule/activities`, { method: 'POST', body: JSON.stringify(data) });
  }

  updateActivity(projectId: number, id: number, data: any) {
    return this.request(`/api/projects/${projectId}/schedule/activities/${id}`, { method: 'PUT', body: JSON.stringify(data) });
  }

  // Cost
  listBudgets(projectId: number) {
    return this.request(`/api/projects/${projectId}/cost/budgets`);
  }

  createBudget(projectId: number, data: any) {
    return this.request(`/api/projects/${projectId}/cost/budgets`, { method: 'POST', body: JSON.stringify(data) });
  }

  listInvoices(projectId: number) {
    return this.request(`/api/projects/${projectId}/cost/invoices`);
  }

  createInvoice(projectId: number, data: any) {
    return this.request(`/api/projects/${projectId}/cost/invoices`, { method: 'POST', body: JSON.stringify(data) });
  }

  // HR
  listPersonnel(projectId: number) {
    return this.request(`/api/projects/${projectId}/hr/personnel`);
  }

  createPersonnel(projectId: number, data: any) {
    return this.request(`/api/projects/${projectId}/hr/personnel`, { method: 'POST', body: JSON.stringify(data) });
  }

  listAttendance(projectId: number) {
    return this.request(`/api/projects/${projectId}/hr/attendance`);
  }

  createAttendance(projectId: number, data: any) {
    return this.request(`/api/projects/${projectId}/hr/attendance`, { method: 'POST', body: JSON.stringify(data) });
  }

  // Quality
  listInspections(projectId: number) {
    return this.request(`/api/projects/${projectId}/quality/inspections`);
  }

  createInspection(projectId: number, data: any) {
    return this.request(`/api/projects/${projectId}/quality/inspections`, { method: 'POST', body: JSON.stringify(data) });
  }

  listNCRs(projectId: number) {
    return this.request(`/api/projects/${projectId}/quality/ncrs`);
  }

  createNCR(projectId: number, data: any) {
    return this.request(`/api/projects/${projectId}/quality/ncrs`, { method: 'POST', body: JSON.stringify(data) });
  }

  // Communication
  listCommunications(projectId: number) {
    return this.request(`/api/projects/${projectId}/communication/`);
  }

  createCommunication(projectId: number, data: any) {
    return this.request(`/api/projects/${projectId}/communication/`, { method: 'POST', body: JSON.stringify(data) });
  }

  listActionItems(projectId: number) {
    return this.request(`/api/projects/${projectId}/communication/actions`);
  }

  // Risk
  listRisks(projectId: number) {
    return this.request(`/api/projects/${projectId}/risk/`);
  }

  createRisk(projectId: number, data: any) {
    return this.request(`/api/projects/${projectId}/risk/`, { method: 'POST', body: JSON.stringify(data) });
  }

  getRiskMatrix(projectId: number) {
    return this.request(`/api/projects/${projectId}/risk/matrix`);
  }
}

export const api = new ApiClient();
