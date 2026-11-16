import { formatDate } from './format.js';

// Tipos de material da Central de Conteúdo. Usado pelo site e pelo Studio (lista do campo `kind`).
export const MATERIAL_KINDS = [
  { value: 'prompt', label: 'Prompt' },
  { value: 'passo-a-passo', label: 'Passo a passo' },
  { value: 'checklist', label: 'Checklist' },
  { value: 'guia', label: 'Guia' },
];

/** Kicker of a material page: "Prompt • 2 min", or just "Prompt" when there is no reading time. */
export function materialKicker(kind, minutes) {
  const label = MATERIAL_KINDS.find((k) => k.value === kind)?.label || 'Material';
  return typeof minutes === 'number' && Number.isFinite(minutes) && minutes > 0 ? `${label} • ${minutes} min` : label;
}

const ACCENTS = { prompt: '#4fd8ff', checklist: '#ff5fa8' };

/** Accent colour of a material kind (cover fallback gradient, chips). Guia, Passo a passo and unknown kinds use volt. */
export function kindAccent(kind) {
  return ACCENTS[kind] || '#e1fa03';
}

/** "DD/MM" of a date or ISO timestamp (as published, UTC), or '' when invalid. */
export function shortDate(isoDate) {
  const d = new Date(isoDate);
  if (!isoDate || Number.isNaN(d.getTime())) return '';
  return `${String(d.getUTCDate()).padStart(2, '0')}/${String(d.getUTCMonth() + 1).padStart(2, '0')}`;
}

/** Label of a material kind ("Prompt"), or "Material" for unknown kinds. */
export function kindLabel(kind) {
  return MATERIAL_KINDS.find((k) => k.value === kind)?.label || 'Material';
}

/** Counts for the Central filter: { all, [kind]: n } with the kinds that have material, in MATERIAL_KINDS order (unknown kinds last). */
export function kindCounts(materials) {
  const n = {};
  for (const m of materials) n[m.kind] = (n[m.kind] || 0) + 1;
  const known = MATERIAL_KINDS.map((k) => k.value).filter((k) => n[k]);
  const extra = Object.keys(n).filter((k) => !known.includes(k));
  const out = { all: materials.length };
  for (const k of [...known, ...extra]) out[k] = n[k];
  return out;
}

/** " · ▸ Vídeo" when the material has a video, else ''. */
export function videoSuffix(material) {
  return material?.videoUrl ? ' · ▸ Vídeo' : '';
}

/** Meta line of a material card: the date as in posts, plus "· ▸ Vídeo" only when there is a video. */
export function materialMeta(material) {
  return `${formatDate(material.publishedAt)}${videoSuffix(material)}`;
}

/** A material page shows "Neste material" from this many H2 sections. */
export const MATERIAL_TOC_MIN = 2;
