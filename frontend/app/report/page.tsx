'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createReport } from '@/lib/api';

export default function ReportPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    agentName: '',
    agentPhone: '',
    description: '',
    area: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
    }
  }, [router]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    const res = await createReport(form);
    setLoading(false);

    if (res.error) {
      setError(res.error);
      return;
    }

    setSuccess('Report submitted successfully!');
    setForm({ agentName: '', agentPhone: '', description: '', area: '' });

    setTimeout(() => {
      router.push('/');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#0B0B12] text-white px-6 py-8">
      <div className="max-w-md mx-auto">
        <a href="/" className="text-sm text-gray-400 hover:text-white mb-6 inline-block">
          ← Back
        </a>

        <h1 className="text-2xl font-bold mb-1">Report an agent</h1>
        <p className="text-gray-400 text-sm mb-8">
          Help others avoid a bad experience. Be factual and specific.
        </p>

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
            name="agentName"
            placeholder="Agent's name"
            value={form.agentName}
            onChange={handleChange}
            className="w-full bg-[#1A1A24] text-white placeholder-gray-500 rounded-xl px-4 py-3.5 outline-none border border-transparent focus:border-[#A78BFA] transition-colors"
            required
          />

          <input
            type="tel"
            name="agentPhone"
            placeholder="Agent's phone number"
            value={form.agentPhone}
            onChange={handleChange}
            className="w-full bg-[#1A1A24] text-white placeholder-gray-500 rounded-xl px-4 py-3.5 outline-none border border-transparent focus:border-[#A78BFA] transition-colors"
            required
          />

          <input
            type="text"
            name="area"
            placeholder="Area / location (e.g. Lekki, Lagos)"
            value={form.area}
            onChange={handleChange}
            className="w-full bg-[#1A1A24] text-white placeholder-gray-500 rounded-xl px-4 py-3.5 outline-none border border-transparent focus:border-[#A78BFA] transition-colors"
            required
          />

          <textarea
            name="description"
            placeholder="What happened?"
            value={form.description}
            onChange={handleChange}
            rows={5}
            className="w-full bg-[#1A1A24] text-white placeholder-gray-500 rounded-xl px-4 py-3.5 outline-none border border-transparent focus:border-[#A78BFA] transition-colors resize-none"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#8B5CF6] hover:bg-[#7C3AED] text-white font-medium py-3.5 rounded-xl transition-colors disabled:opacity-60"
          >
            {loading ? 'Submitting...' : 'Submit report'}
          </button>
        </form>
      </div>
    </div>
  );
}