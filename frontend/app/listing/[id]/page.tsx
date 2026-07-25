'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { MapPin, BedDouble, Bath, Phone, MessageCircle, Home } from 'lucide-react';
import { getListingById } from '@/lib/api';

interface ListingDetail {
  id: number;
  title: string;
  description: string;
  price: number;
  location: string;
  bedrooms: number;
  bathrooms: number;
  images: string[];
  agent: { name: string; phone: string; email: string };
}

export default function ListingDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const [listing, setListing] = useState<ListingDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    getListingById(id).then((res) => {
      setLoading(false);
      if (res.listing) setListing(res.listing);
    });
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-gray-400">Loading...</p>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-gray-400">Listing not found.</p>
      </div>
    );
  }

  const images = listing.images?.length ? listing.images : [];

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Nav */}
      <nav className="border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 lg:px-10 py-5 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-violet-600 flex items-center justify-center">
              <Home className="w-4 h-4 text-white" />
            </div>
            <span className="text-base font-black">RentSure</span>
          </a>
          <a href="/" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">
            ← Back to listings
          </a>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 lg:px-10 py-10">
        {/* Image gallery */}
        <div className="aspect-[16/9] bg-gray-100 rounded-2xl overflow-hidden mb-3 relative">
          {images.length > 0 ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={images[activeImage]}
              alt={listing.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              No image available
            </div>
          )}

          <div className="absolute top-4 left-4 bg-black/70 backdrop-blur-sm text-white text-xs font-bold px-3 py-1.5 rounded-lg">
            Verified Listing
          </div>
        </div>

        {images.length > 1 && (
          <div className="flex gap-2 mb-10">
            {images.map((img, i) => (
              <button
                key={i}
                onClick={() => setActiveImage(i)}
                className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-colors ${
                  activeImage === i ? 'border-violet-600' : 'border-transparent'
                }`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}

        <div className="grid md:grid-cols-3 gap-10">
          <div className="md:col-span-2">
            <p className="text-violet-600 text-3xl font-black mb-2">
              ₦{listing.price.toLocaleString()}
              <span className="text-sm text-gray-400 font-medium"> / year</span>
            </p>
            <h1 className="text-2xl font-bold mb-2">{listing.title}</h1>
            <p className="text-gray-500 flex items-center gap-1 mb-6">
              <MapPin className="w-4 h-4" /> {listing.location}
            </p>

            <div className="flex gap-3 mb-8">
              <span className="flex items-center gap-2 bg-gray-50 border border-gray-100 px-4 py-2.5 rounded-xl text-sm font-medium">
                <BedDouble className="w-4 h-4 text-violet-600" /> {listing.bedrooms} Bedrooms
              </span>
              <span className="flex items-center gap-2 bg-gray-50 border border-gray-100 px-4 py-2.5 rounded-xl text-sm font-medium">
                <Bath className="w-4 h-4 text-violet-600" /> {listing.bathrooms} Bathrooms
              </span>
            </div>

            <h2 className="text-lg font-bold mb-2">Description</h2>
            <p className="text-gray-600 leading-relaxed">{listing.description}</p>
          </div>

          <div>
            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 sticky top-24">
              <h3 className="text-xs font-bold tracking-wide text-gray-400 mb-1">LISTED BY</h3>
              <p className="font-bold text-lg mb-6">{listing.agent.name}</p>

              
              <a  href={`tel:${listing.agent.phone}`}
                className="flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-700 text-white py-3.5 rounded-xl font-bold transition-colors mb-2.5"
              >
                <Phone className="w-4 h-4" /> {listing.agent.phone}
              </a>
              
              <a  href={`https://wa.me/${listing.agent.phone.replace(/^0/, '234')}`}
                target="_blank"
                className="flex items-center justify-center gap-2 bg-black hover:bg-gray-800 text-white py-3.5 rounded-xl font-bold transition-colors"
              >
                <MessageCircle className="w-4 h-4" /> WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
