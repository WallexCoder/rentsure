'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Home, MapPin, BedDouble, Bath, Wallet, ArrowRight } from 'lucide-react';
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

  const [location, setLocation] = useState('');
  const [bedrooms, setBedrooms] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) setUser(JSON.parse(storedUser));
    fetchListings();
  }, []);

  const fetchListings = async (filters?: { location?: string; bedrooms?: string; maxPrice?: string }) => {
    setLoading(true);
    const res = await getListings(filters);
    setLoading(false);
    if (res.listings) setListings(res.listings);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchListings({
      location: location || undefined,
      bedrooms: bedrooms || undefined,
      maxPrice: maxPrice || undefined,
    });
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Nav */}
     

      {/* Hero */}
      {/* ========================= HERO SECTION ========================= */}

<section className="relative min-h-screen overflow-hidden">
  {/* Background */}
  <div className="absolute inset-0">
    <img
      src="https://images.unsplash.com/photo-1600585154526-990dced4db0d?q=80&w=2070&auto=format&fit=crop"
      alt="Luxury Home"
      className="w-full h-full object-cover"
    />

    <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-purple-950/50" />
  </div>

  {/* Navbar */}
  <nav className="absolute top-0 left-0 w-full z-50">
    <div className="max-w-7xl mx-auto px-6 lg:px-10 py-6 flex items-center justify-between">

      <a href="/" className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-2xl bg-violet-600 flex items-center justify-center shadow-xl">
          <Home className="text-white w-6 h-6" />
        </div>

        <div>
          <h2 className="text-2xl font-black text-white">
            RentSure
          </h2>

          <p className="text-white/60 text-xs">
            Verified Rentals
          </p>
        </div>
      </a>

      <div className="hidden lg:flex items-center gap-10 text-white/80">

        <a href="/" className="hover:text-white transition">
          Home
        </a>

        <a href="#properties" className="hover:text-white transition">
          Properties
        </a>

        <a href="#">
          Agents
        </a>

        <a href="#">
          About
        </a>

        <a href="#">
          Contact
        </a>

      </div>

      {user ? (

        <div className="flex items-center gap-5">

          <span className="text-white">
            Hi {user.name.split(" ")[0]}
          </span>

          <button
            onClick={handleLogout}
            className="px-6 py-3 rounded-xl bg-white text-black font-semibold hover:bg-gray-200 transition"
          >
            Logout
          </button>

        </div>

      ) : (

        <div className="flex items-center gap-4">

          <a
            href="/login"
            className="text-white"
          >
            Login
          </a>

          <a
            href="/register"
            className="px-6 py-3 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-semibold transition"
          >
            Get Started
          </a>

        </div>

      )}

    </div>
  </nav>

  {/* Hero Content */}

  <div className="relative z-20 flex items-center min-h-screen">

    <div className="max-w-7xl mx-auto px-6 lg:px-10 w-full">

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: .8 }}
        className="max-w-4xl"
      >

        <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/10 backdrop-blur-lg border border-white/20 text-white mb-8">

          <span className="w-2 h-2 rounded-full bg-green-400"></span>

          Verified Homes Across Nigeria

        </div>

        <h1 className="text-6xl md:text-8xl font-black text-white leading-[0.95] tracking-tight">

          FIND

          <br />

          VERIFIED

          <br />

          HOMES

          <br />

          WITHOUT

          <span className="text-violet-400">

            {" "}SCAMS.

          </span>

        </h1>

        <p className="mt-8 text-xl text-white/80 max-w-2xl leading-9">

          Discover trusted apartments, verified landlords,
          and genuine agents across Nigeria.
          Search thousands of premium listings in seconds.

        </p>

        <div className="mt-10 flex flex-wrap gap-5">

          <a
            href="#properties"
            className="px-8 py-4 rounded-2xl bg-violet-600 hover:bg-violet-700 text-white font-bold text-lg transition"
          >
            Browse Properties
          </a>

          <a
            href="/register"
            className="px-8 py-4 rounded-2xl border border-white/30 backdrop-blur-xl bg-white/10 text-white font-bold text-lg hover:bg-white/20 transition"
          >
            Become an Agent
          </a>

        </div>

      </motion.div>

    </div>

  </div>
</section>

