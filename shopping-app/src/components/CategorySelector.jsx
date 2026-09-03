export default function CategorySelector({ categories, selectedId, onSelect }) {
  return (
    <div className="category-selector">
      <label className="field-label" htmlFor="category-select">
        קטגוריה
      </label>
      <select
        id="category-select"
        className="select"
        value={selectedId ?? ''}
        onChange={(event) => onSelect(Number(event.target.value))}
      >
        <option value="" disabled>
          בחר/י קטגוריה
        </option>
        {categories.map((category) => (
          <option key={category.id} value={category.id}>
            {category.name}
          </option>
        ))}
      </select>
    </div>
  );
}
