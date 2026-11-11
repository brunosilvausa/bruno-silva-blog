'use client';

import { useState } from 'react';

export default function PromptBlock({ value }) {
  const [status, setStatus] = useState('');

  if (typeof value?.text !== 'string' || !value.text.trim()) return null;

  async function copy() {
    setStatus('');
    try {
      await navigator.clipboard.writeText(value.text);
      setStatus('Copiado!');
    } catch {
      setStatus('Não foi possível copiar. Tente novamente.');
    }
  }

  const label = value.title?.trim() || value.label?.trim() || 'Prompt';

  return (
    <div className="bs-prompt blog-prompt" role="group" aria-label={label} data-prompt-managed="react">
      <div className="bs-prompt__head">
        <span className="bs-prompt__label">{label}</span>
        <button type="button" className={`bs-prompt__copy${status === 'Copiado!' ? ' is-done' : ''}`} onClick={copy}>
          <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="9" y="9" width="11" height="11" rx="1" /><path d="M5 15V5a1 1 0 0 1 1-1h10" /></svg>
          <span className="bs-prompt__copy-label">{status === 'Copiado!' ? 'Copiado!' : 'Copiar prompt'}</span>
        </button>
      </div>
      <div className="bs-prompt__text blog-prompt__text">{value.text}</div>
      <div className="blog-prompt__status" role="status">{status}</div>
    </div>
  );
}
