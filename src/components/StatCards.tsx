import type { Transaction } from '../types';

interface Props {
  transactions: Transaction[];
}

export default function StatCards({ transactions }: Props) {
  const incomeTotal = transactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const expensesTotal = transactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const balanceTotal = incomeTotal - expensesTotal;

  return (
    <div className="cards container">
      <div className="card income">
        <h4>Total Income</h4>
        <p className="income-total">{incomeTotal}</p>
      </div>
      <div className="card balance">
        <h4>Balance</h4>
        <p className="balance-total">{balanceTotal}</p>
      </div>
      <div className="card expenses">
        <h4>Total Expenses</h4>
        <p className="expense-total">{expensesTotal}</p>
      </div>
    </div>
  );
}
