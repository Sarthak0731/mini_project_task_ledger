import React from 'react';

const statusBadge = (status) => {
  const badgeClass = {
    pending: 'badge-pending',
    'in-progress': 'badge-in-progress',
    completed: 'badge-completed',
    overdue: 'badge-overdue',
  }[status] || 'badge-secondary';

  return <span className={`badge rounded-pill badge-status ${badgeClass}`}>{status}</span>;
};

const taskPriority = (status) => {
  if (status === 'overdue') return 'High';
  if (status === 'in-progress') return 'High';
  if (status === 'pending') return 'Medium';
  return 'Low';
};

const progressValue = (status) => {
  if (status === 'completed') return 100;
  if (status === 'in-progress') return 65;
  if (status === 'pending') return 20;
  if (status === 'overdue') return 10;
  return 0;
};

const colorForStatus = (status) => {
  switch (status) {
    case 'pending': return '#f59e0b';
    case 'in-progress': return '#6366f1';
    case 'completed': return '#22c55e';
    case 'overdue': return '#ef4444';
    default: return '#f0f6fc';
  }
};

const TaskList = ({ tasks, onStatusChange, user }) => {
  if (!tasks.length) {
    return (
      <div className="card">
        <div style={{ textAlign: 'center', padding: '48px', color: '#8b949e' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>📋</div>
          <div>No tasks found</div>
        </div>
      </div>
    );
  }

  const statusOptions = user.role === 'admin'
    ? ['pending', 'in-progress', 'completed', 'overdue']
    : ['pending', 'in-progress', 'completed'];

  const statusLabels = {
    pending: 'Pending',
    'in-progress': 'In Progress',
    completed: 'Completed',
    overdue: 'Overdue',
  };

  const priorityStyles = {
    Low: { background: 'rgba(34,197,94,0.1)', color: '#22c55e', border: '1px solid rgba(34,197,94,0.3)' },
    Medium: { background: 'rgba(245,158,11,0.1)', color: '#f59e0b', border: '1px solid rgba(245,158,11,0.3)' },
    High: { background: 'rgba(239,68,68,0.1)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.3)' },
  };

  return (
    <div className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h4 style={{ fontFamily: 'Syne', margin: 0 }}>Recent Tasks</h4>
        <span style={{ background: 'rgba(99,102,241,0.15)', color: '#6366f1', padding: '4px 12px', borderRadius: '999px', fontSize: '12px' }}>{tasks.length} tasks</span>
      </div>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ borderBottom: '1px solid #30363d' }}>
            <th style={{ color: '#8b949e', fontSize: '12px', fontWeight: '500', textTransform: 'uppercase', padding: '12px 16px', textAlign: 'left' }}>Task</th>
            <th style={{ color: '#8b949e', fontSize: '12px', fontWeight: '500', textTransform: 'uppercase', padding: '12px 16px', textAlign: 'left' }}>Assignee</th>
            <th style={{ color: '#8b949e', fontSize: '12px', fontWeight: '500', textTransform: 'uppercase', padding: '12px 16px', textAlign: 'left' }}>Priority</th>
            <th style={{ color: '#8b949e', fontSize: '12px', fontWeight: '500', textTransform: 'uppercase', padding: '12px 16px', textAlign: 'left' }}>Status</th>
            <th style={{ color: '#8b949e', fontSize: '12px', fontWeight: '500', textTransform: 'uppercase', padding: '12px 16px', textAlign: 'left' }}>Deadline</th>
            <th style={{ color: '#8b949e', fontSize: '12px', fontWeight: '500', textTransform: 'uppercase', padding: '12px 16px', textAlign: 'left' }}>Progress</th>
            {user.role === 'admin' && <th style={{ color: '#8b949e', fontSize: '12px', fontWeight: '500', textTransform: 'uppercase', padding: '12px 16px', textAlign: 'left' }}>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => {
            const canEditStatus = user.role === 'admin' || String(task.assignedTo?._id) === String(user._id);
            const isOverdue = new Date(task.deadline) < new Date() && task.status !== 'Completed';
            const progress = progressValue(task.status);

            return (
              <tr key={task._id} style={{ borderBottom: '1px solid #1c2128' }}>
                <td style={{ padding: '16px' }}>
                  <strong style={{ color: '#f0f6fc' }}>{task.title}</strong>
                  <p style={{ color: '#8b949e', fontSize: '13px', margin: '2px 0 0' }}>{task.description}</p>
                </td>
                <td style={{ padding: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#6366f1', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '13px', fontWeight: 'bold' }}>
                      {(task.assignedTo?.name || 'U').charAt(0)}
                    </div>
                    <span style={{ color: '#f0f6fc', fontSize: '14px' }}>{task.assignedTo?.name || 'Unknown'}</span>
                  </div>
                </td>
                <td style={{ padding: '16px' }}>
                  <span style={{ padding: '4px 8px', borderRadius: '4px', fontSize: '12px', ...priorityStyles[taskPriority(task.status)] }}>
                    {taskPriority(task.status)}
                  </span>
                </td>
                <td style={{ padding: '16px' }}>
                  <div style={{ marginBottom: '8px' }}>
                    <span style={{ padding: '4px 8px', borderRadius: '4px', fontSize: '12px', background: 'rgba(108,117,125,0.1)', color: '#6c757d', border: '1px solid rgba(108,117,125,0.3)' }}>
                      {statusLabels[task.status]}
                    </span>
                  </div>
                  {canEditStatus && (
                    <select
                      style={{
                        width: '100%',
                        padding: '6px 10px',
                        background: '#0d1117',
                        color: '#f0f6fc',
                        border: '1px solid #30363d',
                        borderRadius: '6px',
                        fontSize: '13px',
                        fontFamily: "'DM Sans', sans-serif",
                        cursor: 'pointer',
                        transition: 'border-color 0.2s ease',
                        outline: 'none'
                      }}
                      value={task.status}
                      onChange={(e) => onStatusChange(task._id, e.target.value)}
                      onFocus={(e) => e.target.style.borderColor = '#6366f1'}
                      onBlur={(e) => e.target.style.borderColor = '#30363d'}
                    >
                      {statusOptions.map((status) => (
                        <option key={status} value={status}>
                          {statusLabels[status]}
                        </option>
                      ))}
                    </select>
                  )}
                </td>
                <td style={{ padding: '16px', color: isOverdue ? '#ef4444' : '#8b949e' }}>
                  {new Date(task.deadline).toLocaleDateString()}
                  {isOverdue && <div style={{ fontSize: '11px', marginTop: '2px' }}>Overdue</div>}
                </td>
                <td style={{ padding: '16px', width: '140px' }}>
                  <div style={{ textAlign: 'right', color: '#8b949e', fontSize: '13px', marginBottom: '4px' }}>{progress}%</div>
                  <div style={{ width: '100%', height: '6px', background: '#30363d', borderRadius: '3px' }}>
                    <div style={{ width: `${progress}%`, height: '100%', background: task.status === 'Completed' ? '#22c55e' : '#6366f1', borderRadius: '3px', transition: 'width 0.3s ease' }}></div>
                  </div>
                </td>
                {user.role === 'admin' && (
                  <td style={{ padding: '16px' }}>
                    <button style={{ background: 'none', border: 'none', color: '#8b949e', cursor: 'pointer', fontSize: '16px' }} onClick={() => console.log('Delete task', task._id)}>🗑</button>
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default TaskList;
