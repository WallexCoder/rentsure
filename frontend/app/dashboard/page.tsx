'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getMyListings, deleteListing } from '@/lib/api';

interface Listing {
  id: number;
  title: string;
  price: number;
  location: string;
  bedrooms: number;
  bathrooms: number;
  images: string[];
}

export default function DashboardPage() {
  const router = useRouter();
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    const token = localStorage.getItem('token');

    if (!token) {
      router.push('/login');
      return;
    }

    if (userStr) {
      const user = JSON.parse(userStr);
      if (user.role !== 'AGENT') {
        router.push('/');
        return;
      }
    }

    fetchListings();
  }, [router]);

  const fetchListings = async () => {
    setLoading(true);
    const res = await getMyListings();
    setLoading(false);
    if (res.listings) setListings(res.listings);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this listing?')) return;
    await deleteListing(id);
    fetchListings();
  };

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <div className="max-w-4xl mx-auto px-6 py-10">
        <a href="/" className="text-sm text-gray-400 hover:text-gray-900 mb-6 inline-block">
          ← Back to listings
        </a>

        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-black">My Listings</h1>
          
           <a  href="/dashboard/new"
            className="bg-violet-600 hover:bg-violet-700 text-white px-5 py-2.5 rounded-xl font-bold text-sm transition-colors"
          >
            + Add Listing
          </a>
        </div>

        {loading && <p className="text-gray-500">Loading...</p>}

        {!loading && listings.length === 0 && (
          <div className="bg-gray-50 rounded-2xl p-8 text-center border border-gray-100">
            <p className="text-gray-500 mb-4">You haven&apos;t posted any listings yet.</p>
            <a href="/dashboard/new" className="text-violet-600 font-bold hover:underline">
              Post your first listing
            </a>
          </div>
        )}

        <div className="space-y-3">
          {listings.map((listing) => (
            <div
              key={listing.id}
              className="bg-white rounded-2xl p-4 border border-gray-100 flex items-center gap-4"
            >
              <div className="w-20 h-20 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                {listing.images?.[0] ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={listing.images[0]}
                    alt={listing.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                    No image
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-violet-600 font-bold">₦{listing.price.toLocaleString()}</p>
                <h3 className="font-semibold truncate">{listing.title}</h3>
                <p className="text-sm text-gray-500">{listing.location}</p>
              </div>

              <div className="flex gap-2 flex-shrink-0">
                
                 <a href={`/listing/${listing.id}`}
                  className="text-sm text-gray-500 hover:text-gray-900 px-3 py-2"
                >
                  View
                </a>
                <button
                  onClick={() => handleDelete(listing.id)}
                  className="text-sm text-red-500 hover:text-red-600 px-3 py-2"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

