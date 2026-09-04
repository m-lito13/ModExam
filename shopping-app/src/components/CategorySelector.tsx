import type { Category } from '../types';
import { t } from '../i18n/t';

interface CategorySelectorProps {
  categories: Category[];
  selectedId: number | null;
  onSelect: (id: number) => void;
}

export default function CategorySelector({ categories, selectedId, onSelect }: CategorySelectorProps) {
  return (
    <div className="category-selector">
      <label className="field-label" htmlFor="category-select">
        {t('category.label')}
      </label>
      <select
        id="category-select"
        className="select"
        value={selectedId ?? ''}
        onChange={(event) => onSelect(Number(event.target.value))}
      >
        <option value="" disabled>
          {t('category.placeholder')}
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
