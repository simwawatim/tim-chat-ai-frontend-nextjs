import React, { FormEvent, useState } from 'react';

const BASE_URL = 'https://timprojects.pythonanywhere.com/chatai';

export default function Signup() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<'error' | 'success' | null>(null);

  const handleSignup = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const target = e.target as typeof e.target & {
      fullName: { value: string };
      email: { value: string };
      password: { value: string };
    };

    const fullNameParts = target.fullName.value.trim().split(' ');

    const data = {
      username: target.email.value.split('@')[0],
      email: target.email.value,
      password: target.password.value,
      first_name: fullNameParts[0] || '',
      last_name: fullNameParts.slice(1).join(' ') || '',
    };

    setLoading(true);
    setMessage(null);
    setMessageType(null);

    try {
      const res = await fetch(`${BASE_URL}/register/`, {
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
        setMessage('Registration successful! Redirecting to login...');
        setMessageType('success');
        setTimeout(() => {
          window.location.href = '/login';
        }, 1500);
      } else {
        const errorMessage =
          (result && result.detail) ||
          (result && typeof result === 'object' ? JSON.stringify(result) : null) ||
          'Registration failed. Please try again.';
        setMessage(errorMessage);
        setMessageType('error');
      }
    } catch (error: any) {
      console.error('Network or unexpected error:', error);

      if (error instanceof TypeError) {
        // Likely network failure or CORS
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
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold text-center text-indigo-600 mb-6">
          Create a Tim Chat Account
        </h2>

        <form className="space-y-4" onSubmit={handleSignup}>
          <input
            name="fullName"
            type="text"
            placeholder="Full Name"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:border-indigo-500"
            required
            disabled={loading}
          />
          <input
            name="email"
            type="email"
            placeholder="Email Address"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:border-indigo-500"
            required
            disabled={loading}
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:border-indigo-500"
            required
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 px-4 rounded-lg transition ${
              loading
                ? 'bg-indigo-400 cursor-not-allowed'
                : 'bg-indigo-600 hover:bg-indigo-700 text-white'
            }`}
          >
            {loading ? 'Signing up...' : 'Sign Up'}
          </button>
        </form>

        {/* Message Box */}
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

        <div className="text-center text-sm text-gray-500 mt-6 mb-2">or continue as guest</div>
        <div className="text-center">
          <a
            href="/chat"
            className="inline-block w-full bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300 transition"
          >
            Continue to Tim Chat
          </a>
        </div>

        <div className="mt-6 text-center text-sm">
          Already have an account?{' '}
          <a href="/login" className="text-indigo-600 hover:underline">
            Log in
          </a>
        </div>
      </div>
    </div>
  );
}
