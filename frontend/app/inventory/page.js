"use client";
import { useEffect, useState } from 'react';
import Layout from "../../components/Layout";
import BackButton from "../../components/BackButton";
import { getAssets } from "../../lib/api";

export default function InventoryPage() {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch the pseudo-data from the database
    getAssets()
      .then(data => {
        setAssets(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  return (
    <Layout>
      <BackButton />
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-brand-maroon uppercase tracking-tight">
            Asset Inventory
          </h1>
          <p className="text-slate-500">Total Items: {assets.length}</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="p-4 font-bold text-slate-700">Asset Tag</th>
              <th className="p-4 font-bold text-slate-700">Item Name</th>
              <th className="p-4 font-bold text-slate-700">Condition</th>
              <th className="p-4 font-bold text-slate-700">Status</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="4" className="p-8 text-center text-slate-400">Loading MSU Data...</td></tr>
            ) : assets.map((asset) => (
              <tr key={asset.id} className="border-b border-slate-100 hover:bg-stone-50 transition-colors">
                <td className="p-4 font-mono text-sm text-brand-maroon font-bold">{asset.asset_tag}</td>
                <td className="p-4 text-slate-700">{asset.item_name}</td>
                <td className="p-4">
                  <span className="px-2 py-1 rounded-md bg-slate-100 text-xs font-semibold text-slate-600">
                    {asset.condition}
                  </span>
                </td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    asset.current_status === 'active' ? 'bg-green-100 text-green-700' : 
                    asset.current_status === 'surplus' ? 'bg-brand-gold/20 text-brand-maroon' : 
                    'bg-slate-100 text-slate-500'
                  }`}>
                    {asset.current_status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Layout>
  );
}
