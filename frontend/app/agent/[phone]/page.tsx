'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { getAgentReports } from '@/lib/api';

interface Report {
  id: number;
  agentName: string;
  agentPhone: string;
  description: string;
  area: string;
  createdAt: string;
}

interface AgentData {
  agentName: string;
  agentPhone: string;
  totalReports: number;
  reports: Report[];
}

export default function AgentProfilePage() {
  const params = useParams();
  const phone = decodeURIComponent(params.phone as string);

  const [data, setData] = useState<AgentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    getAgentReports(phone).then((res) => {
      setLoading(false);
      if (res.error) {
        setNotFound(true);
        return;
      }
      setData(res);
    });
  }, [phone]);

  return (
    <div className="min-h-screen bg-[#0B0B12] text-white px-6 py-8">
      <div className="max-w-2xl mx-auto">
        <a href="/" className="text-sm text-gray-400 hover:text-white mb-6 inline-block">
          ← Back to search
        </a>

        {loading && <p className="text-gray-400">Loading...</p>}

        {notFound && !loading && (
          <div>
            <h1 className="text-2xl font-bold mb-2">No reports found</h1>
            <p className="text-gray-400">
              This phone number has no reports on file.
            </p>
          </div>
        )}

        {data && !loading && (
          <>
            <div className="bg-[#1A1A24] rounded-xl p-6 border border-[#2A2A38] mb-8">
              <h1 className="text-2xl font-bold mb-1">{data.agentName}</h1>
              <p className="text-gray-400 mb-4">{data.agentPhone}</p>
              <span className="inline-block bg-red-500/10 text-red-400 text-sm px-3 py-1.5 rounded-lg border border-red-500/20">
                {data.totalReports} report{data.totalReports > 1 ? 's' : ''} filed
              </span>
            </div>

            <h2 className="text-lg font-semibold mb-3">All reports</h2>
            <div className="space-y-3">
              {data.reports.map((r) => (
                <div
                  key={r.id}
                  className="bg-[#1A1A24] rounded-xl p-4 border border-[#2A2A38]"
                >
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-sm text-gray-400">{r.area}</span>
                    <span className="text-xs text-gray-500">
                      {new Date(r.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-300">{r.description}</p>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}