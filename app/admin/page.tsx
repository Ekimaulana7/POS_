'use client';
import { useState, useEffect } from 'react';

export default function AdminPage() {
  const [data, setData] = useState<any>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch('/api/db').then(res => res.json()).then(resData => setData(resData));
  }, []);

  if (!data) return <div className="p-8 text-center text-xl">Loading CMS...</div>;

  const saveToGithub = async () => {
    setSaving(true);
    await fetch('/api/db', { method: 'PUT', body: JSON.stringify(data) });
    setSaving(false);
    alert('Data tersimpan ke GitHub!');
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="flex justify-between mb-8">
        <h1 className="text-3xl font-bold">CMS Backoffice</h1>
        <button onClick={saveToGithub} disabled={saving} className="bg-black text-white px-6 py-2 rounded">
          {saving ? 'Menyimpan...' : 'Simpan Perubahan (Sync GitHub)'}
        </button>
      </div>
      <div className="grid grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-xl font-semibold mb-4">Pengaturan Toko</h2>
          <label className="block mb-2 text-sm">Nama Toko</label>
          <input className="w-full border p-2 rounded mb-4" value={data.store_config.store_name} onChange={e => setData({ ...data, store_config: { ...data.store_config, store_name: e.target.value }})} />
          <label className="block mb-2 text-sm">Alamat</label>
          <input className="w-full border p-2 rounded" value={data.store_config.address} onChange={e => setData({ ...data, store_config: { ...data.store_config, address: e.target.value }})} />
        </div>
        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-xl font-semibold mb-4">Laporan Singkat</h2>
          <p>Total Transaksi: {data.transactions.length}</p>
          <p>Total Produk: {data.products.length}</p>
          <p>Total Pengguna: {data.users.length}</p>
        </div>
      </div>
    </div>
  );
}
