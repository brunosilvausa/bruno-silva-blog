/**
 * DS Ticker: an endless row of big outlined words (here, the four pillars as links). The script in public/ds.js
 * adds the copies, moves it with the scroll and stops it under the pointer or keyboard focus.
 */
export default function Ticker({ items, label, speed = 40, direction }) {
  return (
    <div className="bs-ticker" role="region" aria-label={label} data-speed={speed} data-direction={direction}>
      <div className="bs-ticker__track">
        <ul className="bs-ticker__group">
          {items.map((i) => (
            <li key={i.href || i.label}>
              {i.href ? <a className="bs-ticker__item" href={i.href}>{i.label}</a> : <span className="bs-ticker__item">{i.label}</span>}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
