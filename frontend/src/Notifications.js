import React, { useState, useEffect } from 'react';
import { getNotifications, markNotificationRead } from './api';

const Notifications = ({ user }) => {
  const [notifications, setNotifications] = useState([
    { _id: '1', message: 'Task "Complete Project Report" marked as Completed', read: false, createdAt: new Date(Date.now() - 3600000) },
    { _id: '2', message: 'New task assigned to Jane Smith', read: false, createdAt: new Date(Date.now() - 7200000) },
    { _id: '3', message: 'Task "Review Code Changes" is overdue', read: true, createdAt: new Date(Date.now() - 86400000) },
  ]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await getNotifications();
        setNotifications(response.data);
      } catch (err) {
        // Use seeded defaults if API fails
      }
    };
    fetchNotifications();
  }, []);

  const handleMarkRead = async (id) => {
    try {
      await markNotificationRead(id);
    } catch (err) {
      // Ignore if API fails
    }
    setNotifications(prev => prev.map(n => n._id === id ? { ...n, read: true } : n));
  };

  const timeAgo = (date) => {
    const diff = Date.now() - new Date(date);
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    return `${Math.floor(diff / 86400000)}d ago`;
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div style={{ maxWidth: '640px', margin: '0 auto' }}>
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontFamily: 'Syne', display: 'inline' }}>Notifications</h2>
        {unreadCount > 0 && (
          <span style={{ background: '#ef4444', color: 'white', padding: '2px 8px', borderRadius: '12px', fontSize: '12px', marginLeft: '8px' }}>
            {unreadCount}
          </span>
        )}
      </div>
      {notifications.map(n => (
        <div
          key={n._id}
          className="card"
          style={{
            marginBottom: '12px',
            opacity: n.read ? 0.6 : 1,
            borderLeft: n.read ? '4px solid #30363d' : '4px solid #6366f1'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
            <div style={{ fontSize: '20px', color: n.read ? '#8b949e' : '#6366f1' }}>🔔</div>
            <div style={{ flex: 1 }}>
              <div style={{ color: n.read ? '#8b949e' : '#f0f6fc', marginBottom: '4px' }}>{n.message}</div>
              <div style={{ color: '#8b949e', fontSize: '12px' }}>{timeAgo(n.createdAt)}</div>
            </div>
            {!n.read && (
              <button
                onClick={() => handleMarkRead(n._id)}
                style={{
                  background: 'transparent',
                  border: '1px solid #6366f1',
                  color: '#6366f1',
                  borderRadius: '6px',
                  padding: '4px 10px',
                  fontSize: '12px',
                  cursor: 'pointer'
                }}
              >
                Mark as read
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Notifications;