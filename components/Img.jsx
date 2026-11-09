// Intrinsic sizes of the files in public/img, so the browser reserves the space before they load (no layout shift).
// After replacing an image with one of a different shape, update its size here.
const SIZES = { '/img/avatar.webp': [640, 640], '/img/icon-empreendedorismo.png': [87, 90], '/img/icon-impacto-global.png': [97, 97], '/img/icon-inovacao.png': [101, 90], '/img/icon-tecnologia.png': [101, 98], '/img/monogram.png': [240, 158] };

/** <img> with width/height filled in from SIZES. `lazy` defers images below the fold. */
export default function Img({ src, lazy = false, ...props }) {
  const [width, height] = SIZES[src] || [];
  return <img src={src} width={width} height={height} loading={lazy ? 'lazy' : undefined} decoding="async" {...props} />;
}
