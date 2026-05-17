import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import CreateTask from './CreateTask';
import TaskChart from './TaskChart';
import TaskList from './TaskList';
import EmployeePanel from './EmployeePanel';
import Chat from '../Chat';
import Analytics from '../Analytics';
import Notifications from '../Notifications';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const AnimatedCount = ({ value }) => {
  const [displayed, setDisplayed] = useState(0);

  useEffect(() => {
    if (!value) return;
    let start = 0;
    const step = Math.ceil(value / 20);
    const timer = setInterval(() => {
      start += step;
      if (start >= value) {
        setDisplayed(value);
        clearInterval(timer);
      } else {
        setDisplayed(start);
      }
    }, 30);
    return () => clearInterval(timer);
  }, [value]);

  return <span>{displayed}</span>;
};

const StatCard = ({ icon, value, label, subtitle, color, glowColor }) => (
  <div
    className="card-stat"
    style={{
      borderLeft: `3px solid ${color}`,
      boxShadow: `-4px 0 16px rgba(${glowColor}, 0.3), 0 4px 24px rgba(0,0,0,0.5)`
    }}
  >
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
      <div style={{
        width: '44px',
        height: '44px',
        borderRadius: '12px',
        background: `rgba(${glowColor}, 0.12)`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0
      }}>
        {icon}
      </div>
      <div>
        <div style={{ fontSize: '36px', fontFamily: 'Syne', color }}>
          <AnimatedCount value={value} />
        </div>
        <div style={{ fontSize: '14px', color: '#8b949e' }}>{label}</div>
        <div style={{ fontSize: '12px', color: '#8b949e' }}>{subtitle}</div>
      </div>
    </div>
  </div>
);

