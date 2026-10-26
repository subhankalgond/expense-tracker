import React from 'react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
} from 'recharts';
import { formatINR } from '../../lib/currency';
import { useTheme } from '../../context/ThemeContext';

interface CategoryShareItem {
  category: string;
  amount: number;
  percentage: number;
  color?: string;
}

interface CategoryPieChartProps {
  data: CategoryShareItem[];
}

const EDITORIAL_PALETTE = [
  '#1E40AF', // Classic Blue
  '#16A34A', // Green
  '#EA580C', // Orange
  '#0284C7', // Sky
  '#9333EA', // Purple
  '#D97706', // Amber
  '#0D9488', // Teal
  '#E11D48', // Rose
];

export const CategoryPieChart: React.FC<CategoryPieChartProps> = ({ data }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  if (!data || data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-xs font-sans text-zinc-400">
        No expense data recorded in this period
      </div>
    );
  }

  const chartData = data.slice(0, 6);

  return (
    <div className="flex flex-col sm:flex-row items-center gap-4 h-72">
      {/* Donut Chart */}
      <div className="w-full sm:w-1/2 h-56 sm:h-full relative flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              dataKey="amount"
              nameKey="category"
              cx="50%"
              cy="50%"
              innerRadius={52}
              outerRadius={78}
              stroke={isDark ? '#171A21' : '#FCFAF6'}
              strokeWidth={3}
              paddingAngle={2}
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.color || EDITORIAL_PALETTE[index % EDITORIAL_PALETTE.length]}
                />
              ))}
            </Pie>
            <Tooltip
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              formatter={(val: any) => [formatINR(Number(val)), 'Spent']}
              contentStyle={{
                backgroundColor: isDark ? '#1A1E29' : '#FFFFFF',
                border: `1px solid ${isDark ? '#2E3545' : '#E5E0D6'}`,
                borderRadius: '8px',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
                fontFamily: 'sans-serif',
                fontSize: '12px',
                color: isDark ? '#F4F4F5' : '#121826',
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Editorial Legend */}
      <div className="w-full sm:w-1/2 space-y-2.5 overflow-y-auto max-h-56 pr-2">
        {chartData.map((item, idx) => {
          const color = item.color || EDITORIAL_PALETTE[idx % EDITORIAL_PALETTE.length];
          return (
            <div
              key={item.category}
              className="flex items-center justify-between text-xs font-sans border-b border-[#EFECE5] dark:border-[#222733] pb-1.5"
            >
              <div className="flex items-center gap-2 truncate pr-2">
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: color }}
                />
                <span className="truncate font-medium text-zinc-800 dark:text-zinc-200">
                  {item.category}
                </span>
              </div>
              <div className="text-right shrink-0">
                <span className="font-semibold tabular-nums text-zinc-900 dark:text-zinc-100">
                  {formatINR(item.amount, { showDecimals: false })}
                </span>
                <span className="text-[11px] text-zinc-500 dark:text-zinc-400 ml-1.5 font-medium">
                  ({item.percentage}%)
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

