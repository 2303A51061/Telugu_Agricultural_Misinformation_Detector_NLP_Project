const API_BASE = `${(import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '')}/api`;

export async function fetchHealth() {
  const res = await fetch(`${API_BASE}/health`);
  return res.json();
}

export async function fetchDashboard() {
  const res = await fetch(`${API_BASE}/dashboard`);
  return res.json();
}

export async function predictTeluguText(text) {
  const res = await fetch(`${API_BASE}/predict`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text })
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Failed to analyze text.');
  }
  return data;
}

export async function fetchSamples() {
  const res = await fetch(`${API_BASE}/samples`);
  return res.json();
}

export async function fetchAnalytics() {
  const res = await fetch(`${API_BASE}/analytics`);
  return res.json();
}

export async function fetchModelPerformance() {
  const res = await fetch(`${API_BASE}/model-performance`);
  return res.json();
}

export async function fetchHistory(search = '', filter = '', limit = 50, offset = 0) {
  const params = new URLSearchParams();
  if (search) params.append('search', search);
  if (filter) params.append('filter', filter);
  params.append('limit', limit);
  params.append('offset', offset);

  const res = await fetch(`${API_BASE}/history?${params.toString()}`);
  return res.json();
}

export async function clearAllHistory() {
  const res = await fetch(`${API_BASE}/history`, {
    method: 'DELETE'
  });
  return res.json();
}

export function getExportHistoryUrl() {
  return `${API_BASE}/history/export`;
}
