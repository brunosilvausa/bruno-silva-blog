'use client';

import { useEffect, useRef, useState } from 'react';
import { EMAIL_MAX_LENGTH, normalizeEmail } from '@/lib/email';

const DONE_EVENT = 'bs:subscribed';
const MESSAGES = {
  empty: 'Digite o seu e-mail.',
  invalid: 'Esse e-mail parece incompleto. Confira e tente de novo.',
  failed: 'Não deu certo agora. Tente de novo em instantes.',
};

/**
 * Design-system EmailCapture wired to /api/subscribe.
 * Every EmailForm on the page switches to the success message together.
 *
 * @param {{ id: string, label?: string, button: string, note: string, orbit?: boolean, anchorId?: string }} props
 */
export default function EmailForm({ id, label = 'Seu melhor e-mail', button, note, orbit = false, anchorId }) {
  const [status, setStatus] = useState('idle'); // idle | sending | done
  const [error, setError] = useState('');
  const [demo, setDemo] = useState(false);
  const inputRef = useRef(null);
  const successRef = useRef(null);
  const submittedHere = useRef(false);
  const sending = useRef(false);

  useEffect(() => {
    const onDone = (event) => { setDemo(Boolean(event.detail?.demo)); setStatus('done'); };
    window.addEventListener(DONE_EVENT, onDone);
    return () => window.removeEventListener(DONE_EVENT, onDone);
  }, []);

  useEffect(() => {
    if (status === 'done' && submittedHere.current) successRef.current?.focus();
  }, [status]);

  async function onSubmit(event) {
    event.preventDefault();
    // A ref, not state: state from this render is stale if the form is submitted twice before React re-renders.
    if (sending.current) return;
    const fields = new FormData(event.currentTarget);
    const typed = String(fields.get('email') ?? '').trim();
    if (!typed) return fail(MESSAGES.empty);
    const email = normalizeEmail(typed);
    if (!email) return fail(MESSAGES.invalid);
    setError('');
    setStatus('sending');
    sending.current = true;
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, website: String(fields.get('website') ?? '') }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.ok) {
        setStatus('idle');
        return fail(data.error === 'email' ? MESSAGES.invalid : MESSAGES.failed);
      }
      submittedHere.current = true;
      window.dispatchEvent(new CustomEvent(DONE_EVENT, { detail: { demo: Boolean(data.demo) } }));
    } catch {
      setStatus('idle');
      fail(MESSAGES.failed);
    } finally {
      sending.current = false;
    }
  }

  function fail(message) {
    setError(message);
    inputRef.current?.focus();
  }

  if (status === 'done') {
    return (
      <div className="bs-capture" id={anchorId}>
        <div className="bs-capture__success" role="status" tabIndex={-1} ref={successRef}>
          <b>Pronto!</b> Você está na lista.
        </div>
        <p className="bs-capture__note">{demo ? 'Exemplo: nenhum e-mail foi enviado ou guardado.' : 'Confira sua caixa de entrada.'}</p>
      </div>
    );
  }

  const buttonEl = (
    <button className="bs-btn bs-btn--primary" type="submit" aria-busy={status === 'sending' ? 'true' : undefined}>
      {button}
    </button>
  );

  return (
    <form className="bs-capture" id={anchorId} onSubmit={onSubmit} noValidate>
      <div className="bs-capture__row">
        <div className={`bs-field${error ? ' bs-field--error' : ''}`}>
          <label className="bs-field__label" htmlFor={id}>{label}</label>
          <input
            ref={inputRef}
            className="bs-field__input"
            id={id}
            name="email"
            type="email"
            autoComplete="email"
            maxLength={EMAIL_MAX_LENGTH}
            placeholder="voce@exemplo.com"
            aria-invalid={error ? 'true' : undefined}
            aria-describedby={`${id}-erro`}
            onInput={() => error && setError('')}
          />
        </div>
        {orbit ? <div className="bs-orbit bs-orbit--inline">{buttonEl}</div> : buttonEl}
      </div>
      <span className="bs-field__error" id={`${id}-erro`} aria-live="assertive">{error}</span>
      {/* Honeypot for bots; hidden from people and screen readers. */}
      <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" style={{ position: 'absolute', left: '-9999px' }} />
      <p className="bs-capture__note">{note}</p>
    </form>
  );
}
