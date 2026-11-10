'use client';
import { useEffect, useRef } from 'react';
import { PILLARS } from '@/lib/pillars';

/**
 * Pillar filter for phones and small tablets (the NavBar hides its pillar links below 720px):
 * a sideways-scrolling row of "Todos" + the four pillars. The current one is highlighted and
 * scrolled into view. `current` is the active href ("/" or "/pilar/<slug>").
 */
export default function PillarTabs({ current = '/', label = 'Filtrar por pilar', counts = {} }) {
  const row = useRef(null);
  const items = [{ href: '/', label: 'Todos', n: counts.all }, ...PILLARS.map((p) => ({ href: `/pilar/${p.slug}`, label: p.label, n: counts[p.value] }))];

  useEffect(() => {
    const ul = row.current;
    const active = ul?.querySelector('[aria-current="page"]');
    // Scroll only the row (never the page) so the active pillar is visible.
    if (ul && active) ul.scrollLeft = Math.max(0, active.parentElement.offsetLeft - 24);
  }, [current]);

  return (
    <nav className="blog-pillars" aria-label={label}>
      <ul ref={row}>
        {items.map((i) => (
          <li key={i.href}>
            <a href={i.href} aria-current={i.href === current ? 'page' : undefined}>
              {i.label}
              {Number.isFinite(i.n) ? <span className="blog-pillars__n" aria-label={`${i.n} ${i.n === 1 ? 'post' : 'posts'}`}>{i.n}</span> : null}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
