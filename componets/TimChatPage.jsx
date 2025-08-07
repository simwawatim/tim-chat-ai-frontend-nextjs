import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/cjs/styles/prism';

export default function TimChatPromptWithSidebar() {
  const [message, setMessage] = useState('');
  const [history, setHistory] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (activeChat !== null) {
      setMessage(history[activeChat].userMessage);
      setResponse(history[activeChat].assistantResponse);
    }
  }, [activeChat]);

  const handleSubmit = async () => {
    if (!message.trim()) return;

    setLoading(true);
    setResponse('');

    try {
      const res = await fetch('/timchat/prompt/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: message }),
      });

      const data = await res.json();
      setResponse(data.response);

      const newChat = {
        userMessage: message,
        assistantResponse: data.response,
      };

      setHistory([newChat, ...history]);
      setActiveChat(0);
    } catch (err) {
      setResponse('⚠️ Failed to fetch response.');
    } finally {
      setLoading(false);
    }

    setMessage('');
  };

  return (
    <div className="container-fluid mt-3">
      <div className="row">

        {/* Sidebar */}
        <div className="col-md-3 mb-3">
          <div className="list-group shadow rounded">
            {history.length === 0 ? (
              <div className="list-group-item text-center text-muted">No chats yet</div>
            ) : (
              history.map((chat, index) => (
                <button
                  key={index}
                  className={`list-group-item list-group-item-action ${
                    index === activeChat ? 'active' : ''
                  }`}
                  onClick={() => setActiveChat(index)}
                >
                  {chat.userMessage.slice(0, 30)}...
                </button>
              ))
            )}
          </div>
        </div>

        {/* Main Chat Area */}
        <div className="col-md-9">
          <div className="card shadow-sm mb-3">
            <div className="card-body">

              {/* Input */}
              <div className="input-group mb-3">
                <textarea
                  className="form-control"
                  rows="2"
                  placeholder="Ask something..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
                <button
                  className="btn btn-primary"
                  onClick={handleSubmit}
                  disabled={loading}
                >
                  Send
                </button>
              </div>

              {/* Loading */}
              {loading && (
                <div className="alert alert-info py-2">
                  ⏳ Waiting for response...
                </div>
              )}

              {/* Response */}
              {!loading && response && (
                <div className="border rounded p-3 bg-light" style={{ maxHeight: '60vh', overflowY: 'auto' }}>
                  <ReactMarkdown
                    children={response}
                    components={{
                      code({ node, inline, className, children, ...props }) {
                        const match = /language-(\w+)/.exec(className || '');
                        return !inline && match ? (
                          <SyntaxHighlighter style={oneDark} language={match[1]} PreTag="div" {...props}>
                            {String(children).replace(/\n$/, '')}
                          </SyntaxHighlighter>
                        ) : (
                          <code className="bg-dark text-white p-1 rounded small" {...props}>
                            {children}
                          </code>
                        );
                      },
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
