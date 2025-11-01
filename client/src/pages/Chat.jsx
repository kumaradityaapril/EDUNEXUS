import React, { useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client';

export default function Chat() {
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [room, setRoom] = useState('general'); // Default room
  const [currentUserId, setCurrentUserId] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found');
      return;
    }

    // Connect to Socket.io server
    const newSocket = io('http://localhost:5000', {
      auth: { token },
      transports: ['websocket', 'polling']
    });

    newSocket.on('connect', () => {
      console.log('Connected to chat server');
    });

    newSocket.on('connect_error', (err) => {
      console.error('Connection error:', err);
    });

    newSocket.on('user-info', (userInfo) => {
      console.log('Received user info:', userInfo);
      setCurrentUserId(userInfo.userId);
      // Join default room after getting user info
      if (newSocket.connected) {
        newSocket.emit('join-room', room);
      }
    });

    newSocket.on('joined-room', (roomName) => {
      console.log(`Joined room: ${roomName}`);
    });

    newSocket.on('recent-messages', (msgs) => {
      console.log('Received recent messages:', msgs);
      setMessages(msgs || []);
    });

    newSocket.on('receive-message', (msg) => {
      console.log('Received message:', msg);
      setMessages(prev => [...prev, msg]);
    });

    newSocket.on('error', (err) => {
      console.error('Socket error:', err);
    });

    setSocket(newSocket);

    return () => {
      if (newSocket.connected) {
        newSocket.emit('leave-room', room);
      }
      newSocket.close();
    };
  }, []);

  useEffect(() => {
    // Scroll to bottom when new messages arrive
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (socket && currentUserId && socket.connected) {
      socket.emit('leave-room', room);
      socket.emit('join-room', room);
      setMessages([]);
    }
  }, [room, socket, currentUserId]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (!message.trim() || !socket) return;

    socket.emit('send-message', {
      room,
      message: message.trim()
    });
    setMessage('');
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Chat</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">Room: {room}</p>
        </div>
        <select
          className="px-3 py-2 rounded-lg border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:border-blue-500 focus:outline-none text-sm"
          value={room}
          onChange={(e) => setRoom(e.target.value)}
        >
          <option value="general" className="text-gray-900 dark:text-white">General</option>
          <option value="instructors" className="text-gray-900 dark:text-white">Instructors</option>
          <option value="students" className="text-gray-900 dark:text-white">Students</option>
        </select>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 dark:text-gray-400 mt-8">
            No messages yet. Start the conversation!
          </div>
        ) : (
          messages.map((msg, idx) => {
            const senderId = msg.sender?._id || msg.sender?.id;
            const isOwn = senderId && currentUserId && (senderId.toString() === currentUserId.toString());
            return (
              <div
                key={idx}
                className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    isOwn
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white'
                  }`}
                >
                  {!isOwn && (
                    <div className="text-xs font-semibold mb-1 opacity-80">
                      {msg.sender?.name || 'Unknown'} ({msg.sender?.role || 'user'})
                    </div>
                  )}
                  <div className="text-sm">{msg.message}</div>
                  <div className={`text-xs mt-1 ${isOwn ? 'text-blue-100' : 'text-gray-500 dark:text-gray-400'}`}>
                    {new Date(msg.createdAt).toLocaleTimeString()}
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={sendMessage} className="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex gap-3">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 px-4 py-2 rounded-lg border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
          />
          <button
            type="submit"
            disabled={!message.trim()}
            className="px-6 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
}

