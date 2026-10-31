export function SearchBar({ value, onChange, placeholder = 'Search products...' }) {
  return (
    <div className="search-wrap">
      <span className="search-icon">⌕</span>
      <input
        type="text"
        aria-label="Search products"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
      />
    </div>
  )
}
