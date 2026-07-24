'use client';

import { useEffect, useState } from 'react';
import { getListings } from '@/lib/api';

interface Listing {
  id: number;
  title: string;
  description: string;
  price: number;
  location: string;
  bedrooms: number;
  bathrooms: number;
  images: string[];
  agent: { name: string; phone: string };
}

interface User {
  name: string;
  role: 'USER' | 'AGENT';
}

export default function HomePage() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [locationFilter, setLocationFilter] = useState('');

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) setUser(JSON.parse(storedUser));

    fetchListings();
  }, []);

  const fetchListings = async (location?: string) => {
    setLoading(true);
    const res = await getListings(location ? { location } : undefined);
    setLoading(false);
    if (res.listings) setListings(res.listings);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchListings(locationFilter);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-[#0B0B12] text-white">
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-xl font-semibold">
            Rent<span className="text-[#A78BFA]">Sure</span>
          </h1>

          <div className="flex items-center gap-4">
            {user?.role === 'AGENT' && (
              
               <a href="/dashboard"
                className="text-sm bg-[#1A1A24] border border-[#2A2A38] px-4 py-2 rounded-lg hover:border-[#A78BFA]"
              >
                My Dashboard
              </a>
            )}

            {user ? (
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-400">Hi, {user.name.split(' ')[0]}</span>
                <button onClick={handleLogout} className="text-sm text-gray-400 hover:text-white">
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex gap-3">
                <a href="/login" className="text-sm text-gray-300 hover:text-white">
                  Log in
                </a>
                <a
                  href="/register"
                  className="text-sm bg-[#8B5CF6] px-4 py-2 rounded-lg hover:bg-[#7C3AED]"
                >
                  Sign up
                </a>
              </div>
            )}
          </div>
        </div>

        <h2 className="text-3xl font-bold mb-2">Find your next home</h2>
        <p className="text-gray-400 mb-8">Browse verified listings from real agents.</p>

        <form onSubmit={handleSearch} className="flex gap-3 mb-10">
          <input
            type="text"
            placeholder="Search by location (e.g. Lekki, Lagos)"
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
            className="flex-1 bg-[#1A1A24] text-white placeholder-gray-500 rounded-xl px-4 py-3.5 outline-none border border-transparent focus:border-[#A78BFA] transition-colors"
          />
          <button
            type="submit"
            className="bg-[#8B5CF6] hover:bg-[#7C3AED] px-6 rounded-xl font-medium transition-colors"
          >
            Search
          </button>
        </form>

        {loading && <p className="text-gray-400">Loading listings...</p>}

        {!loading && listings.length === 0 && (
          <p className="text-gray-400">No listings found.</p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {listings.map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      </div>
    </div>
  );
}

function ListingCard({ listing }: { listing: Listing }) {
  const image = listing.images?.[0];

  return (
    
    <a  href={`/listing/${listing.id}`}
      className="bg-[#1A1A24] rounded-xl overflow-hidden border border-[#2A2A38] hover:border-[#A78BFA] transition-colors block"
    >
      <div className="aspect-[4/3] bg-[#111118] overflow-hidden">
        {image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={image} alt={listing.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-600 text-sm">
            No image
          </div>
        )}
      </div>
      <div className="p-4">
        <p className="text-[#A78BFA] font-semibold mb-1">
          ₦{listing.price.toLocaleString()}
        </p>
        <h3 className="font-medium mb-1 truncate">{listing.title}</h3>
        <p className="text-sm text-gray-400 mb-2">{listing.location}</p>
        <div className="flex gap-3 text-xs text-gray-500">
          <span>{listing.bedrooms} bed</span>
          <span>{listing.bathrooms} bath</span>
        </div>
      </div>
    </a>
  );
}