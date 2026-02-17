import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react';
import type { Transaction, Category, Settings } from './types';
import type { User } from '@supabase/supabase-js';
import { supabase } from './supabaseClient';
import * as api from './api';

interface AppState {
  transactions: Transaction[];
  categories: Category[];
  settings: Settings;
  darkMode: boolean;
  loading: boolean;

  user: User | null;
  isGuest: boolean;

  setTransactions: (t: Transaction[]) => void;
  addTransaction: (t: Transaction) => void;
  removeTransactions: (ids: string[]) => void;
  updateTransaction: (t: Transaction) => void;
  toggleDarkMode: () => void;
  reload: () => Promise<void>;
  logout: () => Promise<void>;
  setIsGuest: (guest: boolean) => void;
  refreshUser: () => Promise<void>;
}

const AppContext = createContext<AppState | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [settings, setSettings] = useState<Settings>({ darkMode: false });
  const [loading, setLoading] = useState(true);

  const [user, setUser] = useState<User | null>(null);
  const [isGuest, setIsGuest] = useState(localStorage.getItem('isGuest') === 'true');
  const [authReady, setAuthReady] = useState(false);

  const [darkMode, setDarkModeState] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : false;
  });

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setAuthReady(true);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      const newUser = session?.user ?? null;
      setUser(prev => {
        if (prev?.id === newUser?.id) return prev;
        return newUser;
      });
      if (session?.user) {
        setIsGuest(false);
        localStorage.removeItem('isGuest');
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    document.body.classList.toggle('darkmode', darkMode);
  }, [darkMode]);

  const reload = useCallback(async () => {
    setLoading(true);
    try {
      const [txns, cats, sett] = await Promise.all([
        api.fetchTransactions(),
        api.fetchCategories(),
        api.fetchSettings(),
      ]);
      setTransactions(txns);
      setCategories(cats);
      setSettings(sett);
      if (user) {
        setDarkModeState(sett.darkMode);
        localStorage.setItem('darkMode', JSON.stringify(sett.darkMode));
      }
    } catch (err) {
      console.error('Failed to load data:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (authReady) {
      if (user || isGuest) {
        reload();
      } else {
        setLoading(false);
      }
    }
  }, [authReady, user, isGuest, reload]);

  const addTransaction = useCallback((t: Transaction) => {
    setTransactions((prev) => [...prev, t]);
  }, []);

  const removeTransactions = useCallback((ids: string[]) => {
    setTransactions((prev) =>
      prev.filter((t) => !ids.includes(String(t.id)))
    );
  }, []);

  const updateTransactionState = useCallback((updated: Transaction) => {
    setTransactions((prev) =>
      prev.map((t) => (t.id === updated.id ? updated : t))
    );
  }, []);

  const toggleDarkMode = useCallback(() => {
    setDarkModeState((prev: boolean) => {
      const next = !prev;
      localStorage.setItem('darkMode', JSON.stringify(next));
      setSettings((s) => ({ ...s, darkMode: next }));
      if (user) {
        api.saveSettings({ darkMode: next }).catch(console.error);
      }
      return next;
    });
  }, [user]);

  const refreshUser = useCallback(async () => {
    const { data: { user: updated } } = await supabase.auth.getUser();
    setUser(updated);
  }, []);

  const logout = useCallback(async () => {
    await supabase.auth.signOut();
    localStorage.removeItem('isGuest');
    localStorage.removeItem('sb_access_token');
    setUser(null);
    setIsGuest(false);
    setTransactions([]);
    setSettings((s) => ({ ...s, darkMode: darkMode }));
  }, [darkMode]);

  return (
    <AppContext.Provider
      value={{
        transactions,
        categories,
        settings,
        darkMode,
        loading,
        user,
        isGuest,
        setTransactions,
        addTransaction,
        removeTransactions,
        updateTransaction: updateTransactionState,
        toggleDarkMode,
        reload,
        logout,
        setIsGuest,
        refreshUser,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp(): AppState {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
