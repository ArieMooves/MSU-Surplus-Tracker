"use client";
import { useEffect, useState } from 'react';
import Layout from "../../components/Layout";
import BackButton from "../../components/BackButton";
import { getAssets } from "../../lib/api";
import { Search } from 'lucide-react';

export default function InventoryPage() {
  const [assets, setAssets] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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

  
  const filteredAssets = assets.filter(asset => 
    asset.item_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    asset.asset_tag.includes(searchTerm)
  );

  return (
    <Layout>
      <BackButton />
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-brand-maroon uppercase tracking-tight">Asset Inventory</h1>
          <p className="text-slate-500 text-sm">Managing {filteredAssets.length} items</p>
        </div>

        {/* SEARCH BAR - The "Ease of Search" Demo Feature */}
        <div className="relative max-w-sm w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text"
            placeholder="Search by name or tag (e.g. 49561)"
            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-gold outline-none transition-all shadow-sm"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="p-4 font-bold text-slate-600 text-xs uppercase">Tag</th>
              <th className="p-4 font-bold text-slate-600 text-xs uppercase">Item Name</th>
              <th className="p-4 font-bold text-slate-600 text-xs uppercase">Condition</th>
              <th className="p-4 font-bold text-slate-600 text-xs uppercase">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr><td colSpan="4" className="p-12 text-center text-slate-400 animate-pulse">Fetching MSU Assets...</td></tr>
            ) : filteredAssets.map((asset) => (
              <tr key={asset.asset_id} className="hover:bg-brand-gold/5 transition-colors group">
                <td className="p-4 font-mono text-sm text-brand-maroon font-bold">{asset.asset_tag}</td>
                <td className="p-4 text-slate-700 font-medium">{asset.item_name}</td>
                <td className="p-4">
                  <span className="px-2 py-1 rounded bg-slate-100 text-[10px] font-bold text-slate-500 uppercase">
                    {asset.condition}
                  </span>
                </td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${
                    asset.current_status === 'active' ? 'bg-green-100 text-green-700' : 
                    asset.current_status === 'surplus' ? 'bg-brand-gold/20 text-brand-maroon' : 
                    'bg-slate-200 text-slate-600'
                  }`}>
                    {asset.current_status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredAssets.length === 0 && !loading && (
          <div className="p-12 text-center text-slate-400 italic">No matching assets found.</div>
        )}
      </div>
    </Layout>
  );
}
