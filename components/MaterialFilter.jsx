// Type filter of the Central list. Empty and hidden on the server: public/ds.js (materialFilter) fills it with "Todos" plus
// one button per type present in the list and shows it, so without the script the whole list is visible.
export default function MaterialFilter() {
  return <div className="bs-matfilter" data-material-filter hidden role="group" aria-label="Filtrar por tipo" />;
}
