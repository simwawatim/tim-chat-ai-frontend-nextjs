import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/cjs/styles/prism';



export default function TimChatPromptWithSidebar() {
  const [message, setMessage] = useState('');
  const [history, setHistory] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false); // Loading state for API call
  const [error, setError] = useState(null); // Error message state

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (token) {
      fetch('http://127.0.0.1:8000/chatai/api/user/', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
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
      const res = await fetch('http://127.0.0.1:8000/chatai/chat/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // You can prepend instructions to get markdown-formatted response
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

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 text-gray-800">
      {/* Navbar */}
      <nav className="bg-white shadow p-4 flex justify-between items-center relative">
        <h1 className="text-lg font-bold text-indigo-600">Tim Chat</h1>

        <div className="relative flex items-center gap-2">
          {user ? (
            <>
              <span
                className="text-sm text-gray-600 font-medium cursor-pointer"
                onClick={toggleDropdown}
              >
                {user.first_name} {user.last_name}
              </span>
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-md z-10">
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
            <>
              <div
                className="h-10 w-10 flex items-center justify-center bg-gray-300 text-white text-sm rounded-full font-bold cursor-pointer"
                onClick={toggleDropdown}
              >
                G
              </div>
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-md z-10">
                  <a
                    href="/login"
                    className="block w-full px-4 py-2 text-sm text-left text-blue-600 hover:bg-gray-100"
                  >
                    Login
                  </a>
                </div>
              )}
            </>
          )}
        </div>
      </nav>

      <div className="flex flex-1">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-md p-4 hidden sm:block">
          <h2 className="text-xl font-bold mb-4">🕘 History</h2>
          <ul className="space-y-2 text-sm">
            {history.length === 0 && <li className="text-gray-400">No chats yet</li>}
            {history.map((chat) => (
              <li
                key={chat.id}
                className={`p-2 rounded cursor-pointer hover:bg-gray-100 ${
                  activeChat?.id === chat.id ? 'bg-indigo-100 font-semibold' : ''
                }`}
                onClick={() => handleHistoryClick(chat)}
              >
                {chat.title}
              </li>
            ))}
          </ul>
        </div>

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col items-center justify-center px-4 py-10 max-w-4xl mx-auto w-full">
          <h1 className="text-3xl sm:text-5xl font-bold text-center mb-8">🤖 Tim Chat AI</h1>

          {/* Chat Window */}
          <div className="w-full bg-white p-6 rounded-xl shadow space-y-4 flex flex-col">
            <div className="h-64 overflow-y-auto space-y-2 border border-gray-200 rounded p-4 bg-gray-50 flex-1">
              {activeChat?.messages?.length ? (
                activeChat.messages.map((msg, i) => (
                  <div
                    key={i}
                    className={`text-sm p-2 rounded-lg max-w-[80%] whitespace-pre-wrap ${
                      msg.role === 'user'
                        ? 'ml-auto bg-indigo-100 text-right'
                        : 'bg-gray-200 text-left'
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
                <p className="text-gray-400 text-sm text-center">
                  Start a conversation with Tim Chat AI.
                </p>
              )}
            </div>

            {error && (
              <p className="text-red-600 text-center text-sm font-semibold">{error}</p>
            )}

            {/* Input Box */}
            <form onSubmit={handleSubmit} className="flex gap-3 mt-4">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Ask something..."
                disabled={loading}
                className="flex-1 px-4 py-2 rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
              <button
                type="submit"
                disabled={loading}
                className={`px-4 py-2 rounded-lg text-white ${
                  loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-500'
                }`}
              >
                {loading ? 'Sending...' : 'Send'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
