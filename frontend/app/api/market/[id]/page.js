'use client';
import { useEffect, useState } from 'react';
import Layout from '@/components/Layout';

export default function MarketPage({ params }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/market/${params.id}`)
      .then((res) => res.json())
      .then((json) => {
        setData(json);
        setLoading(false);
      });
  }, [params.id]);

  if (loading) return <div className="p-10">Analyzing Market Data...</div>;

  return (
    <Layout>
      <div className="p-6 max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-2">Market Analysis: {data.assetName}</h1>
        <p className="text-gray-500 mb-6">AI Optimized Search: "{data.searchQuery}"</p>

        <div className="grid gap-4">
          {data.listings.map((item, index) => (
            <div key={index} className="border p-4 rounded-lg flex justify-between items-center bg-white shadow-sm">
              <div>
                <span className="font-semibold text-blue-600">{item.site}</span>
                <p className="text-sm text-gray-600">Condition: {item.condition}</p>
              </div>
              <div className="text-right">
                <p className="text-xl font-bold">${item.price}</p>
                <a href={item.link} className="text-xs underline text-gray-400">View Listing</a>
              </div>
            </div>
          ))}
        </div>

        <button 
          onClick={() => window.history.back()}
          className="mt-8 text-blue-500 hover:underline"
        >
          ← Back to Inventory
        </button>
      </div>
    </Layout>
  );
}
