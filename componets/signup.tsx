import React from 'react';

export default function Signup() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold text-center text-indigo-600 mb-6">
          Create a Tim Chat Account
        </h2>

        {/* Social sign-up buttons */}
        <div className="space-y-3">
          <button className="w-full flex items-center justify-center bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition">
            Sign up with Google
          </button>
          <button className="w-full flex items-center justify-center bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition">
            Sign up with Facebook
          </button>
          <button className="w-full flex items-center justify-center bg-sky-500 text-white py-2 px-4 rounded-lg hover:bg-sky-600 transition">
            Sign up with Twitter
          </button>
        </div>

        {/* Divider */}
        <div className="my-6 text-center text-sm text-gray-400">or sign up with email</div>

        {/* Email sign up form */}
        <form className="space-y-4">
          <input
            type="text"
            placeholder="Full Name"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:border-indigo-500"
          />
          <input
            type="email"
            placeholder="Email Address"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:border-indigo-500"
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:border-indigo-500"
          />
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition"
          >
            Sign Up
          </button>
        </form>

        {/* Continue as guest */}
        <div className="text-center text-sm text-gray-500 mt-6 mb-2">
          or continue as guest
        </div>
        <div className="text-center">
          <a
            href="/chat"
            className="inline-block w-full bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300 transition"
          >
            Continue to Tim Chat
          </a>
        </div>

        {/* Already have an account */}
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
