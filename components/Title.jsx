// Título com destaque em volt: { before, em, after }.
export default function Title({ value }) {
  return (
    <>
      {value.before}
      {value.em ? <em>{value.em}</em> : null}
      {value.after}
    </>
  );
}
