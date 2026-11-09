export default function DemoNote({ note }) {
  if (!note) return null;
  return (
    <div className="demo-note" role="note"><b>{note.label}</b>{note.text}</div>
  );
}