const Dashboard = ({ user, onLogout }) => {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [analytics, setAnalytics] = useState({ totals: {}, overdue: 0, totalTasks: 0 });
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [lastUpdated, setLastUpdated] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  const loadData = async () => {
    try {
      setLoading(true);
      const [tasksRes, analyticsRes, usersRes] = await Promise.all([
        api.get('/tasks'),
        api.get('/tasks/analytics'),
        api.get('/users'),
      ]);

      setTasks(tasksRes.data);
      setAnalytics(analyticsRes.data);
      setEmployees(usersRes.data.filter((userItem) => userItem.role === 'employee'));
      setLastUpdated(new Date());
      setLoading(false);
    } catch (err) {
      setMessage('Unable to load dashboard data');
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) return;

    loadData();
    const socket = io('http://localhost:5000', {
      transports: ['websocket'],
    });

    socket.on('taskUpdated', () => {
      loadData();
    });

    socket.on('taskCreated', () => {
      loadData();
    });

    const interval = setInterval(loadData, 10000);

    return () => {
      clearInterval(interval);
      socket.disconnect();
    };
  }, [user]);

  useEffect(() => {
    const filtered = tasks.filter(task =>
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredTasks(filtered);
  }, [tasks, searchQuery]);

  const handleTaskCreated = () => {
    loadData();
  };

  const handleEmployeeCreated = () => {
    loadData();
  };

  const handleStatusChange = async (taskId, status) => {
    try {
      await api.put(`/tasks/${taskId}`, { status });
      await loadData();
    } catch (err) {
      setMessage('Unable to update task status');
    }
  };

  const handleAddUser = async (userData) => {
    try {
      await api.post('/users', { ...userData, role: 'employee' });
      loadData();
    } catch (err) {
      setMessage('Unable to add employee');
    }
  };

  const handleCreateTask = async (taskData) => {
    try {
      await api.post('/tasks', taskData);
      loadData();
    } catch (err) {
      setMessage('Unable to create task');
    }
  };

  const Sidebar = ({ activeTab, setActiveTab, onLogout }) => {
    const [collapsed, setCollapsed] = useState(false);

    const navItems = [
      { id: 'dashboard', label: 'Dashboard', icon: '⊞' },
      { id: 'tasks', label: 'Tasks', icon: '✓' },
      { id: 'employees', label: 'Employees', icon: '👥', show: user.role === 'admin' },
      { id: 'chat', label: 'Chat', icon: '💬' },
      { id: 'analytics', label: 'Analytics', icon: '📊' },
    ].filter(item => item.show !== false);

    return (
      <div style={{
        width: collapsed ? '64px' : '240px',
        height: '100vh',
        background: '#161b22',
        borderRight: '1px solid #30363d',
        display: 'flex',
        flexDirection: 'column',
        transition: 'width 0.3s ease',
        position: 'fixed',
        left: 0,
        top: 0,
        zIndex: 100
      }}>
        <div style={{ padding: '16px', borderBottom: '1px solid #30363d' }}>
          <button onClick={() => setCollapsed(!collapsed)} style={{ background: 'none', border: 'none', color: '#f0f6fc', cursor: 'pointer', fontSize: '20px' }}>☰</button>
          {!collapsed && <h3 style={{ fontFamily: 'Syne', margin: '8px 0 0', fontSize: '18px' }}>TaskLedger</h3>}
        </div>
        <nav style={{ flex: 1, padding: '16px 0' }}>
          {navItems.map(item => (
            <div
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              style={{
                padding: '12px 16px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                background: activeTab === item.id ? 'rgba(99,102,241,0.15)' : 'transparent',
                borderLeft: activeTab === item.id ? '3px solid #6366f1' : '3px solid transparent',
                color: activeTab === item.id ? '#6366f1' : '#f0f6fc',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => e.target.style.background = 'rgba(255,255,255,0.05)'}
              onMouseLeave={(e) => e.target.style.background = activeTab === item.id ? 'rgba(99,102,241,0.15)' : 'transparent'}
            >
              <span style={{ fontSize: '18px' }}>{item.icon}</span>
              {!collapsed && <span>{item.label}</span>}
            </div>
          ))}
        </nav>
        <div style={{ padding: '16px', borderTop: '1px solid #30363d' }}>
          {!collapsed && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#6366f1', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold' }}>
                {user.name.charAt(0)}
              </div>
              <div>
                <div style={{ fontSize: '14px', fontWeight: '500' }}>{user.name}</div>
                <div style={{ fontSize: '12px', color: '#8b949e' }}>{user.role}</div>
              </div>
            </div>
          )}
          <button onClick={onLogout} style={{ width: '100%', padding: '8px', background: 'transparent', border: '1px solid #ef4444', color: '#ef4444', borderRadius: '6px', cursor: 'pointer', fontSize: '14px' }}>
            {!collapsed ? 'Logout' : '🚪'}
          </button>
        </div>
      </div>
    );
  };

  const TopBar = () => (
    <div style={{
      height: '60px',
      borderBottom: '1px solid #30363d',
      background: '#161b22',
      display: 'flex',
      alignItems: 'center',
      padding: '0 24px',
      position: 'fixed',
      top: 0,
      left: '240px',
      right: 0,
      zIndex: 99
    }}>
      <h2 style={{ fontFamily: 'Syne', margin: 0, flex: 1 }}>{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</h2>
      <input
        type="search"
        placeholder="Search tasks..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        style={{
          width: '320px',
          padding: '8px 16px',
          background: '#0d1117',
          border: '1px solid #30363d',
          borderRadius: '999px',
          color: '#f0f6fc',
          outline: 'none',
          marginRight: '12px'
        }}
      />
      <button onClick={() => navigate('/notifications')} style={{ background: 'none', border: 'none', color: '#f0f6fc', fontSize: '20px', cursor: 'pointer', marginRight: '12px' }}>🔔</button>
      <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#6366f1', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold' }}>
        {user.name.charAt(0)}
      </div>
    </div>
  );

  if (!user) {
    return null;
  }

  const completionRate = analytics.totalTasks ? Math.round((analytics.totals.completed / analytics.totalTasks) * 100) : 0;

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
              <div className="card" style={{ borderLeft: '4px solid #f59e0b' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ fontSize: '24px' }}>⏳</div>
                  <div>
                    <div style={{ fontSize: '36px', fontFamily: 'Syne', color: '#f59e0b' }}>{analytics.totals.pending || 0}</div>
                    <div style={{ fontSize: '14px', color: '#8b949e' }}>Pending Tasks</div>
                    <div style={{ fontSize: '12px', color: '#8b949e' }}>{analytics.totals.pending || 0} awaiting action</div>
                  </div>
                </div>
              </div>
              <div className="card" style={{ borderLeft: '4px solid #6366f1' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ fontSize: '24px' }}>⚡</div>
                  <div>
                    <div style={{ fontSize: '36px', fontFamily: 'Syne', color: '#6366f1' }}>{analytics.totals['in-progress'] || 0}</div>
                    <div style={{ fontSize: '14px', color: '#8b949e' }}>In Progress</div>
                    <div style={{ fontSize: '12px', color: '#8b949e' }}>Active right now</div>
                  </div>
                </div>
              </div>
              <div className="card" style={{ borderLeft: '4px solid #22c55e' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ fontSize: '24px' }}>✓</div>
                  <div>
                    <div style={{ fontSize: '36px', fontFamily: 'Syne', color: '#22c55e' }}>{analytics.totals.completed || 0}</div>
                    <div style={{ fontSize: '14px', color: '#8b949e' }}>Completed</div>
                    <div style={{ fontSize: '12px', color: '#8b949e' }}>{completionRate}% completion rate</div>
                  </div>
                </div>
              </div>
              <div className="card" style={{ borderLeft: '4px solid #ef4444' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ fontSize: '24px' }}>⚠</div>
                  <div>
                    <div style={{ fontSize: '36px', fontFamily: 'Syne', color: '#ef4444' }}>{analytics.overdue || 0}</div>
                    <div style={{ fontSize: '14px', color: '#8b949e' }}>Overdue</div>
                    <div style={{ fontSize: '12px', color: '#8b949e' }}>Needs immediate attention</div>
                  </div>
                </div>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '65fr 35fr', gap: '20px' }}>
              <div>
                <TaskList tasks={filteredTasks} onStatusChange={handleStatusChange} user={user} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div className="card">
                  <h4 style={{ fontFamily: 'Syne', marginBottom: '16px' }}>Task Breakdown</h4>
                  <ResponsiveContainer width="100%" height={200}>
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
                  <h4 style={{ fontFamily: 'Syne', marginBottom: '16px' }}>Quick Stats</h4>
                  <div style={{ marginBottom: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <span style={{ color: '#f0f6fc' }}>Completion Rate</span>
                      <span style={{ color: '#f0f6fc' }}>{completionRate}%</span>
                    </div>
                    <div style={{ width: '100%', height: '6px', background: '#30363d', borderRadius: '3px' }}>
                      <div style={{ width: `${completionRate}%`, height: '100%', background: 'linear-gradient(90deg,#6366f1,#22d3ee)', borderRadius: '3px' }}></div>
                    </div>
                  </div>
                  <div style={{ color: '#f0f6fc' }}>Total Tasks: {tasks.length}</div>
                  <div style={{ color: '#f0f6fc' }}>Active Employees: {employees.length}</div>
                </div>
              </div>
            </div>
            {user.role === 'admin' && (
              <div className="card" style={{ marginTop: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <h4 style={{ fontFamily: 'Syne' }}>Employee Management</h4>
                  <span style={{ background: 'rgba(99,102,241,0.15)', color: '#6366f1', padding: '4px 12px', borderRadius: '999px', fontSize: '12px' }}>Active Employees: {employees.length}</span>
                </div>
                <form onSubmit={(e) => { e.preventDefault(); handleAddUser({ name: e.target.name.value, email: e.target.email.value, password: e.target.password.value }); e.target.reset(); }} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', gap: '12px', marginBottom: '16px' }}>
                  <input name="name" placeholder="Full name" required style={{ padding: '8px 12px', background: '#0d1117', border: '1px solid #30363d', borderRadius: '6px', color: '#f0f6fc' }} />
                  <input name="email" type="email" placeholder="Email address" required style={{ padding: '8px 12px', background: '#0d1117', border: '1px solid #30363d', borderRadius: '6px', color: '#f0f6fc' }} />
                  <input name="password" type="password" placeholder="Password" required style={{ padding: '8px 12px', background: '#0d1117', border: '1px solid #30363d', borderRadius: '6px', color: '#f0f6fc' }} />
                  <button type="submit" className="btn-primary">Add Employee</button>
                </form>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '12px' }}>
                  {employees.map(emp => (
                    <div key={emp._id} className="card" style={{ padding: '16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                        <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#6366f1', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold' }}>
                          {emp.name.charAt(0)}
                        </div>
                        <div>
                          <div style={{ fontWeight: 'bold', color: '#f0f6fc' }}>{emp.name}</div>
                          <div style={{ color: '#8b949e', fontSize: '14px' }}>{emp.email}</div>
                        </div>
                      </div>
                      <span style={{ background: user.role === 'admin' ? 'rgba(99,102,241,0.15)' : 'rgba(108,117,125,0.15)', color: user.role === 'admin' ? '#6366f1' : '#6c757d', padding: '4px 8px', borderRadius: '4px', fontSize: '12px' }}>
                        {user.role === 'admin' ? 'Admin' : 'Employee'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        );
      case 'tasks':
        return (
          <div>
            {user.role === 'admin' && (
              <div className="card" style={{ marginBottom: '20px' }}>
                <h4 style={{ fontFamily: 'Syne', marginBottom: '16px' }}>Create New Task</h4>
                <form onSubmit={(e) => { e.preventDefault(); handleCreateTask({ title: e.target.title.value, description: e.target.description.value, deadline: e.target.deadline.value, assignedTo: e.target.assignedTo.value, priority: e.target.priority.value, status: e.target.status.value }); e.target.reset(); }} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <input name="title" placeholder="Task Title" required style={{ padding: '8px 12px', background: '#0d1117', border: '1px solid #30363d', borderRadius: '6px', color: '#f0f6fc' }} />
                  <input name="description" placeholder="Description" required style={{ padding: '8px 12px', background: '#0d1117', border: '1px solid #30363d', borderRadius: '6px', color: '#f0f6fc' }} />
                  <input name="deadline" type="date" required style={{ padding: '8px 12px', background: '#0d1117', border: '1px solid #30363d', borderRadius: '6px', color: '#f0f6fc' }} />
                  <select name="assignedTo" required style={{ padding: '8px 12px', background: '#0d1117', border: '1px solid #30363d', borderRadius: '6px', color: '#f0f6fc' }}>
                    <option value="">Assign To</option>
                    {employees.map(emp => <option key={emp._id} value={emp._id}>{emp.name}</option>)}
                  </select>
                  <select name="priority" required style={{ padding: '8px 12px', background: '#0d1117', border: '1px solid #30363d', borderRadius: '6px', color: '#f0f6fc' }}>
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                  <select name="status" required style={{ padding: '8px 12px', background: '#0d1117', border: '1px solid #30363d', borderRadius: '6px', color: '#f0f6fc' }}>
                    <option value="pending">Pending</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                    <option value="overdue">Overdue</option>
                  </select>
                  <button type="submit" className="btn-primary" style={{ gridColumn: 'span 2' }}>Create Task</button>
                </form>
              </div>
            )}
            <TaskList tasks={filteredTasks} onStatusChange={handleStatusChange} user={user} />
          </div>
        );
      case 'chat':
        return <Chat user={user} users={employees} />;
      case 'analytics':
        return <Analytics tasks={tasks} users={employees} analytics={analytics} />;
      case 'notifications':
        return <Notifications user={user} />;
      default:
        return <div>Tab not found</div>;
    }
  };

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: '#0d1117' }}>
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} onLogout={onLogout} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', marginLeft: '240px' }}>
        <TopBar />
        <main style={{ flex: 1, overflowY: 'auto', padding: '84px 24px 24px' }}>
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
