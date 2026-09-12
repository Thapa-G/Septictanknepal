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
            <div className="mb-6 p-3.5 bg-[#ffdad6] border border-[#ba1a1a] text-[#93000a] rounded-xl text-[14px] flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">error</span>
              <span>{error}</span>
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
                className="w-full bg-[#f8fafc] border border-[#cbd5e1] rounded-xl p-3 text-[14px] text-[#0f172a] form-input"
                placeholder="admin@example.com"
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
                className="w-full bg-[#f8fafc] border border-[#cbd5e1] rounded-xl p-3 text-[14px] text-[#0f172a] form-input"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#1d4ed8] hover:bg-[#1e40af] text-white h-12 rounded-xl font-bold text-[15px] transition-colors flex items-center justify-center gap-2 shadow-sm disabled:opacity-50 mt-2"
            >
              {loading ? (
                <span>Signing In...</span>
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
