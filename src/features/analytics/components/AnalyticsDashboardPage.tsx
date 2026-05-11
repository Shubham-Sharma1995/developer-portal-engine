import { useState, useMemo } from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from 'recharts';

// Realistic mock data generator
function generateMockData(days: number) {
  const data = [];
  const now = new Date();
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    const isWeekend = date.getDay() === 0 || date.getDay() === 6;
    const baseCalls = isWeekend ? 800 : 2400;
    const jitter = Math.floor(Math.random() * 600) - 300;
    const calls = Math.max(100, baseCalls + jitter);
    const errorRate = 0.5 + Math.random() * 3;
    const errors = Math.floor(calls * (errorRate / 100));

    data.push({
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      calls,
      errors,
      avgLatency: Math.floor(80 + Math.random() * 120),
      errorRate: parseFloat(errorRate.toFixed(1)),
    });
  }
  return data;
}

export function AnalyticsDashboardPage() {
  const [range, setRange] = useState<7 | 30>(7);
  const data = useMemo(() => generateMockData(range), [range]);

  const totalCalls = data.reduce((sum, d) => sum + d.calls, 0);
  const totalErrors = data.reduce((sum, d) => sum + d.errors, 0);
  const avgLatency = Math.round(
    data.reduce((sum, d) => sum + d.avgLatency, 0) / data.length,
  );
  const errorRate = ((totalErrors / totalCalls) * 100).toFixed(2);

  return (
    <div className="page-container">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">
            Analytics
          </h1>
          <p className="text-sm text-[var(--color-text-secondary)]">
            API usage metrics and performance data.
          </p>
        </div>
        <div className="flex gap-1 bg-[var(--color-bg-tertiary)] rounded-lg p-1">
          {([7, 30] as const).map((d) => (
            <button
              key={d}
              onClick={() => setRange(d)}
              className={`h-8 px-5 flex items-center justify-center text-xs font-bold rounded-md transition-all cursor-pointer ${
                range === d
                  ? 'bg-[var(--color-bg-elevated)] text-[var(--color-accent)] shadow-sm border border-[var(--color-border)]'
                  : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-hover)]'
              }`}
            >
              {d} Days
            </button>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total Calls', value: totalCalls.toLocaleString(), color: 'text-[var(--color-accent)]' },
          { label: 'Error Rate', value: `${errorRate}%`, color: totalErrors > 100 ? 'text-red-400' : 'text-emerald-400' },
          { label: 'Avg Latency', value: `${avgLatency}ms`, color: avgLatency > 150 ? 'text-amber-400' : 'text-emerald-400' },
          { label: 'Total Errors', value: totalErrors.toLocaleString(), color: 'text-red-400' },
        ].map((stat) => (
          <Card key={stat.label} glass>
            <div className="text-xs text-[var(--color-text-tertiary)] mb-1">{stat.label}</div>
            <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h3 className="text-sm font-semibold text-[var(--color-text-primary)] mb-4">
            API Calls
          </h3>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={data}>
              <defs>
                <linearGradient id="callsGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="date" tick={{ fontSize: 10, fill: 'var(--color-text-tertiary)' }} />
              <YAxis tick={{ fontSize: 10, fill: 'var(--color-text-tertiary)' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--color-bg-elevated)',
                  border: '1px solid var(--color-border)',
                  borderRadius: '8px',
                  fontSize: '12px',
                }}
              />
              <Area
                type="monotone"
                dataKey="calls"
                stroke="#8b5cf6"
                fill="url(#callsGradient)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        <Card>
          <h3 className="text-sm font-semibold text-[var(--color-text-primary)] mb-4">
            Error Rate (%)
          </h3>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="date" tick={{ fontSize: 10, fill: 'var(--color-text-tertiary)' }} />
              <YAxis tick={{ fontSize: 10, fill: 'var(--color-text-tertiary)' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--color-bg-elevated)',
                  border: '1px solid var(--color-border)',
                  borderRadius: '8px',
                  fontSize: '12px',
                }}
              />
              <Line
                type="monotone"
                dataKey="errorRate"
                stroke="#ef4444"
                strokeWidth={2}
                dot={{ fill: '#ef4444', r: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <Card>
          <h3 className="text-sm font-semibold text-[var(--color-text-primary)] mb-4">
            Average Latency (ms)
          </h3>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={data}>
              <defs>
                <linearGradient id="latencyGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="date" tick={{ fontSize: 10, fill: 'var(--color-text-tertiary)' }} />
              <YAxis tick={{ fontSize: 10, fill: 'var(--color-text-tertiary)' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--color-bg-elevated)',
                  border: '1px solid var(--color-border)',
                  borderRadius: '8px',
                  fontSize: '12px',
                }}
              />
              <Area
                type="monotone"
                dataKey="avgLatency"
                stroke="#06b6d4"
                fill="url(#latencyGradient)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        <Card>
          <h3 className="text-sm font-semibold text-[var(--color-text-primary)] mb-4">
            Top Endpoints
          </h3>
          <div className="space-y-3">
            {[
              { path: '/pokemon/{name}', calls: 12450, method: 'GET' },
              { path: '/pokemon', calls: 8920, method: 'GET' },
              { path: '/type/{id}', calls: 4310, method: 'GET' },
              { path: '/move/{id}', calls: 2890, method: 'GET' },
              { path: '/berry/{id}', calls: 1560, method: 'GET' },
            ].map((ep) => (
              <div key={ep.path} className="flex items-center gap-3">
                <Badge variant={ep.method.toLowerCase() as 'get'} size="sm">
                  {ep.method}
                </Badge>
                <span className="font-mono text-xs text-[var(--color-text-secondary)] flex-1 truncate">
                  {ep.path}
                </span>
                <span className="text-xs font-medium text-[var(--color-text-primary)]">
                  {ep.calls.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
