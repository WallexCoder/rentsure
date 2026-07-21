'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { searchReports, getRecentReports } from '@/lib/api';

interface Report {
  id: number;
  agentName: string;
  agentPhone: string;
  description: string;
  area: string;
  createdAt: string;
}

export default function HomePage() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Report[] | null>(null);
  const [recent, setRecent] = useState<Report[]>([]);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<{ name: string } | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) setUser(JSON.parse(storedUser));

    getRecentReports().then((res) => {
      if (res.reports) setRecent(res.reports);
    });
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    const res = await searchReports(query);
    setLoading(false);

    setResults(res.reports || []);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-[#0B0B12] text-white px-6 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-xl font-semibold">
            Agent<span className="text-[#A78BFA]">Check</span>
          </h1>

          {user ? (
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-400">Hi, {user.name.split(' ')[0]}</span>
              <button
                onClick={handleLogout}
                className="text-sm text-gray-400 hover:text-white"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex gap-3">
              <a href="/login" className="text-sm text-gray-300 hover:text-white">
                Log in
              </a>
              
              <a  href="/register"
                className="text-sm bg-[#8B5CF6] px-4 py-2 rounded-lg hover:bg-[#7C3AED]"
              >
                Sign up
              </a>
            </div>
          )}
        </div>

        <h2 className="text-3xl font-bold mb-2">Check an agent before you pay</h2>
        <p className="text-gray-400 mb-8">
          Search by name or phone number to see if others have reported them.
        </p>

        <form onSubmit={handleSearch} className="flex gap-3 mb-4">
          <input
            type="text"
            placeholder="Agent name or phone number"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-[#1A1A24] text-white placeholder-gray-500 rounded-xl px-4 py-3.5 outline-none border border-transparent focus:border-[#A78BFA] transition-colors"
          />
          <button
            type="submit"
            className="bg-[#8B5CF6] hover:bg-[#7C3AED] px-6 rounded-xl font-medium transition-colors"
          >
            Search
          </button>
        </form>

        {user && (
          
          <a  href="/report"
            className="inline-block text-sm text-[#A78BFA] mb-8 hover:underline"
          >
            + Report an agent
          </a>
        )}

        {loading && <p className="text-gray-400">Searching...</p>}

        {results !== null && !loading && (
          <div className="mb-10">
            <h3 className="text-lg font-semibold mb-3">
              {results.length === 0
                ? 'No reports found'
                : `${results.length} report(s) found`}
            </h3>
            {results.length === 0 && (
              <p className="text-gray-400 text-sm">
                This agent has no reports yet — but always stay cautious.
              </p>
            )}
            <div className="space-y-3">
              {results.map((r) => (
                <ReportCard key={r.id} report={r} />
              ))}
            </div>
          </div>
        )}

        <div>
          <h3 className="text-lg font-semibold mb-3">Recent reports</h3>
          <div className="space-y-3">
            {recent.length === 0 && (
              <p className="text-gray-400 text-sm">No reports yet.</p>
            )}
            {recent.map((r) => (
              <ReportCard key={r.id} report={r} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ReportCard({ report }: { report: Report }) {
  return (
    <div className="bg-[#1A1A24] rounded-xl p-4 border border-[#2A2A38]">
      <div className="flex justify-between items-start mb-1">
        <h4 className="font-medium">{report.agentName}</h4>
        <span className="text-xs text-gray-500">
          {new Date(report.createdAt).toLocaleDateString()}
        </span>
      </div>
      <p className="text-sm text-gray-400 mb-2">{report.agentPhone} · {report.area}</p>
      <p className="text-sm text-gray-300">{report.description}</p>
    </div>
  );
}