import { MATERIAL_KINDS, kindCounts } from '@/lib/materials';

// Type filter of the Central: the same pills as the pillar filter (.blog-pillars) with a count each, always visible.
// Server-rendered "Todos" + one button per kind that has material; public/ds.js (materialFilter) wires the clicks to the
// [data-material-list] grid that follows. Without the script every card stays visible.
export default function MaterialFilter({ materials }) {
  const counts = kindCounts(materials);
  const items = [{ kind: '', label: 'Todos', n: counts.all }, ...Object.keys(counts).filter((k) => k !== 'all').map((k) => ({ kind: k, label: MATERIAL_KINDS.find((x) => x.value === k)?.label || 'Material', n: counts[k] }))];
  return (
    <nav className="blog-pillars" data-material-filter aria-label="Filtrar por tipo">
      <ul>
        {items.map((i) => (
          <li key={i.kind || 'all'}>
            <button type="button" data-kind={i.kind} aria-pressed={i.kind === '' ? 'true' : 'false'}>
              {i.label}
              <span className="blog-pillars__n" aria-label={`${i.n} ${i.n === 1 ? 'material' : 'materiais'}`}>{i.n}</span>
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}
