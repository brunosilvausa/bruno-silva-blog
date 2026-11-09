// The four content pillars, in brand order. `value` is what the Studio stores on each post; `slug` is the URL.
export const PILLARS = [
  { value: 'tecnologia', slug: 'tecnologia', label: 'Tecnologia', icon: '/img/icon-tecnologia.png' },
  { value: 'empreendedorismo', slug: 'empreendedorismo', label: 'Empreendedorismo', icon: '/img/icon-empreendedorismo.png' },
  { value: 'inovacao', slug: 'inovacao', label: 'Inovação', icon: '/img/icon-inovacao.png' },
  { value: 'impacto-global', slug: 'impacto-global', label: 'Impacto Global', icon: '/img/icon-impacto-global.png' },
];

/** @returns {typeof PILLARS[number] | undefined} */
export function pillarBySlug(slug) {
  return PILLARS.find((p) => p.slug === slug);
}

/** Pillar of a post; unknown values fall back to the first pillar so a card never breaks. */
export function pillarOf(value) {
  return PILLARS.find((p) => p.value === value) || PILLARS[0];
}
