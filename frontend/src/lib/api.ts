const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

async function fetchApi(endpoint: string, options: RequestInit = {}) {
  const token = localStorage.getItem('token');

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...((options.headers as Record<string, string>) || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}/${endpoint}`, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    localStorage.removeItem('token');
    window.location.href = '/login';
    throw new Error('No autorizado');
  }

  if (!response.ok) {
    try {
      const error = await response.json();
      throw new Error(error.message || `Error ${response.status}`);
    } catch (e) {
      if (e instanceof Error && e.message !== `Error ${response.status}`) throw e;
      throw new Error(`Error del servidor: ${response.status}`);
    }
  }

  return response.json();
}

// Auth
export const authApi = {
  login: (email: string, password: string) =>
    fetchApi('auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  register: (nombre: string, email: string, password: string) =>
    fetchApi('auth/register', {
      method: 'POST',
      body: JSON.stringify({ nombre, email, password }),
    }),
};

// Departamentos
export const departamentosApi = {
  getAll: () => fetchApi('departamentos'),

  getOne: (id: number) => fetchApi(`departamentos/${id}`),

  create: (nombre: string) =>
    fetchApi('departamentos', {
      method: 'POST',
      body: JSON.stringify({ nombre }),
    }),

  update: (id: number, nombre: string) =>
    fetchApi(`departamentos/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ nombre }),
    }),

  delete: (id: number) =>
    fetchApi(`departamentos/${id}`, {
      method: 'DELETE',
    }),
};

// Ciudades
export const ciudadesApi = {
  getAll: () => fetchApi('ciudades'),

  getOne: (id: number) => fetchApi(`ciudades/${id}`),

  create: (nombre: string, departamentoId: number) =>
    fetchApi('ciudades', {
      method: 'POST',
      body: JSON.stringify({ nombre, departamentoId }),
    }),

  update: (id: number, nombre: string, departamentoId: number) =>
    fetchApi(`ciudades/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ nombre, departamentoId }),
    }),

  delete: (id: number) =>
    fetchApi(`ciudades/${id}`, {
      method: 'DELETE',
    }),
};
