"use client";
import { useEffect, useState } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import Layout from "../../components/Layout";
import BackButton from "../../components/BackButton";
import { getAssetByTag } from "../../lib/api";
import { ScanBarcode, PackageCheck, AlertCircle } from "lucide-react";

export default function ScannerPage() {
  const [scannedAsset, setScannedAsset] = useState(null);
  const [error, setError] = useState(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const scanner = new Html5QrcodeScanner("reader", {
      fps: 10,
      qrbox: { width: 250, height: 250 },
    });

    scanner.render(
      async (decodedText) => {
        setError(null);
        try {
          const asset = await getAssetByTag(decodedText);
          setScannedAsset(asset);
        } catch (err) {
          setScannedAsset(null);
          setError("Asset not found in MSU Database");
        }
      },
      () => {} 
    );

    return () => {
      scanner.clear().catch((e) => console.error("Scanner clear failed", e));
    };
  }, [mounted]);

  if (!mounted) return null; 

  return (
    <Layout>
      <BackButton />
      <div className="flex flex-col items-center">
        <h1 className="text-3xl font-black text-brand-maroon italic mb-8">SCANNER PORTAL</h1>
        <div className="w-full max-w-md bg-white p-4 rounded-3xl shadow-xl border-t-8 border-brand-gold">
          <div id="reader" className="rounded-xl overflow-hidden"></div>
          
          <div className="mt-6">
            {scannedAsset && (
              <div className="bg-green-50 p-5 rounded-xl border border-green-200 animate-in zoom-in-95">
                <h3 className="font-black text-brand-maroon uppercase">{scannedAsset.item_name}</h3>
                <p className="text-brand-maroon/70 font-bold text-xs">Dept: {scannedAsset.location}</p>
                <p className="text-slate-600 text-xs italic mt-2 border-t pt-2">{scannedAsset.description}</p>
              </div>
            )}
            {error && <div className="p-4 bg-red-50 text-red-700 rounded-xl text-center font-bold text-sm">{error}</div>}
          </div>
        </div>
      </div>
    </Layout>
  );
}
