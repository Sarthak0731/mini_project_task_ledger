import React, { useState, useEffect, useRef } from 'react';

const emojiOptions = ['😊', '😂', '👍', '🎉', '🔥', '😎', '🙌', '💬', '✅', '🚀'];

const Chat = ({ user, users }) => {
  const [channels, setChannels] = useState(['general', 'dev-team', 'announcements']);
  const [activeChannel, setActiveChannel] = useState('general');
  const [messages, setMessages] = useState({
    general: [
      { id: 1, sender: 'John Doe', text: 'Hey team, sprint planning at 3pm today!', time: '09:15 AM', isOwn: false },
      { id: 2, sender: 'Admin', text: 'Confirmed. Please review the task board before.', time: '09:17 AM', isOwn: true },
      { id: 3, sender: 'Jane Smith', text: 'Will do! Also updated my task progress.', time: '09:20 AM', isOwn: false },
    ],
    'dev-team': [
      { id: 1, sender: 'Jane Smith', text: 'PR #42 is ready for review.', time: '10:00 AM', isOwn: false },
      { id: 2, sender: 'Admin', text: 'On it. Looks good from a quick scan.', time: '10:05 AM', isOwn: true },
    ],
    announcements: [
      { id: 1, sender: 'Admin', text: 'Welcome to TaskLedger! Use this channel for updates.', time: '08:00 AM', isOwn: true },
    ],
  });
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [typingTimeout, setTypingTimeout] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const messageEndRef = useRef(null);

  const scrollToBottom = () => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, activeChannel]);

  const handleSend = () => {
    if (inputText.trim() === '') return;
    const newMsg = {
      id: Date.now(),
      sender: user.name || 'Admin',
      text: inputText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isOwn: true,
    };
    setMessages(prev => ({ ...prev, [activeChannel]: [...prev[activeChannel], newMsg] }));
    setInputText('');
    scrollToBottom();
  };

  const handleChannelChange = (channel) => {
    setActiveChannel(channel);
    setIsTyping(true);
    clearTimeout(typingTimeout);
    setTypingTimeout(setTimeout(() => setIsTyping(false), 1500));
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleEmojiToggle = () => {
    setShowEmojiPicker(prev => !prev);
  };

  const handleEmojiSelect = (emoji) => {
    setInputText(prev => prev + emoji);
    setShowEmojiPicker(false);
  };

  return (
    <div style={{ display: 'flex', height: 'calc(100vh - 60px)', background: '#0d1117' }}>
      <div style={{ width: '260px', background: '#161b22', borderRight: '1px solid #30363d', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '16px', borderBottom: '1px solid #30363d' }}>
          <h4 style={{ fontFamily: 'Syne', margin: 0 }}>Messages</h4>
        </div>
        <div style={{ padding: '16px 16px 8px', color: '#8b949e', fontSize: '11px', textTransform: 'uppercase', fontWeight: '500' }}>
          CHANNELS
        </div>
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {channels.map(channel => (
            <div
              key={channel}
              onClick={() => handleChannelChange(channel)}
              style={{
                padding: '8px 16px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                background: activeChannel === channel ? 'rgba(99,102,241,0.15)' : 'transparent',
                borderLeft: activeChannel === channel ? '3px solid #6366f1' : '3px solid transparent',
                color: activeChannel === channel ? '#6366f1' : '#f0f6fc',
                transition: 'all 0.2s ease'
              }}
            >
              <span style={{ color: '#8b949e' }}>#</span>
              <span>{channel}</span>
              {messages[channel]?.length > 2 && activeChannel !== channel && (
                <span style={{ width: '6px', height: '6px', background: '#ef4444', borderRadius: '50%', marginLeft: 'auto' }}></span>
              )}
            </div>
          ))}
        </div>
        <div style={{ padding: '16px 16px 8px', color: '#8b949e', fontSize: '11px', textTransform: 'uppercase', fontWeight: '500' }}>
          DIRECT MESSAGES
        </div>
        <div style={{ overflowY: 'auto' }}>
          {(users || [{ name: 'John Doe' }, { name: 'Jane Smith' }]).map(user => (
            <div
              key={user.name}
              style={{
                padding: '8px 16px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                cursor: 'pointer'
              }}
            >
              <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#6366f1', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '12px', fontWeight: 'bold' }}>
                {user.name.charAt(0)}
              </div>
              <span style={{ color: '#f0f6fc', fontSize: '14px' }}>{user.name}</span>
              <span style={{ width: '8px', height: '8px', background: '#22c55e', borderRadius: '50%', marginLeft: 'auto' }}></span>
            </div>
          ))}
        </div>
      </div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ height: '56px', borderBottom: '1px solid #30363d', padding: '0 20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <h3 style={{ fontFamily: 'Syne', fontSize: '18px', margin: 0 }}>#{activeChannel}</h3>
          <span style={{ color: '#8b949e', fontSize: '13px' }}>Team collaboration channel</span>
          <span style={{ color: '#8b949e', fontSize: '13px', marginLeft: 'auto' }}>3 members</span>
        </div>
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {messages[activeChannel]?.map(msg => (
            msg.isOwn ? (
              <div key={msg.id} style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                <div style={{ background: '#6366f1', color: 'white', borderRadius: '16px 16px 4px 16px', padding: '10px 14px', maxWidth: '70%' }}>
                  <p style={{ margin: 0, fontSize: '14px' }}>{msg.text}</p>
                  <span style={{ fontSize: '11px', opacity: 0.7, display: 'block', textAlign: 'right', marginTop: '4px' }}>{msg.time}</span>
                </div>
              </div>
            ) : (
              <div key={msg.id} style={{ display: 'flex', gap: '10px' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#30363d', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '13px', fontWeight: 'bold' }}>
                  {msg.sender.charAt(0)}
                </div>
                <div>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '4px' }}>
                    <span style={{ fontSize: '13px', fontWeight: '500' }}>{msg.sender}</span>
                    <span style={{ fontSize: '11px', color: '#8b949e' }}>{msg.time}</span>
                  </div>
                  <div style={{ background: '#1c2128', border: '1px solid #30363d', borderRadius: '4px 16px 16px 16px', padding: '10px 14px', maxWidth: '70%' }}>
                    <p style={{ margin: 0, fontSize: '14px' }}>{msg.text}</p>
                  </div>
                </div>
              </div>
            )
          ))}
          {isTyping && (
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#30363d' }}></div>
              <div style={{ background: '#1c2128', border: '1px solid #30363d', borderRadius: '4px 16px 16px 16px', padding: '12px 16px' }}>
                <div style={{ display: 'flex', gap: '4px' }}>
                  <div style={{ width: '8px', height: '8px', background: '#8b949e', borderRadius: '50%', animation: 'bounce 1.4s infinite ease-in-out both' }}></div>
                  <div style={{ width: '8px', height: '8px', background: '#8b949e', borderRadius: '50%', animation: 'bounce 1.4s infinite ease-in-out both 0.15s' }}></div>
                  <div style={{ width: '8px', height: '8px', background: '#8b949e', borderRadius: '50%', animation: 'bounce 1.4s infinite ease-in-out both 0.3s' }}></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messageEndRef} />
        </div>
        <div style={{ padding: '16px 20px', borderTop: '1px solid #30363d', background: '#161b22', position: 'relative' }}>
          {showEmojiPicker && (
            <div style={{
              position: 'absolute',
              bottom: '74px',
              left: '20px',
              background: '#161b22',
              border: '1px solid #30363d',
              borderRadius: '16px',
              padding: '12px',
              display: 'grid',
              gridTemplateColumns: 'repeat(5, minmax(0, 1fr))',
              gap: '8px',
              boxShadow: '0 14px 40px rgba(0, 0, 0, 0.35)',
              zIndex: 10
            }}>
              {emojiOptions.map(emoji => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => handleEmojiSelect(emoji)}
                  style={{
                    background: '#0d1117',
                    border: '1px solid #30363d',
                    borderRadius: '12px',
                    color: '#f0f6fc',
                    fontSize: '18px',
                    padding: '10px',
                    cursor: 'pointer'
                  }}
                >
                  {emoji}
                </button>
              ))}
            </div>
          )}
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center', background: '#0d1117', border: '1px solid #30363d', borderRadius: '12px', padding: '8px 16px' }}>
            <button type="button" onClick={handleEmojiToggle} style={{ background: 'none', border: 'none', color: '#8b949e', fontSize: '20px', cursor: 'pointer' }}>😊</button>
            <input
              type="text"
              placeholder={`Message #${activeChannel}...`}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyDown}
              style={{
                flex: 1,
                background: 'transparent',
                border: 'none',
                outline: 'none',
                color: '#f0f6fc',
                fontSize: '14px',
                fontFamily: 'DM Sans'
              }}
            />
            <button style={{ background: 'none', border: 'none', color: '#8b949e', fontSize: '18px', cursor: 'pointer' }}>📎</button>
            <button
              onClick={handleSend}
              disabled={inputText.trim() === ''}
              className="btn-primary"
              style={{ padding: '8px 16px', borderRadius: '8px', fontSize: '13px' }}
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;