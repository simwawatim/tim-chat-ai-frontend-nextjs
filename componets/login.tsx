import React from 'react';

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="max-w-md w-full bg-white shadow-md rounded-xl p-8 space-y-6">
        {/* Logo */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-indigo-600">Tim Chat AI</h1>
          <p className="text-sm text-gray-500 mt-2">Sign in to your account</p>
        </div>

        {/* Social Sign-in Buttons */}
        <div className="space-y-3">
          <button className="w-full flex items-center justify-center gap-2 bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600">
            {/* Google Icon */}
            <svg className="w-5 h-5" viewBox="0 0 48 48">
              <path fill="#fff" d="M44.5 20H24v8.5h11.8C34 34.8 29.6 38 24 38c-7 0-13-6-13-13s6-13 13-13c3.3 0 6.3 1.2 8.6 3.4l6.1-6.1C34.6 6.6 29.6 4 24 4 12.4 4 3 13.4 3 25s9.4 21 21 21c10.4 0 20.3-7.6 20.3-21 0-1.3-.1-2.3-.3-3z"/>
            </svg>
            Sign in with Google
          </button>
          <button className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700">
            {/* Facebook Icon */}
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="white">
              <path d="M22.675 0h-21.35C.599 0 0 .6 0 1.327v21.346C0 23.4.6 24 1.325 24H12.82v-9.294H9.692v-3.622h3.127V8.408c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.464.099 2.796.143v3.24l-1.918.001c-1.504 0-1.795.716-1.795 1.763v2.312h3.587l-.467 3.622h-3.12V24h6.116c.725 0 1.325-.6 1.325-1.327V1.327C24 .6 23.4 0 22.675 0z"/>
            </svg>
            Sign in with Facebook
          </button>
          <button className="w-full flex items-center justify-center gap-2 bg-sky-500 text-white py-2 px-4 rounded-lg hover:bg-sky-600">
            {/* Twitter Icon */}
            <svg className="w-5 h-5" fill="white" viewBox="0 0 24 24">
              <path d="M23.954 4.569c-.885.39-1.83.654-2.825.775 
              1.014-.611 1.794-1.574 2.163-2.723-.949.555-2.002.959-3.127 
              1.184-.897-.959-2.178-1.555-3.594-1.555-2.723 
              0-4.928 2.204-4.928 4.928 0 .39.045.765.127 
              1.124-4.094-.205-7.725-2.165-10.148-5.144-.424.722-.666 
              1.561-.666 2.475 0 1.71.87 3.213 2.188 
              4.096-.807-.026-1.566-.248-2.229-.616v.061c0 
              2.385 1.693 4.374 3.946 4.827-.413.111-.849.171-1.296.171-.314 
              0-.615-.03-.916-.086.631 1.953 2.445 
              3.377 4.604 3.419-1.68 1.318-3.809 
              2.105-6.102 2.105-.39 0-.779-.023-1.17-.067 
              2.189 1.394 4.768 2.209 7.557 
              2.209 9.054 0 14-7.496 14-13.986 
              0-.21 0-.423-.015-.634.961-.689 
              1.8-1.56 2.46-2.548l-.047-.02z"/>
            </svg>
            Sign in with Twitter
          </button>
        </div>

        {/* Divider */}
        <div className="relative flex items-center justify-center my-4">
          <span className="absolute inset-x-0 h-px bg-gray-300"></span>
          <span className="relative bg-white px-2 text-gray-400 text-sm">or use email</span>
        </div>

        {/* Email/Password Form */}
        <form className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              required
              className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-500"
          >
            Sign In
          </button>
        </form>

        {/* Continue as Guest */}
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
