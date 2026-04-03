import { TrendingUp, TrendingDown, AlertCircle, Calendar } from 'lucide-react';

interface Insight {
  title: string;
  value: string;
  description: string;
  type: 'positive' | 'negative' | 'neutral';
  icon: 'trending-up' | 'trending-down' | 'alert' | 'calendar';
}

interface InsightsPanelProps {
  insights: Insight[];
}

export function InsightsPanel({ insights }: InsightsPanelProps) {
  const getIcon = (iconType: string) => {
    switch (iconType) {
      case 'trending-up':
        return TrendingUp;
      case 'trending-down':
        return TrendingDown;
      case 'alert':
        return AlertCircle;
      case 'calendar':
        return Calendar;
      default:
        return AlertCircle;
    }
  };

  const getColorClasses = (type: string) => {
    switch (type) {
      case 'positive':
        return {
          bg: 'bg-green-100 dark:bg-green-900/30',
          text: 'text-green-700 dark:text-green-400',
          icon: 'text-green-600 dark:text-green-400',
        };
      case 'negative':
        return {
          bg: 'bg-red-100 dark:bg-red-900/30',
          text: 'text-red-700 dark:text-red-400',
          icon: 'text-red-600 dark:text-red-400',
        };
      default:
        return {
          bg: 'bg-blue-100 dark:bg-blue-900/30',
          text: 'text-blue-700 dark:text-blue-400',
          icon: 'text-blue-600 dark:text-blue-400',
        };
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Financial Insights</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {insights.map((insight, index) => {
          const Icon = getIcon(insight.icon);
          const colors = getColorClasses(insight.type);

          return (
            <div
              key={index}
              className="flex flex-col items-start gap-3 p-4 rounded-lg bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <div className={`p-2 rounded-lg ${colors.bg}`}>
                <Icon className={`w-5 h-5 ${colors.icon}`} />
              </div>
              <div className="flex-1 w-full">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1 text-sm">{insight.title}</h3>
                <p className={`text-2xl font-bold mb-2 ${colors.text}`}>{insight.value}</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">{insight.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
