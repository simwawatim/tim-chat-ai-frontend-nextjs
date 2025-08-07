import React, { FormEvent, useState } from 'react';

const BASE_URL = 'https://timprojects.pythonanywhere.com/chatai';

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<'error' | 'success' | null>(null);

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const target = e.target as typeof e.target & {
      email: { value: string };
      password: { value: string };
    };

    const data = {
      email: target.email.value, // ✅ use 'email' here
      password: target.password.value,
    };

    setLoading(true);
    setMessage(null);
    setMessageType(null);

    try {
      const res = await fetch(`${BASE_URL}/login/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      let result;
      try {
        result = await res.json();
      } catch {
        result = null;
      }

      if (res.ok) {
        setMessage('Login successful! Redirecting...');
        setMessageType('success');

        if (result && result.token) {
          localStorage.setItem('token', result.token); // Save token if present
        }

        setTimeout(() => {
          window.location.href = '/chat'; // Redirect after success
        }, 1500);
      } else {
        const errorMessage =
          (result && (result.error || result.detail)) ||
          (result && typeof result === 'object' ? JSON.stringify(result) : null) ||
          'Login failed. Please check your credentials and try again.';
        setMessage(errorMessage);
        setMessageType('error');
      }
    } catch (error: any) {
      console.error('Network or unexpected error:', error);

      if (error instanceof TypeError) {
        setMessage(
          'Network error: Unable to reach the server. Please check your internet connection or server status.'
        );
      } else {
        setMessage('An unexpected error occurred. Please try again later.');
      }
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="max-w-md w-full bg-white shadow-md rounded-xl p-8 space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-indigo-600">Tim Chat AI</h1>
          <p className="text-sm text-gray-500 mt-2">Sign in to your account</p>
        </div>

        <form className="space-y-4" onSubmit={handleLogin}>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              disabled={loading}
              className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              disabled={loading}
              className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 rounded-lg text-white transition ${
              loading ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-500'
            }`}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        {message && (
          <div
            className={`mt-4 p-3 rounded text-center ${
              messageType === 'error'
                ? 'bg-red-100 text-red-700'
                : 'bg-green-100 text-green-700'
            }`}
            role="alert"
          >
            {message}
          </div>
        )}

        <div className="text-center text-sm text-gray-400">or continue as guest</div>

        <div className="text-center">
          <a
            href="/chat"
            className="inline-block w-full bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300 transition"
          >
            Continue to Tim Chat
          </a>
        </div>

        <div className="mt-6 text-center text-sm">
          Don't have an account?{' '}
          <a href="/signup" className="text-indigo-600 hover:underline">
            Register
          </a>
        </div>
      </div>
    </div>
  );
}
