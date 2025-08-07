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

  useEffect(() => {
    // Scroll to bottom on activeChat or messages change
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeChat]);

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
          prompt:
            'Please respond in markdown format, use code blocks for code examples.\n\n' +
            message,
        }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`API error: ${res.status} ${errorText}`);
      }

      const data = await res.json();

      const botMsg = {
        role: 'bot',
        text: data.response || 'No response from AI.',
      };

      const newHistory = [...(activeChat?.messages || []), userMsg, botMsg];

      const updatedChat = activeChat
        ? { ...activeChat, messages: newHistory }
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
      console.error('Error calling chat API:', err);
      setError('Failed to get response from AI. Please try again.');
    } finally {
      setLoading(false);
      setMessage('');
    }
  };

  const handleHistoryClick = (chat) => {
    setActiveChat(chat);
    setError(null);
  };

  const toggleDropdown = () => setDropdownOpen((open) => !open);

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 text-gray-800">
      {/* Navbar */}
      <nav className="bg-white shadow p-4 flex justify-between items-center relative">
        <h1 className="text-lg font-bold text-indigo-600">Tim Chat</h1>

        <div className="relative flex items-center gap-3">
          {user ? (
            <>
              <button
                onClick={toggleDropdown}
                className="text-sm text-gray-700 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded"
              >
                {user.first_name} {user.last_name}
              </button>
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-md z-20">
                  <button
                    onClick={handleLogout}
                    className="block w-full px-4 py-2 text-sm text-left text-red-600 hover:bg-gray-100 focus:outline-none"
                  >
                    Logout
                  </button>
                </div>
              )}
            </>
          ) : (
            <>
              <button
                onClick={toggleDropdown}
                className="h-10 w-10 flex items-center justify-center bg-gray-400 text-white text-sm rounded-full font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                G
              </button>
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-md z-20">
                  <a
                    href="/login"
                    className="block w-full px-4 py-2 text-sm text-left text-blue-600 hover:bg-gray-100 focus:outline-none"
                  >
                    Login
                  </a>
                </div>
              )}
            </>
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
                  onClick={() => handleHistoryClick(chat)}
                  className={`cursor-pointer p-3 rounded-md hover:bg-indigo-50 transition-colors select-none ${
                    activeChat?.id === chat.id ? 'bg-indigo-100 font-semibold' : ''
                  }`}
                >
                  {chat.title}
                </li>
              ))}
            </ul>
          )}
        </aside>

        {/* Main Chat Area */}
        <main className="flex-1 flex flex-col justify-center items-center p-6 max-w-4xl mx-auto w-full">
          <h1 className="text-3xl sm:text-5xl font-extrabold text-center mb-10 text-indigo-700">
            🤖 Tim Chat AI
          </h1>

          <section className="w-full max-w-3xl flex flex-col bg-white rounded-xl shadow p-6 space-y-5 h-[520px]">
            {/* Chat messages */}
            <div className="flex-1 overflow-y-auto space-y-3 border border-gray-200 rounded-md p-5 bg-gray-50">
              {activeChat?.messages?.length ? (
                activeChat.messages.map((msg, i) => (
                  <div
                    key={i}
                    className={`max-w-[75%] whitespace-pre-wrap text-sm px-4 py-2 rounded-lg ${
                      msg.role === 'user'
                        ? 'ml-auto bg-indigo-100 text-right text-indigo-900'
                        : 'bg-gray-200 text-left text-gray-900'
                    }`}
                  >
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
                                {...props}
                              >
                                {String(children).replace(/\n$/, '')}
                              </SyntaxHighlighter>
                            ) : (
                              <code className={className} {...props}>
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
                <p className="text-gray-400 text-center select-none">
                  Start a conversation with Tim Chat AI.
                </p>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Error message */}
            {error && (
              <p className="text-red-600 text-center text-sm font-semibold">{error}</p>
            )}

            {/* Input form */}
            <form onSubmit={handleSubmit} className="flex gap-4">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Ask something..."
                disabled={loading}
                className="flex-1 rounded-lg border border-gray-300 px-4 py-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
              <button
                type="submit"
                disabled={loading}
                className={`rounded-lg px-6 py-3 text-white font-semibold transition-colors ${
                  loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-500'
                }`}
              >
                {loading ? 'Sending...' : 'Send'}
              </button>
            </form>
          </section>
        </main>
      </div>
    </div>
  );
}
