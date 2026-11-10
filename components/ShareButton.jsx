'use client';
import { useEffect, useRef, useState } from 'react';

/**
 * "Compartilhar": opens the phone's share sheet (WhatsApp, Instagram, e-mail…) where the browser
 * supports it; elsewhere copies the link and says so.
 */
export default function ShareButton({ url, title, text }) {
  const [status, setStatus] = useState('');
  const timer = useRef(null);
  useEffect(() => () => clearTimeout(timer.current), []);

  const flash = (message) => {
    setStatus(message);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setStatus(''), 2500);
  };

  async function share() {
    if (navigator.share) {
      try {
        await navigator.share({ title, text, url });
        return;
      } catch (e) {
        if (e?.name === 'AbortError') return; // the reader closed the share sheet
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      flash('Link copiado');
    } catch {
      flash('Copie o endereço na barra do navegador');
    }
  }

  return (
    <>
      <button type="button" className="bs-btn bs-btn--outline bs-btn--sm" onClick={share}>
        <svg className="bs-btn__icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 13v6a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-6M12 3v12M7 8l5-5 5 5" /></svg>
        Compartilhar
      </button>
      <span className="blog-share__status" role="status">{status}</span>
    </>
  );
}
