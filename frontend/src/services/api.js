/**
 * API Client Service
 * Clean and straightforward HTTP client connecting to backend REST API
 */

const API_BASE = '/api';

// Helper to retrieve auth token from localStorage
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export const api = {
  // Authentication
  async login(email, password) {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Login failed');
    return data;
  },

  async register(userData) {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Registration failed');
    return data;
  },

  async getMe() {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: getAuthHeaders(),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Could not fetch session');
    return data;
  },

  async getDemoCredentials() {
    const res = await fetch(`${API_BASE}/auth/demo-credentials`);
    const data = await res.json();
    return data.accounts || [];
  },

  // Grievance Endpoints
  async getGrievances(params = {}) {
    const query = new URLSearchParams();
    if (params.status && params.status !== 'All') query.append('status', params.status);
    if (params.category && params.category !== 'All') query.append('category', params.category);
    if (params.urgency && params.urgency !== 'All') query.append('urgency', params.urgency);
    if (params.search) query.append('search', params.search);

    const queryString = query.toString() ? `?${query.toString()}` : '';
    const res = await fetch(`${API_BASE}/grievances${queryString}`, {
      headers: getAuthHeaders(),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to fetch grievances');
    return data.grievances || [];
  },

  async getGrievanceById(id) {
    const res = await fetch(`${API_BASE}/grievances/${id}`, {
      headers: getAuthHeaders(),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Grievance not found');
    return data.grievance;
  },

  async submitGrievance(grievanceData) {
    const res = await fetch(`${API_BASE}/grievances`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(grievanceData),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Submission failed');
    return data;
  },

  async trackGrievance(trackingId) {
    const res = await fetch(`${API_BASE}/grievances/track/${encodeURIComponent(trackingId)}`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Grievance not found');
    return data.grievance;
  },

  async getStats() {
    const res = await fetch(`${API_BASE}/grievances/stats`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to fetch stats');
    return data.stats;
  },

  async updateGrievanceStatus(id, updateData) {
    const res = await fetch(`${API_BASE}/grievances/${id}/status`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify(updateData),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to update status');
    return data;
  },

  // AI Services
  async triageComplaint(rawText) {
    const res = await fetch(`${API_BASE}/ai/triage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ rawText }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'AI Triage processing failed');
    return data.triage;
  },

  async chatWithAI(messages, draftComplaint = '') {
    const res = await fetch(`${API_BASE}/ai/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages, draftComplaint }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'AI Chat failed');
    return data;
  },

  async checkHealth() {
    try {
      const res = await fetch(`${API_BASE}/health`);
      return await res.json();
    } catch {
      return { status: 'OFFLINE' };
    }
  },
};
