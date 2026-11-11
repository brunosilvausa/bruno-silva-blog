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

  return (
    <div className="bs-callout blog-prompt">
      <b>{value.title?.trim() || 'Prompt'}</b>
      <div className="blog-prompt__text">{value.text}</div>
      <div className="blog-prompt__actions">
        <button type="button" className="bs-btn bs-btn--outline bs-btn--sm" onClick={copy}>
          Copiar prompt
        </button>
        <span className="blog-prompt__status" role="status">{status}</span>
      </div>
    </div>
  );
}
