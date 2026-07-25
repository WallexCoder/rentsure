'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createListing } from '@/lib/api';

export default function NewListingPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    title: '',
    description: '',
    price: '',
    location: '',
    bedrooms: '',
    bathrooms: '',
  });
  const [imageUrls, setImageUrls] = useState(['']);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (index: number, value: string) => {
    const updated = [...imageUrls];
    updated[index] = value;
    setImageUrls(updated);
  };

  const addImageField = () => setImageUrls([...imageUrls, '']);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const images = imageUrls.filter((url) => url.trim() !== '');

    const res = await createListing({ ...form, images });
    setLoading(false);

    if (res.error) {
      setError(res.error);
      return;
    }

    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 px-6 py-10">
      <div className="max-w-md mx-auto">
        <a href="/dashboard" className="text-sm text-gray-400 hover:text-gray-900 mb-6 inline-block">
          ← Back to dashboard
        </a>

        <h1 className="text-2xl font-black mb-1">Add a listing</h1>
        <p className="text-gray-500 text-sm mb-8">Fill in the details of the property.</p>

        {error && (
          <p className="text-red-600 text-sm mb-4 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="title"
            placeholder="Title (e.g. 3 Bedroom Flat in Lekki)"
            value={form.title}
            onChange={handleChange}
            className="w-full border border-gray-200 rounded-xl px-4 py-3.5 outline-none focus:border-violet-500 transition-colors"
            required
          />

          <textarea
            name="description"
            placeholder="Description"
            value={form.description}
            onChange={handleChange}
            rows={4}
            className="w-full border border-gray-200 rounded-xl px-4 py-3.5 outline-none focus:border-violet-500 transition-colors resize-none"
            required
          />

          <input
            type="number"
            name="price"
            placeholder="Price (₦ per year)"
            value={form.price}
            onChange={handleChange}
            className="w-full border border-gray-200 rounded-xl px-4 py-3.5 outline-none focus:border-violet-500 transition-colors"
            required
          />

          <input
            type="text"
            name="location"
            placeholder="Location (e.g. Lekki, Lagos)"
            value={form.location}
            onChange={handleChange}
            className="w-full border border-gray-200 rounded-xl px-4 py-3.5 outline-none focus:border-violet-500 transition-colors"
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <input
              type="number"
              name="bedrooms"
              placeholder="Bedrooms"
              value={form.bedrooms}
              onChange={handleChange}
              className="w-full border border-gray-200 rounded-xl px-4 py-3.5 outline-none focus:border-violet-500 transition-colors"
              required
            />
            <input
              type="number"
              name="bathrooms"
              placeholder="Bathrooms"
              value={form.bathrooms}
              onChange={handleChange}
              className="w-full border border-gray-200 rounded-xl px-4 py-3.5 outline-none focus:border-violet-500 transition-colors"
              required
            />
          </div>

          <div>
            <p className="text-sm text-gray-500 mb-2">Image URLs</p>
            {imageUrls.map((url, i) => (
              <input
                key={i}
                type="url"
                placeholder="https://..."
                value={url}
                onChange={(e) => handleImageChange(i, e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-3.5 outline-none focus:border-violet-500 transition-colors mb-2"
              />
            ))}
            <button
              type="button"
              onClick={addImageField}
              className="text-sm text-violet-600 hover:underline"
            >
              + Add another image
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-violet-600 hover:bg-violet-700 text-white font-bold py-3.5 rounded-xl transition-colors disabled:opacity-60"
          >
            {loading ? 'Publishing...' : 'Publish listing'}
          </button>
        </form>
      </div>
    </div>
  );
}