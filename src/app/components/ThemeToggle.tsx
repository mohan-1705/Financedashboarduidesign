import { Moon, Sun } from 'lucide-react';

interface ThemeToggleProps {
  isDark: boolean;
  onToggle: () => void;
}

export function ThemeToggle({ isDark, onToggle }: ThemeToggleProps) {
  return (
    <button
      onClick={onToggle}
      className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors shadow-sm"
      aria-label="Toggle theme"
    >
      {isDark ? (
        <>
          <Sun className="w-5 h-5 text-yellow-500" />
          <span className="hidden sm:inline text-sm font-medium text-gray-700 dark:text-gray-300">Light</span>
        </>
      ) : (
        <>
          <Moon className="w-5 h-5 text-blue-600" />
          <span className="hidden sm:inline text-sm font-medium text-gray-700 dark:text-gray-300">Dark</span>
        </>
      )}
    </button>
  );
}
