/**
 * 📈 COMPONENTES DE GRÁFICAS
 * Wrappers de Recharts para gráficas del dashboard
 */

import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

// ============================================
// TIPOS
// ============================================

interface ChartData {
  name: string;
  value: number;
  [key: string]: string | number;
}

interface LineChartCardProps {
  title: string;
  data: ChartData[];
  dataKey: string;
  xAxisKey?: string;
  color?: string;
  height?: number;
}

interface BarChartCardProps {
  title: string;
  data: ChartData[];
  dataKey: string;
  xAxisKey?: string;
  color?: string;
  height?: number;
}

interface PieChartCardProps {
  title: string;
  data: ChartData[];
  height?: number;
}

// ============================================
// COLORES
// ============================================

const COLORS = ['#8B5CF6', '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#EC4899', '#6366F1'];

// ============================================
// TOOLTIP PERSONALIZADO
// ============================================

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-3">
        <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">
          {label}
        </p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-sm text-gray-600 dark:text-gray-400">
            <span style={{ color: entry.color }}>●</span> {entry.name}: {entry.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

// ============================================
// GRÁFICA DE LÍNEAS
// ============================================

export const LineChartCard = ({
  title,
  data,
  dataKey,
  xAxisKey = 'name',
  color = '#8B5CF6',
  height = 300
}: LineChartCardProps) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        {title}
      </h3>
      <ResponsiveContainer width="100%" height={height}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
          <XAxis 
            dataKey={xAxisKey} 
            stroke="#9CA3AF"
            style={{ fontSize: '12px' }}
          />
          <YAxis 
            stroke="#9CA3AF"
            style={{ fontSize: '12px' }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Line
            type="monotone"
            dataKey={dataKey}
            stroke={color}
            strokeWidth={2}
            dot={{ fill: color, r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

// ============================================
// GRÁFICA DE BARRAS
// ============================================

export const BarChartCard = ({
  title,
  data,
  dataKey,
  xAxisKey = 'name',
  color = '#8B5CF6',
  height = 300
}: BarChartCardProps) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        {title}
      </h3>
      <ResponsiveContainer width="100%" height={height}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
          <XAxis 
            dataKey={xAxisKey} 
            stroke="#9CA3AF"
            style={{ fontSize: '12px' }}
          />
          <YAxis 
            stroke="#9CA3AF"
            style={{ fontSize: '12px' }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Bar 
            dataKey={dataKey} 
            fill={color}
            radius={[8, 8, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

// ============================================
// GRÁFICA DE PASTEL
// ============================================

export const PieChartCard = ({
  title,
  data,
  height = 300
}: PieChartCardProps) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        {title}
      </h3>
      <ResponsiveContainer width="100%" height={height}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={(props: any) => {
              const { name, percent } = props;
              return `${name}: ${(percent * 100).toFixed(0)}%`;
            }}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((_entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

// ============================================
// GRÁFICA COMPARATIVA (MÚLTIPLES LÍNEAS)
// ============================================

interface MultiLineChartCardProps {
  title: string;
  data: ChartData[];
  lines: { dataKey: string; name: string; color: string }[];
  xAxisKey?: string;
  height?: number;
}

export const MultiLineChartCard = ({
  title,
  data,
  lines,
  xAxisKey = 'name',
  height = 300
}: MultiLineChartCardProps) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        {title}
      </h3>
      <ResponsiveContainer width="100%" height={height}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
          <XAxis 
            dataKey={xAxisKey} 
            stroke="#9CA3AF"
            style={{ fontSize: '12px' }}
          />
          <YAxis 
            stroke="#9CA3AF"
            style={{ fontSize: '12px' }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          {lines.map((line, index) => (
            <Line
              key={index}
              type="monotone"
              dataKey={line.dataKey}
              name={line.name}
              stroke={line.color}
              strokeWidth={2}
              dot={{ fill: line.color, r: 4 }}
              activeDot={{ r: 6 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default LineChartCard;
