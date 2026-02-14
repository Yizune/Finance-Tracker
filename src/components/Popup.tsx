import { useState, useEffect } from 'react';
import type { Transaction, PopupMode, Category } from '../types';

interface Props {
  mode: PopupMode;
  onClose: () => void;
  categories: Category[];
  editTransaction?: Transaction | null;
  onAdd: (data: Omit<Transaction, 'id'>) => void;
  onEdit: (data: Omit<Transaction, 'id'>) => void;
  onConfirmRemove: () => void;
  removeMessage?: string;
}

interface FormErrors {
  type?: string;
  amount?: string;
  category?: string;
  date?: string;
}

export default function Popup({
  mode,
  onClose,
  categories,
  editTransaction,
  onAdd,
  onEdit,
  onConfirmRemove,
  removeMessage,
}: Props) {
  const [type, setType] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState('');
  const [description, setDescription] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});

  useEffect(() => {
    if (mode === 'edit' && editTransaction) {
      setType(editTransaction.type);
      setAmount(String(editTransaction.amount));
      setCategory(editTransaction.category);
      setDate(editTransaction.date);
      setDescription(editTransaction.description);
      setErrors({});
    } else if (mode === 'add') {
      setType('');
      setAmount('');
      setCategory('');
      setDate('');
      setDescription('');
      setErrors({});
    }
  }, [mode, editTransaction]);

  if (!mode) return null;

  function validate(): boolean {
    const e: FormErrors = {};
    if (!type) e.type = 'Please select a Type';
    const numVal = parseFloat(amount);
    if (!amount.trim()) e.amount = 'Amount is required';
    else if (isNaN(numVal)) e.amount = 'Please enter a valid number';
    else if (numVal <= 0) e.amount = 'Amount must be a positive number';
    if (!category) e.category = 'Please select a Category';
    if (!date) e.date = 'Date is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleSubmit() {
    if (!validate()) return;
    const data: Omit<Transaction, 'id'> = {
      type: type as 'income' | 'expense',
      amount: parseFloat(amount),
      category,
      date,
      description,
    };
    if (mode === 'add') onAdd(data);
    else if (mode === 'edit') onEdit(data);
  }

  const title =
    mode === 'add'
      ? 'Add Transaction'
      : mode === 'edit'
      ? 'Edit Transaction'
      : 'Remove Transaction';

  return (
    <div className="popup" style={{ display: 'flex' }}>
      <div className="popup-content">
        <h2 id="popupTitle">{title}</h2>

        {(mode === 'add' || mode === 'edit') && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit();
            }}
          >
            <label>Type</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className={errors.type ? 'has-error' : ''}
            >
              <option value="" disabled>
                Select Type
              </option>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
            <span className="error-text">{errors.type ?? ''}</span>

            <label>Amount</label>
            <input
              type="text"
              placeholder="Amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className={errors.amount ? 'has-error' : ''}
            />
            <span className="error-text">{errors.amount ?? ''}</span>

            <label>Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className={errors.category ? 'has-error' : ''}
            >
              <option value="" disabled>
                Select Category
              </option>
              {categories.map((c) => (
                <option key={c.category} value={c.category}>
                  {c.category}
                </option>
              ))}
            </select>
            <span className="error-text">{errors.category ?? ''}</span>

            <label>Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className={errors.date ? 'has-error' : ''}
            />
            <span className="error-text">{errors.date ?? ''}</span>

            <label>Description (Optional)</label>
            <textarea
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <div className="actions">
              <button type="submit">Confirm</button>
              <button type="button" onClick={onClose}>
                Cancel
              </button>
            </div>
          </form>
        )}

        {mode === 'remove' && (
          <div>
            <p id="confirmationText">{removeMessage ?? 'Are you sure you want to proceed?'}</p>
            <div className="actions">
              <button type="button" onClick={onConfirmRemove}>
                Yes
              </button>
              <button type="button" onClick={onClose}>
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
