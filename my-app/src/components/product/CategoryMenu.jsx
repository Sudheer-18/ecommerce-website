export function CategoryMenu({ categories, selected, onSelect }) {
  return (
    <div className="category-strip">
      <button type="button" className={`chip ${selected === 'All' ? 'active' : ''}`} onClick={() => onSelect('All')}>
        All deals
      </button>

      {categories.map((category) => (
        <button
          key={category}
          type="button"
          className={`chip ${selected === category ? 'active' : ''}`}
          onClick={() => onSelect(category)}
        >
          {category}
        </button>
      ))}
    </div>
  )
}
