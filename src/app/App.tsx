import { useState, useMemo, useEffect } from 'react';
import { Wallet, TrendingUp, TrendingDown, Plus, LayoutDashboard } from 'lucide-react';
import { SummaryCard } from './components/SummaryCard';
import { TransactionList } from './components/TransactionList';
import { BalanceChart } from './components/BalanceChart';
import { SpendingChart } from './components/SpendingChart';
import { InsightsPanel } from './components/InsightsPanel';
import { RoleSelector } from './components/RoleSelector';
import { AddTransactionModal } from './components/AddTransactionModal';
import { ThemeToggle } from './components/ThemeToggle';
import { Transaction } from './types';

export default function App() {
  const [role, setRole] = useState<'viewer' | 'admin'>('admin');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | undefined>();
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const [transactions, setTransactions] = useState<Transaction[]>([
    { id: '1', description: 'Monthly Salary', amount: 5000, category: 'Salary', type: 'income', date: '2026-03-01' },
    { id: '2', description: 'Freelance Project', amount: 1500, category: 'Freelance', type: 'income', date: '2026-03-15' },
    { id: '3', description: 'Grocery Shopping', amount: 234.50, category: 'Food', type: 'expense', date: '2026-03-05' },
    { id: '4', description: 'Uber Rides', amount: 45.20, category: 'Transport', type: 'expense', date: '2026-03-08' },
    { id: '5', description: 'Netflix Subscription', amount: 15.99, category: 'Entertainment', type: 'expense', date: '2026-03-10' },
    { id: '6', description: 'Amazon Order', amount: 189.99, category: 'Shopping', type: 'expense', date: '2026-03-12' },
    { id: '7', description: 'Electricity Bill', amount: 120.00, category: 'Bills', type: 'expense', date: '2026-03-14' },
    { id: '8', description: 'Restaurant Dinner', amount: 78.50, category: 'Food', type: 'expense', date: '2026-03-16' },
    { id: '9', description: 'Gas Station', amount: 55.00, category: 'Transport', type: 'expense', date: '2026-03-18' },
    { id: '10', description: 'Movie Tickets', amount: 32.00, category: 'Entertainment', type: 'expense', date: '2026-03-20' },
    { id: '11', description: 'Clothing Store', amount: 156.75, category: 'Shopping', type: 'expense', date: '2026-03-22' },
    { id: '12', description: 'Doctor Visit', amount: 85.00, category: 'Healthcare', type: 'expense', date: '2026-03-25' },
    { id: '13', description: 'Investment Return', amount: 320.00, category: 'Investment', type: 'income', date: '2026-03-28' },
    { id: '14', description: 'Coffee Shop', amount: 24.50, category: 'Food', type: 'expense', date: '2026-03-30' },
    { id: '15', description: 'Monthly Salary', amount: 5000, category: 'Salary', type: 'income', date: '2026-04-01' },
  ]);

  const handleAddTransaction = (transaction: Omit<Transaction, 'id'>) => {
    if (editingTransaction) {
      setTransactions(transactions.map(t =>
        t.id === editingTransaction.id
          ? { ...transaction, id: editingTransaction.id }
          : t
      ));
      setEditingTransaction(undefined);
    } else {
      const newTransaction: Transaction = {
        ...transaction,
        id: Date.now().toString(),
      };
      setTransactions([...transactions, newTransaction]);
    }
  };

  const handleEditTransaction = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setIsModalOpen(true);
  };

  const totalIncome = useMemo(() => {
    return transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
  }, [transactions]);

  const totalExpenses = useMemo(() => {
    return transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
  }, [transactions]);

  const balance = totalIncome - totalExpenses;

  const balanceData = [
    { month: 'Oct', balance: 8500 },
    { month: 'Nov', balance: 9200 },
    { month: 'Dec', balance: 8800 },
    { month: 'Jan', balance: 10100 },
    { month: 'Feb', balance: 10500 },
    { month: 'Mar', balance: balance },
  ];

  const spendingData = useMemo(() => {
    const categoryTotals: { [key: string]: number } = {};

    transactions
      .filter(t => t.type === 'expense')
      .forEach(t => {
        categoryTotals[t.category] = (categoryTotals[t.category] || 0) + t.amount;
      });

    return Object.entries(categoryTotals)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [transactions]);

  const insights = useMemo(() => {
    const highestCategory = spendingData[0];
    const currentMonthExpenses = transactions
      .filter(t => t.type === 'expense' && t.date.startsWith('2026-04'))
      .reduce((sum, t) => sum + t.amount, 0);
    const lastMonthExpenses = transactions
      .filter(t => t.type === 'expense' && t.date.startsWith('2026-03'))
      .reduce((sum, t) => sum + t.amount, 0);
    const monthlyChange = ((currentMonthExpenses - lastMonthExpenses) / lastMonthExpenses * 100);

    return [
      {
        title: 'Highest Spending Category',
        value: highestCategory?.name || 'N/A',
        description: `You've spent $${highestCategory?.value.toFixed(2) || 0} on ${highestCategory?.name || 'this category'} this period`,
        type: 'neutral' as const,
        icon: 'alert' as const,
      },
      {
        title: 'Monthly Comparison',
        value: `${monthlyChange > 0 ? '+' : ''}${monthlyChange.toFixed(1)}%`,
        description: monthlyChange > 0
          ? 'Your spending increased compared to last month'
          : 'Your spending decreased compared to last month',
        type: monthlyChange > 0 ? 'negative' as const : 'positive' as const,
        icon: monthlyChange > 0 ? 'trending-up' as const : 'trending-down' as const,
      },
      {
        title: 'Average Transaction',
        value: `$${(totalExpenses / transactions.filter(t => t.type === 'expense').length).toFixed(2)}`,
        description: 'Average amount per expense transaction',
        type: 'neutral' as const,
        icon: 'calendar' as const,
      },
      {
        title: 'Savings Rate',
        value: `${((balance / totalIncome) * 100).toFixed(1)}%`,
        description: 'Percentage of income saved this period',
        type: balance / totalIncome > 0.2 ? 'positive' as const : 'negative' as const,
        icon: balance / totalIncome > 0.2 ? 'trending-up' as const : 'trending-down' as const,
      },
    ];
  }, [transactions, spendingData, balance, totalIncome, totalExpenses]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-200">
      <div className="max-w-7xl mx-auto p-4 md:p-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-blue-600 dark:bg-blue-500 rounded-lg">
                <LayoutDashboard className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Finance Dashboard</h1>
            </div>
            <p className="text-gray-600 dark:text-gray-400">Track and manage your financial activity</p>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <ThemeToggle isDark={isDarkMode} onToggle={() => setIsDarkMode(!isDarkMode)} />
            <RoleSelector currentRole={role} onRoleChange={setRole} />
            {role === 'admin' && (
              <button
                onClick={() => {
                  setEditingTransaction(undefined);
                  setIsModalOpen(true);
                }}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors shadow-sm"
              >
                <Plus className="w-5 h-5" />
                Add Transaction
              </button>
            )}
          </div>
        </div>

        {role === 'viewer' && (
          <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-lg flex items-center gap-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-800 rounded-lg">
              <LayoutDashboard className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="font-medium text-blue-900 dark:text-blue-100">Viewing in Read-Only Mode</p>
              <p className="text-sm text-blue-700 dark:text-blue-300">Switch to Admin role to add or edit transactions</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <SummaryCard
            title="Total Balance"
            amount={balance}
            icon={Wallet}
            trend={{ value: 8.5, isPositive: true }}
            color="bg-blue-600"
          />
          <SummaryCard
            title="Total Income"
            amount={totalIncome}
            icon={TrendingUp}
            trend={{ value: 12.3, isPositive: true }}
            color="bg-green-600"
          />
          <SummaryCard
            title="Total Expenses"
            amount={totalExpenses}
            icon={TrendingDown}
            trend={{ value: 5.2, isPositive: false }}
            color="bg-red-600"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <BalanceChart data={balanceData} />
          <SpendingChart data={spendingData} />
        </div>

        <div className="mb-8">
          <InsightsPanel insights={insights} />
        </div>

        <TransactionList
          transactions={transactions}
          onEdit={handleEditTransaction}
          canEdit={role === 'admin'}
        />
      </div>

      <AddTransactionModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingTransaction(undefined);
        }}
        onAdd={handleAddTransaction}
        editTransaction={editingTransaction}
      />
    </div>
  );
}
