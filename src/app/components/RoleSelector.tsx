import { Shield, Eye } from 'lucide-react';

interface RoleSelectorProps {
  currentRole: 'viewer' | 'admin';
  onRoleChange: (role: 'viewer' | 'admin') => void;
}

export function RoleSelector({ currentRole, onRoleChange }: RoleSelectorProps) {
  return (
    <div className="flex items-center gap-2 bg-white dark:bg-gray-800 px-4 py-2 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
      <span className="text-sm text-gray-600 dark:text-gray-400">Role:</span>
      <button
        onClick={() => onRoleChange('viewer')}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
          currentRole === 'viewer'
            ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300'
            : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
        }`}
      >
        <Eye className="w-4 h-4" />
        Viewer
      </button>
      <button
        onClick={() => onRoleChange('admin')}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
          currentRole === 'admin'
            ? 'bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300'
            : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
        }`}
      >
        <Shield className="w-4 h-4" />
        Admin
      </button>
    </div>
  );
}
