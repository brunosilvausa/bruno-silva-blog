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
