import type { Transaction, Settings, Category } from './types';
import { supabase } from './supabaseClient';

const DEPLOYED_API_URL = 'https://finance-tracker-backend-rho.vercel.app';
const LOCAL_API_URL = 'http://localhost:5002';

const API_URL = import.meta.env.DEV ? LOCAL_API_URL : DEPLOYED_API_URL;

async function getAccessToken(): Promise<string | null> {
  const isGuest = localStorage.getItem('isGuest') === 'true';
  if (isGuest) return null;
  const { data } = await supabase.auth.getSession();
  return data.session?.access_token ?? null;
}

async function smartFetch(path: string, options?: RequestInit): Promise<Response> {
  const token = await getAccessToken();
  const isGuest = localStorage.getItem('isGuest') === 'true';
  const headers: Record<string, string> = {
    ...(options?.headers as Record<string, string> ?? {}),
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  const mergedOptions: RequestInit = { ...options, headers };
  const res = await fetch(`${API_URL}${path}`, mergedOptions);
  return res;
}

export async function fetchTransactions(): Promise<Transaction[]> {
  const res = await smartFetch('/transactions');
  const json = await res.json();
  return json.data ?? [];
}

export async function fetchSortedTransactions(sort: 'asc' | 'desc'): Promise<Transaction[]> {
  const res = await smartFetch(`/transactions?sort=${sort}`);
  const json = await res.json();
  return json.data ?? [];
}

export async function createTransaction(
  data: Omit<Transaction, 'id'>
): Promise<Transaction> {
  const res = await smartFetch('/transactions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  const json = await res.json();
  return json.data;
}

export async function updateTransaction(
  id: number,
  data: Omit<Transaction, 'id'>
): Promise<Transaction> {
  const res = await smartFetch(`/transactions/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id, ...data }),
  });
  const json = await res.json();
  return json.data;
}

export async function deleteTransactions(ids: string[]): Promise<void> {
  await smartFetch('/transactions', {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ids }),
  });
}

export async function fetchCategories(): Promise<Category[]> {
  const res = await smartFetch('/categories');
  const json = await res.json();
  return json.data ?? [];
}

export async function fetchSettings(): Promise<Settings> {
  const res = await smartFetch('/settings');
  const json = await res.json();
  const data = json.data?.[0] ?? { darkMode: false };
  return data as Settings;
}

export async function saveSettings(settings: Partial<Settings>): Promise<void> {
  await smartFetch('/settings', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(settings),
  });
}
