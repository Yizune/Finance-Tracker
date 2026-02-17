import { type Dispatch, type SetStateAction } from 'react';
import type { Transaction } from '../types';

interface Props {
  data: Transaction[];
  selectedIds: Set<number>;
  setSelectedIds: Dispatch<SetStateAction<Set<number>>>;
}

export default function TransactionTable({ data, selectedIds, setSelectedIds }: Props) {
  const toggleRow = (id: number) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  if (!data || data.length === 0) {
    return (
      <div className="tableOne container">
        <table id="transactionsTable">
          <thead>
            <tr>
              <th>ID</th>
              <th>Type</th>
              <th>Amount</th>
              <th>Category</th>
              <th>Date</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr className="empty-state-row">
              <td colSpan={6} className="empty-state-cell">
                <div className="empty-content">
                  <h3>No Transactions Yet</h3>
                  <p>Start tracking your finances by adding your first transaction.</p>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <div className="tableOne container">
      <table id="transactionsTable">
        <thead>
          <tr>
            <th>ID</th>
            <th>Type</th>
            <th>Amount</th>
            <th>Category</th>
            <th>Date</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          {data.map((t) => (
            <tr
              key={t.id}
              className={selectedIds.has(t.id) ? 'selected' : ''}
              onClick={() => toggleRow(t.id)}
            >
              <td>{t.id}</td>
              <td style={{ color: t.type === 'income' ? 'green' : 'red' }}>{t.type}</td>
              <td>{t.amount}</td>
              <td>{t.category}</td>
              <td>{t.date}</td>
              <td>{t.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
