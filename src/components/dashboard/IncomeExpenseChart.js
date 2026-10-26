import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid, } from 'recharts';
import { formatINR } from '../../lib/currency';
import { useTheme } from '../../context/ThemeContext';
export const IncomeExpenseChart = ({ data }) => {
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    if (!data || data.length === 0) {
        return (_jsx("div", { className: "h-64 flex items-center justify-center text-xs font-sans text-zinc-400", children: "No comparative cash flow data in selected timeframe" }));
    }
    return (_jsx("div", { className: "w-full h-72", children: _jsx(ResponsiveContainer, { width: "100%", height: "100%", children: _jsxs(BarChart, { data: data, margin: { top: 10, right: 10, left: -10, bottom: 0 }, children: [_jsx(CartesianGrid, { strokeDasharray: "3 3", stroke: isDark ? '#262C38' : '#EDE8DF', vertical: false }), _jsx(XAxis, { dataKey: "month", stroke: isDark ? '#8A92A6' : '#6B7280', fontSize: 11, tickLine: false, axisLine: { stroke: isDark ? '#262C38' : '#EDE8DF' }, fontFamily: "sans-serif" }), _jsx(YAxis, { stroke: isDark ? '#8A92A6' : '#6B7280', fontSize: 10, tickLine: false, axisLine: { stroke: isDark ? '#262C38' : '#EDE8DF' }, tickFormatter: (val) => `₹${val >= 1000 ? `${Math.round(val / 1000)}k` : val}`, fontFamily: "sans-serif" }), _jsx(Tooltip
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    , { 
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        formatter: (value, name) => [
                            formatINR(Number(value) || 0),
                            name === 'income' ? 'Income' : 'Expense',
                        ], contentStyle: {
                            backgroundColor: isDark ? '#1A1E29' : '#FFFFFF',
                            border: `1px solid ${isDark ? '#2E3545' : '#E5E0D6'}`,
                            borderRadius: '8px',
                            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
                            fontFamily: 'sans-serif',
                            fontSize: '12px',
                            color: isDark ? '#F4F4F5' : '#121826',
                        } }), _jsx(Legend, { verticalAlign: "top", align: "right", wrapperStyle: { paddingBottom: '12px', fontSize: '11px', fontFamily: 'sans-serif' } }), _jsx(Bar, { dataKey: "income", name: "Income", fill: "#16A34A", radius: [4, 4, 0, 0], maxBarSize: 32 }), _jsx(Bar, { dataKey: "expense", name: "Expense", fill: "#DC2626", radius: [4, 4, 0, 0], maxBarSize: 32 })] }) }) }));
};
