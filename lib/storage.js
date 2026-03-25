'use client';
import { useState, useEffect, useRef } from 'react';

export function usePersist(key, fallback) {
  const [data, setData] = useState(fallback);
  const [ready, setReady] = useState(false);
  const timer = useRef(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(key);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed !== null && parsed !== undefined) setData(parsed);
      }
    } catch {}
    setReady(true);
  }, [key]);

  useEffect(() => {
    if (!ready) return;
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      try { localStorage.setItem(key, JSON.stringify(data)); } catch {}
    }, 250);
    return () => { if (timer.current) clearTimeout(timer.current); };
  }, [data, ready, key]);

  return [data, setData, ready];
}
