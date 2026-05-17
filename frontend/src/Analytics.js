import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, Legend } from 'recharts';

const Analytics = ({ tasks, users, analytics }) => {
  const completionRate = tasks.length ? Math.round((analytics.totals.completed / tasks.length) * 100) : 0;

  const tasksByPriority = [
    { name: 'Low', value: tasks.filter(t => t.priority === 'Low').length, fill: '#22c55e' },
    { name: 'Medium', value: tasks.filter(t => t.priority === 'Medium').length, fill: '#f59e0b' },
    { name: 'High', value: tasks.filter(t => t.priority === 'High').length, fill: '#ef4444' },
  ];

  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toLocaleDateString('en', { weekday: 'short' });
    const count = tasks.filter(t =>
      t.status === 'Completed' &&
      new Date(t.updatedAt).toDateString() === d.toDateString()
    ).length;
    return { name: dateStr, completed: count };
  }).reverse();

  return (
    <div style={{ padding: 0 }}>
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontFamily: 'Syne', fontSize: '24px', marginBottom: '8px' }}>Analytics Overview</h2>
        <p style={{ color: '#8b949e' }}>Track your team's performance</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '24px' }}>
        <div className="card">
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '48px', fontFamily: 'Syne', color: '#6366f1', marginBottom: '8px' }}>{completionRate}%</div>
            <div style={{ fontSize: '14px', color: '#8b949e' }}>Completion Rate</div>
            <div style={{ width: '100%', height: '8px', background: '#30363d', borderRadius: '4px', marginTop: '12px' }}>
              <div style={{ width: `${completionRate}%`, height: '100%', background: 'linear-gradient(90deg,#6366f1,#22d3ee)', borderRadius: '4px' }}></div>
            </div>
          </div>
        </div>
        <div className="card">
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '48px', fontFamily: 'Syne', marginBottom: '8px' }}>{tasks.length}</div>
            <div style={{ fontSize: '14px', color: '#8b949e' }}>Total Tasks</div>
            <div style={{ fontSize: '12px', color: '#f0f6fc', marginTop: '8px' }}>
              ✓ {analytics.totals.completed || 0} completed<br />
              ⟳ {analytics.totals['in-progress'] || 0} in progress
            </div>
          </div>
        </div>
        <div className="card">
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '48px', fontFamily: 'Syne', color: '#22d3ee', marginBottom: '8px' }}>{users.length}</div>
            <div style={{ fontSize: '14px', color: '#8b949e' }}>Active Employees</div>
            <div style={{ fontSize: '12px', color: '#f0f6fc', marginTop: '8px' }}>
              Managing {tasks.length} tasks
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
        <div className="card">
          <h4 style={{ fontFamily: 'Syne', marginBottom: '16px' }}>Status Breakdown</h4>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={[
              { name: 'Pending', value: analytics.totals.pending || 0, fill: '#f59e0b' },
              { name: 'In Progress', value: analytics.totals['in-progress'] || 0, fill: '#6366f1' },
              { name: 'Completed', value: analytics.totals.completed || 0, fill: '#22c55e' },
              { name: 'Overdue', value: analytics.overdue || 0, fill: '#ef4444' }
            ]}>
              <XAxis dataKey="name" tick={{ fill: '#8b949e' }} />
              <YAxis tick={{ fill: '#8b949e' }} />
              <Tooltip contentStyle={{ background: '#1c2128', border: '1px solid #30363d', color: '#f0f6fc' }} />
              <Bar dataKey="value" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="card">
          <h4 style={{ fontFamily: 'Syne', marginBottom: '16px' }}>Priority Distribution</h4>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={tasksByPriority}
                cx="50%"
                cy="50%"
                outerRadius={80}
                dataKey="value"
                label
              >
                {tasksByPriority.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ background: '#1c2128', border: '1px solid #30363d', color: '#f0f6fc' }} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="card">
        <h4 style={{ fontFamily: 'Syne', marginBottom: '16px' }}>Tasks Completed (Last 7 Days)</h4>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={last7Days}>
            <XAxis dataKey="name" tick={{ fill: '#8b949e' }} />
            <YAxis tick={{ fill: '#8b949e' }} />
            <Tooltip contentStyle={{ background: '#1c2128', border: '1px solid #30363d', color: '#f0f6fc' }} />
            <Line type="monotone" dataKey="completed" stroke="#6366f1" strokeWidth={2} dot={{ fill: '#6366f1', r: 4 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Analytics;