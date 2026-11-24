'use client'

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts'

interface AnalyticsChartsProps {
  monthlyTrends: Array<{ month: string; locations_added: number; barriers_reported: number }>
  categoryData: Array<{ name: string; location_count: number }>
}

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#8b5cf6', '#ec4899', '#6366f1']

export function AnalyticsCharts({ monthlyTrends, categoryData }: AnalyticsChartsProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Monthly Trends Bar Chart */}
      <div className="p-7 rounded-3xl glass shadow-lg space-y-4">
        <h3 className="font-extrabold text-sm">Monthly Platform Growth Trends</h3>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyTrends}>
              <XAxis dataKey="month" stroke="#888888" fontSize={11} tickLine={false} />
              <YAxis stroke="#888888" fontSize={11} tickLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(15, 23, 42, 0.85)',
                  backdropFilter: 'blur(16px)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '16px',
                  color: '#fff',
                  fontSize: '12px',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
                }}
              />
              <Legend wrapperStyle={{ fontSize: '11px', fontWeight: 600 }} />
              <Bar dataKey="locations_added" name="New Places" fill="#10b981" radius={[6, 6, 0, 0]} />
              <Bar dataKey="barriers_reported" name="Barriers Logged" fill="#f43f5e" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Category Distribution Pie Chart */}
      <div className="p-7 rounded-3xl glass shadow-lg space-y-4">
        <h3 className="font-extrabold text-sm">Location Category Distribution</h3>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={categoryData}
                dataKey="location_count"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label
              >
                {categoryData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(15, 23, 42, 0.85)',
                  backdropFilter: 'blur(16px)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '16px',
                  color: '#fff',
                  fontSize: '12px',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
                }}
              />
              <Legend wrapperStyle={{ fontSize: '11px', fontWeight: 600 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
