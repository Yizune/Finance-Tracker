import type { Category, SortOrder } from '../types';
import searchIcon from '/Images/search_24dp_FFFFFF_FILL0_wght400_GRAD0_opsz24.svg';

interface Props {
  search: string;
  onSearchChange: (v: string) => void;
  typeFilter: string;
  onTypeChange: (v: string) => void;
  categoryFilter: string;
  onCategoryChange: (v: string) => void;
  sortOrder: SortOrder;
  onSortChange: (v: SortOrder) => void;
  categories: Category[];
  anyFilterActive: boolean;
  onClear: () => void;
  onAdd: () => void;
  onRemove: () => void;
  onEdit: () => void;
  selectedCount: number;
}

export default function Filters({
  search,
  onSearchChange,
  typeFilter,
  onTypeChange,
  categoryFilter,
  onCategoryChange,
  sortOrder,
  onSortChange,
  categories,
  anyFilterActive,
  onClear,
  onAdd,
  onRemove,
  onEdit,
  selectedCount,
}: Props) {
  return (
    <div className="filters buttons container">
      <div className="filter-controls-row">
        <div className="search-filter">
          <div className="input-wrapper">
            <img src={searchIcon} alt="search icon" className="search-icon" />
            <input
              className="input"
              placeholder="Search transactions..."
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>
        </div>
        <div className="category-filter">
          <select
            name="type"
            id="type"
            value={typeFilter}
            onChange={(e) => onTypeChange(e.target.value)}
          >
            <option value="ignore">Search by Type</option>
            <option value="Expenses">Expense</option>
            <option value="Income">Income</option>
          </select>

          <select
            name="categories"
            id="categories"
            value={categoryFilter}
            onChange={(e) => onCategoryChange(e.target.value)}
          >
            <option value="ignore">Search by Category</option>
            {categories.map((c) => (
              <option key={c.category} value={c.category}>
                {c.category}
              </option>
            ))}
          </select>

          <select
            name="amount"
            id="amount"
            value={sortOrder}
            onChange={(e) => onSortChange(e.target.value as SortOrder)}
          >
            <option value="ignore">Filter Options</option>
            <option value="ascAmount">Sort by Ascending Amount</option>
            <option value="descAmount">Sort by Descending Amount</option>
          </select>
        </div>
      </div>
      <div className="filter-buttons">
        <div className="clear">
          <button
            className={!anyFilterActive ? 'disabled' : ''}
            disabled={!anyFilterActive}
            onClick={onClear}
          >
            Clear All
          </button>
        </div>
        <div className="add-selected">
          <button onClick={onAdd}>Add Transaction</button>
        </div>
        <div className="remove-selected">
          <button
            className={selectedCount === 0 ? 'disabled' : ''}
            disabled={selectedCount === 0}
            onClick={onRemove}
          >
            Remove Selected
          </button>
        </div>
        <div className="edit-selected">
          <button
            className={selectedCount !== 1 ? 'disabled' : ''}
            disabled={selectedCount !== 1}
            onClick={onEdit}
          >
            Edit Selected
          </button>
        </div>
      </div>
    </div>
  );
}
