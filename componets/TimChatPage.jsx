import React, { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/cjs/styles/prism';

export default function TimChatPromptWithSidebar() {
  const [message, setMessage] = useState('');
  const [history, setHistory] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);
  const dropdownRef = useRef();
  const [copiedIndex, setCopiedIndex] = useState(null);

  // Scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeChat?.messages, loading]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetch('https://timprojects.pythonanywhere.com/chatai/api/user/', {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => {
          if (!res.ok) throw new Error('Unauthorized');
          return res.json();
        })
        .then((data) =>
          setUser({
            username: data.username,
            first_name: data.first_name,
            last_name: data.last_name,
          })
        )
        .catch(() => setUser(null));
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim() || loading) return;

    setLoading(true);
    setError(null);

    const userMsg = { role: 'user', text: message };

    try {
      const res = await fetch('https://timprojects.pythonanywhere.com/chatai/chat/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: `Please respond in markdown format, use code blocks for code examples.\n\n${message}`,
        }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`API error: ${res.status} ${errorText}`);
      }

      const data = await res.json();
      const botMsg = { role: 'bot', text: data.response || 'No response from AI.' };

      const newMessages = [...(activeChat?.messages || []), userMsg, botMsg];
      const updatedChat = activeChat
        ? { ...activeChat, messages: newMessages }
        : {
            id: Date.now(),
            title: message.length > 20 ? message.slice(0, 20) + '...' : message,
            messages: [userMsg, botMsg],
          };

      if (!activeChat) {
        setHistory([updatedChat, ...history]);
        setActiveChat(updatedChat);
      } else {
        setActiveChat(updatedChat);
        setHistory((prev) =>
          prev.map((chat) => (chat.id === updatedChat.id ? updatedChat : chat))
        );
      }
    } catch (err) {
      console.error(err);
      setError('Failed to get response from AI.');
    } finally {
      setLoading(false);
      setMessage('');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  const handleCopy = async (text, index) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 1500);
    } catch {
      alert('Failed to copy text');
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 text-gray-800">
      {/* Navbar */}
      <nav className="bg-white shadow p-4 flex justify-between items-center relative">
        <h1 className="text-lg font-bold text-indigo-600">Tim Chat</h1>

        <div className="relative flex items-center gap-3" ref={dropdownRef}>
          {user ? (
            <>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="text-sm text-gray-700 font-medium focus:outline-none"
              >
                {user.first_name} {user.last_name}
              </button>
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white border rounded shadow z-20">
                  <button
                    onClick={handleLogout}
                    className="block w-full px-4 py-2 text-sm text-left text-red-600 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              )}
            </>
          ) : (
            <a
              href="/login"
              className="h-10 w-10 flex items-center justify-center bg-gray-400 text-white rounded-full"
            >
              G
            </a>
          )}
        </div>
      </nav>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-72 bg-white shadow-md p-5 hidden sm:flex flex-col overflow-y-auto">
          <h2 className="text-xl font-semibold mb-5">🕘 History</h2>
          {history.length === 0 ? (
            <p className="text-gray-400 text-sm select-none">No chats yet</p>
          ) : (
            <ul className="space-y-2 text-sm flex-1 overflow-y-auto">
              {history.map((chat) => (
                <li
                  key={chat.id}
                  onClick={() => setActiveChat(chat)}
                  className={`cursor-pointer p-3 rounded hover:bg-indigo-50 ${
                    activeChat?.id === chat.id ? 'bg-indigo-100 font-semibold' : ''
                  }`}
                >
                  {chat.title}
                </li>
              ))}
            </ul>
          )}
        </aside>

        {/* Chat Area */}
        <main className="flex-1 flex flex-col justify-between p-4 max-w-4xl mx-auto w-full">
          <div className="text-center text-3xl font-bold text-indigo-700 mb-4 sm:mb-6">
            🤖 Tim Chat AI
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto space-y-3 border border-gray-200 rounded-md p-4 bg-gray-50">
            {activeChat?.messages?.length ? (
              activeChat.messages.map((msg, i) => (
                <div
                  key={i}
                  className={`relative max-w-full sm:max-w-[85%] whitespace-pre-wrap text-sm px-4 py-2 rounded-lg break-words overflow-x-auto ${
                    msg.role === 'user'
                      ? 'ml-auto bg-indigo-100 text-indigo-900'
                      : 'bg-gray-200 text-gray-900'
                  }`}
                >
                  {msg.role === 'bot' && (
                    <button
                      onClick={() => handleCopy(msg.text, i)}
                      className="absolute top-1 right-1 text-xs text-gray-600 bg-gray-300 px-2 py-1 rounded hover:bg-gray-400"
                    >
                      {copiedIndex === i ? 'Copied!' : 'Copy'}
                    </button>
                  )}

                  {msg.role === 'bot' ? (
                    <ReactMarkdown
                      components={{
                        code({ node, inline, className, children, ...props }) {
                          const match = /language-(\w+)/.exec(className || '');
                          return !inline && match ? (
                            <SyntaxHighlighter
                              style={oneDark}
                              language={match[1]}
                              PreTag="div"
                              wrapLongLines
                              {...props}
                            >
                              {String(children).replace(/\n$/, '')}
                            </SyntaxHighlighter>
                          ) : (
                            <code className="bg-gray-300 px-1 rounded" {...props}>
                              {children}
                            </code>
                          );
                        },
                      }}
                    >
                      {msg.text}
                    </ReactMarkdown>
                  ) : (
                    msg.text
                  )}
                </div>
              ))
            ) : (
              <p className="text-center text-gray-400">
                Start a conversation with Tim Chat AI.
              </p>
            )}

            {loading && (
              <div className="text-sm italic text-gray-500 animate-pulse">
                Tim is thinking...
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {error && (
            <div className="text-center text-red-600 text-sm mt-2 font-semibold">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="mt-4 flex gap-2">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask something..."
              rows={2}
              className="flex-1 resize-none rounded border border-gray-300 px-4 py-2 shadow-sm focus:ring-2 focus:ring-indigo-500"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading}
              className={`px-5 py-2 text-white font-semibold rounded-lg ${
                loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-500'
              }`}
            >
              {loading ? '...' : 'Send'}
            </button>
          </form>
        </main>
      </div>
    </div>
  );
}
