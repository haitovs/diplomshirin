// API Service for Diploma Work Archive
const API_BASE = '/api';

// Helper for fetch requests
async function fetchAPI(endpoint, options = {}) {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(error.error || 'Request failed');
  }

  return response.json();
}

// Diploma Works API
export const diplomaWorksAPI = {
  getAll: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return fetchAPI(`/diploma-works${query ? `?${query}` : ''}`);
  },

  getById: (id) => fetchAPI(`/diploma-works/${id}`),

  create: (data) => fetchAPI('/diploma-works', {
    method: 'POST',
    body: JSON.stringify(data),
  }),

  update: (id, data) => fetchAPI(`/diploma-works/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),

  delete: (id) => fetchAPI(`/diploma-works/${id}`, {
    method: 'DELETE',
  }),

  checkSimilarity: (title, description) => fetchAPI('/diploma-works/check-similarity', {
    method: 'POST',
    body: JSON.stringify({ title, description }),
  }),
};

// Students API
export const studentsAPI = {
  getAll: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return fetchAPI(`/students${query ? `?${query}` : ''}`);
  },

  getById: (id) => fetchAPI(`/students/${id}`),

  create: (data) => fetchAPI('/students', {
    method: 'POST',
    body: JSON.stringify(data),
  }),

  update: (id, data) => fetchAPI(`/students/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),

  delete: (id) => fetchAPI(`/students/${id}`, {
    method: 'DELETE',
  }),
};

// Search API
export const searchAPI = {
  search: (q, params = {}) => {
    const query = new URLSearchParams({ q, ...params }).toString();
    return fetchAPI(`/search?${query}`);
  },

  checkIdea: (title, description) => fetchAPI('/search/check-idea', {
    method: 'POST',
    body: JSON.stringify({ title, description }),
  }),

  deepCheck: (data) => fetchAPI('/search/deep-check', {
    method: 'POST',
    body: JSON.stringify(data),
  }),

  getCategories: () => fetchAPI('/search/categories'),

  getYears: () => fetchAPI('/search/years'),
};

// Auth API
export const authAPI = {
  studentLogin: (email, password) => fetchAPI('/auth/student-login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  }),
};

// Stats API
export const statsAPI = {
  getDashboard: () => fetchAPI('/stats'),
};

// Upload API
export const uploadAPI = {
  screenshots: (files) => {
    const formData = new FormData();
    files.forEach(f => formData.append('screenshots', f));
    return fetch(`${API_BASE}/upload/screenshots`, {
      method: 'POST',
      body: formData,
    }).then(r => {
      if (!r.ok) throw new Error('Upload failed');
      return r.json();
    });
  },

  document: (file) => {
    const formData = new FormData();
    formData.append('document', file);
    return fetch(`${API_BASE}/upload/document`, {
      method: 'POST',
      body: formData,
    }).then(r => {
      if (!r.ok) throw new Error('Upload failed');
      return r.json();
    });
  },
};

export default {
  diplomaWorks: diplomaWorksAPI,
  students: studentsAPI,
  search: searchAPI,
  auth: authAPI,
  stats: statsAPI,
  upload: uploadAPI,
};
