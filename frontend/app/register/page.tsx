'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { registerUser } from '@/lib/api';

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '' });
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (form.password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    const res = await registerUser(form);
    setLoading(false);

    if (res.error) {
      setError(res.error);
      return;
    }

    localStorage.setItem('token', res.token);
    localStorage.setItem('user', JSON.stringify(res.user));
    setSuccess('Account created! Redirecting...');

    setTimeout(() => {
      router.push('/');
    }, 1200);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0B0B12] px-6">
      <div className="w-full max-w-sm">
        <h1 className="text-2xl font-semibold text-white mb-1">
          Agent<span className="text-[#A78BFA]">Check</span>
        </h1>

        <h2 className="text-3xl font-bold text-white mt-8 mb-8">Sign up</h2>

        {error && (
          <p className="text-red-400 text-sm mb-4 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
            {error}
          </p>
        )}
        {success && (
          <p className="text-green-400 text-sm mb-4 bg-green-500/10 border border-green-500/20 rounded-lg px-3 py-2">
            {success}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Full name"
            value={form.name}
            onChange={handleChange}
            className="w-full bg-[#1A1A24] text-white placeholder-gray-500 rounded-xl px-4 py-3.5 outline-none border border-transparent focus:border-[#A78BFA] transition-colors"
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="w-full bg-[#1A1A24] text-white placeholder-gray-500 rounded-xl px-4 py-3.5 outline-none border border-transparent focus:border-[#A78BFA] transition-colors"
            required
          />

          <input
            type="tel"
            name="phone"
            placeholder="Phone number"
            value={form.phone}
            onChange={handleChange}
            className="w-full bg-[#1A1A24] text-white placeholder-gray-500 rounded-xl px-4 py-3.5 outline-none border border-transparent focus:border-[#A78BFA] transition-colors"
            required
          />

          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              className="w-full bg-[#1A1A24] text-white placeholder-gray-500 rounded-xl px-4 py-3.5 outline-none border border-transparent focus:border-[#A78BFA] transition-colors pr-12"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm"
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>

          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="Confirm password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full bg-[#1A1A24] text-white placeholder-gray-500 rounded-xl px-4 py-3.5 outline-none border border-transparent focus:border-[#A78BFA] transition-colors"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#8B5CF6] hover:bg-[#7C3AED] text-white font-medium py-3.5 rounded-xl transition-colors disabled:opacity-60 mt-2"
          >
            {loading ? 'Creating account...' : 'Sign up'}
          </button>
        </form>

        <p className="text-sm text-center text-gray-400 mt-8">
          Have an account?{' '}
          <a href="/login" className="text-[#A78BFA] font-medium">
            Log in
          </a>
        </p>
      </div>
    </div>
  );
}