{/* Search Bar */}
      <div className="bg-gradient-to-b from-black to-white px-6 lg:px-10 pb-16 -mt-1">
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          onSubmit={handleSearch}
          className="max-w-5xl mx-auto bg-white rounded-2xl shadow-2xl shadow-black/20 p-3 flex flex-col md:flex-row gap-2"
        >
          <div className="flex-1 flex items-center gap-2.5 px-4">
            <MapPin className="w-4 h-4 text-violet-500 flex-shrink-0" />
            <input
              type="text"
              placeholder="Location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full py-3 outline-none text-sm"
            />
          </div>
          <div className="w-px bg-gray-100 hidden md:block" />
          <div className="flex-1 flex items-center gap-2.5 px-4">
            <BedDouble className="w-4 h-4 text-violet-500 flex-shrink-0" />
            <input
              type="number"
              placeholder="Bedrooms"
              value={bedrooms}
              onChange={(e) => setBedrooms(e.target.value)}
              className="w-full py-3 outline-none text-sm"
            />
          </div>
          <div className="w-px bg-gray-100 hidden md:block" />
          <div className="flex-1 flex items-center gap-2.5 px-4">
            <Wallet className="w-4 h-4 text-violet-500 flex-shrink-0" />
            <input
              type="number"
              placeholder="Max budget"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="w-full py-3 outline-none text-sm"
            />
          </div>
          <button
            type="submit"
            className="bg-violet-600 hover:bg-violet-700 text-white px-8 py-3 rounded-xl text-sm font-bold transition-colors whitespace-nowrap"
          >
            Search Now
          </button>
        </motion.form>
      </div>

      {/* Listings */}
      <div id="properties" className="max-w-7xl mx-auto px-6 lg:px-10 pb-24">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-xs font-bold tracking-widest text-violet-600 mb-2">— AVAILABLE NOW</p>
            <h2 className="text-4xl font-black tracking-tight">Available Properties</h2>
          </div>
        </div>

        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="rounded-2xl border border-gray-100 overflow-hidden animate-pulse">
                <div className="aspect-[4/3] bg-gray-100" />
                <div className="p-4 space-y-2">
                  <div className="h-3 bg-gray-100 rounded w-1/2" />
                  <div className="h-4 bg-gray-100 rounded w-3/4" />
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && listings.length === 0 && (
          <div className="text-center py-16 border border-dashed border-gray-200 rounded-2xl">
            <p className="text-gray-400">No properties match your search.</p>
          </div>
        )}

        {!loading && listings.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {listings.map((listing, i) => (
              <ListingCard key={listing.id} listing={listing} index={i} />
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-black text-white py-14">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-violet-600 flex items-center justify-center">
              <Home className="text-white w-5 h-5" />
            </div>
            <div>
              <p className="font-black text-lg">RentSure</p>
              <p className="text-white/50 text-xs">Verified Rentals</p>
            </div>
          </div>
          <p className="text-white/50 text-sm">Find your next home with confidence.</p>
        </div>
      </footer>
    </div>
  );
}

function ListingCard({ listing, index }: { listing: Listing; index: number }) {
  const image = listing.images?.[0];

  return (
    <motion.a
      href={`/listing/${listing.id}`}
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      whileHover={{ y: -6 }}
      className="rounded-2xl overflow-hidden border border-gray-100 hover:shadow-2xl hover:shadow-violet-200/40 transition-shadow block group"
    >
      <div className="aspect-[4/3] bg-gray-100 overflow-hidden relative">
        {image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={image}
            alt={listing.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
            No image
          </div>
        )}
      </div>

      <div className="px-4 py-3.5">
        <p className="text-sm text-gray-500 mb-1.5 flex items-center gap-1">
          <MapPin className="w-3.5 h-3.5 text-violet-500" /> {listing.location}
        </p>
        <h3 className="font-bold mb-2.5 truncate">{listing.title}</h3>
        <div className="flex items-center gap-4 text-xs text-gray-500">
          <span className="flex items-center gap-1">
            <BedDouble className="w-3.5 h-3.5" /> {listing.bedrooms} Bed
          </span>
          <span className="flex items-center gap-1">
            <Bath className="w-3.5 h-3.5" /> {listing.bathrooms} Bath
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between bg-black text-white px-4 py-3.5">
        <span className="text-xs font-bold bg-violet-600 px-3 py-1.5 rounded-lg flex items-center gap-1">
          View Details <ArrowRight className="w-3 h-3" />
        </span>
        <span className="font-black text-sm">₦{listing.price.toLocaleString()}</span>
      </div>
    </motion.a>
  );
}