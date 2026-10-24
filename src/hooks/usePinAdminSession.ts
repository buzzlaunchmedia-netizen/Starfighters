import { useCallback, useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { adminApi } from '@/lib/api';

export function usePinAdminSession() {
  const query = useQueryClient();
  const [unlocked, setUnlocked] = useState(() => Boolean(sessionStorage.getItem('sf-pin-admin-token')) && Date.parse(sessionStorage.getItem('sf-pin-admin-expires') || '') > Date.now());
  const [busy, setBusy] = useState(false);
  const lock = useCallback(() => {
    sessionStorage.removeItem('sf-pin-admin-token');
    sessionStorage.removeItem('sf-pin-admin-expires');
    setUnlocked(false);
    query.removeQueries({ queryKey: ['admin-data'] });
  }, [query]);
  const unlock = useCallback(() => {
    query.removeQueries({ queryKey: ['admin-data'] });
    setUnlocked(true);
  }, [query]);
  useEffect(() => {
    if (!unlocked) return;
    const remaining = Date.parse(sessionStorage.getItem('sf-pin-admin-expires') || '') - Date.now();
    if (!Number.isFinite(remaining) || remaining <= 0) { lock(); return; }
    const timeout = window.setTimeout(lock, remaining);
    return () => window.clearTimeout(timeout);
  }, [unlocked, lock]);
  const logout = useCallback(() => {
    setBusy(true);
    adminApi('logout').then(() => {
      toast.success('Administrator session ended.');
    }).catch((error: Error) => {
      toast.error(`${error.message} Local access has been cleared.`);
    }).finally(() => { lock(); setBusy(false); });
  }, [lock]);
  return { unlocked, busy, unlock, lock, logout };
}
