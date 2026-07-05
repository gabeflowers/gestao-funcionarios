const BASE_URL = '/api/employees';

async function handleResponse(response) {
  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.message ?? 'Erro na requisição.');
  }
  if (response.status === 204) return null;
  return response.json();
}

export function getEmployees(filters = {}) {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== '' && value != null) params.append(key, value);
  });
  const query = params.toString();
  return fetch(`${BASE_URL}${query ? `?${query}` : ''}`).then(handleResponse);
}

export function createEmployee(employee) {
  return fetch(BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(employee),
  }).then(handleResponse);
}

export function updateEmployee(id, employee) {
  return fetch(`${BASE_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(employee),
  }).then(handleResponse);
}

export function deleteEmployee(id) {
  return fetch(`${BASE_URL}/${id}`, { method: 'DELETE' }).then(handleResponse);
}