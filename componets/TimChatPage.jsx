import React, { useState } from 'react';

export default function TimChatPromptWithSidebar() {
  const [message, setMessage] = useState('');
  const [history, setHistory] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    const userMsg = { role: 'user', text: message };
    const botMsg = {
      role: 'bot',
      text: `You asked: "${message}" — here's a sample response from Tim Chat AI.`,
    };

    const newHistory = [...(activeChat?.messages || []), userMsg, botMsg];

    const updatedChat = activeChat
      ? { ...activeChat, messages: newHistory }
      : {
          id: Date.now(),
          title: message.slice(0, 20) + '...',
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

    setMessage('');
  };

  const handleHistoryClick = (chat) => {
    setActiveChat(chat);
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleLogout = () => {
     window.location.href = '/login';
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 text-gray-800">
      {/* Navbar */}
      <nav className="bg-white shadow p-4 flex justify-between items-center relative">
        <h1 className="text-lg font-bold text-indigo-600">Tim Chat</h1>

        <div className="relative">
          <img
            src="https://i.pravatar.cc/40?img=5"
            alt="User"
            className="h-10 w-10 rounded-full border-2 border-green-500 cursor-pointer"
            onClick={toggleDropdown}
          />
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
        <div className="flex-1 flex flex-col items-center justify-center px-4 py-10">
          <h1 className="text-3xl sm:text-5xl font-bold text-center mb-8">
            🤖 Tim Chat AI
          </h1>

          {/* Chat Window */}
          <div className="w-full max-w-2xl bg-white p-6 rounded-xl shadow space-y-4">
            <div className="h-64 overflow-y-auto space-y-2 border border-gray-200 rounded p-4 bg-gray-50">
              {activeChat?.messages?.length ? (
                activeChat.messages.map((msg, i) => (
                  <div
                    key={i}
                    className={`text-sm p-2 rounded-lg max-w-[80%] ${
                      msg.role === 'user'
                        ? 'ml-auto bg-indigo-100 text-right'
                        : 'bg-gray-200 text-left'
                    }`}
                  >
                    {msg.text}
                  </div>
                ))
              ) : (
                <p className="text-gray-400 text-sm text-center">
                  Start a conversation with Tim Chat AI.
                </p>
              )}
            </div>

            {/* Input Box */}
            <form onSubmit={handleSubmit} className="flex gap-3">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Ask something..."
                className="flex-1 px-4 py-2 rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
              <button
                type="submit"
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-500"
              >
                Send
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
