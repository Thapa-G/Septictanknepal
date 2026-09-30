'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { authService } from '@/services/authService';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await authService.login(email, password);
      router.push('/admin');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const isLocked = Boolean(error && error.toLowerCase().includes('locked'));

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col justify-center items-center px-4 py-12">
      <meta name="robots" content="noindex, nofollow" />
      <div className="w-full max-w-md">
        {/* Logo and Brand */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-[24px] font-bold text-[#0f172a]">
            <span className="material-symbols-outlined text-[#1d4ed8] text-[32px]" style={{ fontVariationSettings: "'FILL' 1" }}>
              plumbing
            </span>
            <span>Septic-Tank Nepal</span>
          </Link>
          <p className="text-[14px] text-[#475569] mt-1 font-medium">
            Administrative Management Portal
          </p>
        </div>

        {/* Login Box */}
        <div className="bg-white border border-[#cbd5e1] rounded-2xl p-8 shadow-sm">
          <h2 className="text-[20px] font-bold text-[#0f172a] mb-6">
            Sign In to Dashboard
          </h2>

          {error && (
            <div
              className={`mb-6 p-4 rounded-xl text-[14px] flex items-start gap-3 border leading-snug ${
                isLocked
                  ? 'bg-[#fef2f2] border-[#ef4444] text-[#991b1b]'
                  : error.toLowerCase().includes('remaining')
                  ? 'bg-[#fffbeb] border-[#f59e0b] text-[#92400e]'
                  : 'bg-[#ffdad6] border-[#ba1a1a] text-[#93000a]'
              }`}
            >
              <span
                className="material-symbols-outlined text-[20px] shrink-0 mt-0.5"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                {isLocked ? 'lock_clock' : error.toLowerCase().includes('remaining') ? 'warning' : 'error'}
              </span>
              <div>
                <span className="font-bold block mb-0.5">
                  {isLocked
                    ? 'Security Lockout Active'
                    : error.toLowerCase().includes('remaining')
                    ? 'Invalid Credentials'
                    : 'Authentication Error'}
                </span>
                <span>{error}</span>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[14px] font-bold text-[#0f172a] mb-1.5" htmlFor="email">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading || isLocked}
                className="w-full bg-[#f8fafc] border border-[#cbd5e1] rounded-xl p-3 text-[14px] text-[#0f172a] form-input disabled:opacity-60 disabled:cursor-not-allowed"
                placeholder="Enter email address"
                autoComplete="email"
              />
            </div>

            <div>
              <label className="block text-[14px] font-bold text-[#0f172a] mb-1.5" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading || isLocked}
                className="w-full bg-[#f8fafc] border border-[#cbd5e1] rounded-xl p-3 text-[14px] text-[#0f172a] form-input disabled:opacity-60 disabled:cursor-not-allowed"
                placeholder="Enter password"
                autoComplete="current-password"
              />
            </div>

            <button
              type="submit"
              disabled={loading || isLocked}
              className={`w-full h-12 rounded-xl font-bold text-[15px] transition-colors flex items-center justify-center gap-2 shadow-sm mt-2 ${
                isLocked
                  ? 'bg-slate-400 text-white cursor-not-allowed'
                  : 'bg-[#1d4ed8] hover:bg-[#1e40af] text-white disabled:opacity-50'
              }`}
            >
              {loading ? (
                <span>Signing In...</span>
              ) : isLocked ? (
                <>
                  <span className="material-symbols-outlined text-[20px]">lock</span>
                  <span>Account Locked (3 Hours)</span>
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[20px]">login</span>
                  <span>Sign In</span>
                </>
              )}
            </button>
          </form>
        </div>

        <div className="text-center mt-6">
          <Link href="/" className="text-[14px] text-[#475569] hover:text-[#1d4ed8] font-medium inline-flex items-center gap-1">
            <span className="material-symbols-outlined text-sm">arrow_back</span>
            <span>Back to Public Website</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
