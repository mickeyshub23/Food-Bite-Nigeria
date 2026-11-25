const CategoryChip = ({ name, count, onClick, active = false }) => (
  <button
    onClick={onClick}
    className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-pill text-xs font-label font-semibold transition-colors border border-transparent ${active ? 'bg-rust text-white' : 'bg-warm_off_white text-dark_gray hover:bg-gray-100'}`}
  >
    {name}
    {count !== undefined && <span className="text-[0.65rem] opacity-70">{count}</span>}
  </button>
);

export default CategoryChip;