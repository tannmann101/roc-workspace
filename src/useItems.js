import { useState, useEffect, useCallback } from 'react';
import { collection, onSnapshot, doc, addDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from './firebase.js';

const ITEMS_REF = collection(db, 'items');

// Live sync, not refresh-on-open: every field edit in this app (checking
// off a task, picking a planning day, typing in a profile field) should
// show up for both of you without a manual refresh, unlike the lighter
// weekly-triage tool this pattern was borrowed from.
export function useItems(enabled) {
  const [items, setItems] = useState(null);
  const [status, setStatus] = useState('loading'); // loading | ready | forbidden | error

  useEffect(() => {
    if (!enabled) return undefined;
    const unsubscribe = onSnapshot(
      ITEMS_REF,
      (snap) => {
        setItems(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
        setStatus('ready');
      },
      (err) => {
        console.error('Failed to sync items', err);
        setStatus(err.code === 'permission-denied' ? 'forbidden' : 'error');
      },
    );
    return unsubscribe;
  }, [enabled]);

  const addItem = useCallback(async (fields) => {
    await addDoc(ITEMS_REF, { ...fields, createdAt: Date.now(), updatedAt: Date.now() });
  }, []);

  // Accepts either a plain object of fields to merge, or an updater
  // function (item) => partialFields, resolved against the current local
  // copy of the item -- callers don't need to know or care that the
  // source of truth moved from local state to Firestore.
  const patchItem = useCallback(
    async (id, patch) => {
      const current = (items || []).find((item) => item.id === id);
      if (!current) return;
      const resolved = typeof patch === 'function' ? patch(current) : patch;
      await updateDoc(doc(ITEMS_REF, id), { ...resolved, updatedAt: Date.now() });
    },
    [items],
  );

  const removeItem = useCallback(async (id) => {
    await deleteDoc(doc(ITEMS_REF, id));
  }, []);

  return { items, status, addItem, patchItem, removeItem };
}
