/** DS CodeDivider: volt rules and dots closing on a glowing </> glyph. Decorative. */
export default function CodeDivider({ className = '' }) {
  const dots = <span className="dots"><i /><i /><i /><i /></span>;
  return (
    <div className={`bs-divider ${className}`.trim()} aria-hidden="true">
      <span className="rule dim" /><span className="rule" />
      {dots}
      <code>&lt;/&gt;</code>
      {dots}
      <span className="rule" /><span className="rule dim" />
    </div>
  );
}
