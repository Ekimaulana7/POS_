'use client';
import { useState, useEffect } from 'react';

export default function CashierPage() {
  const [db, setDb] = useState<any>(null);
  const [cart, setCart] = useState<any[]>([]);
  const [paymentMode, setPaymentMode] = useState<'CASH' | 'QRIS' | null>(null);

  useEffect(() => {
    fetch('/api/db').then(res => res.json()).then(data => setDb(data));
  }, []);

  if (!db) return <div className="p-8 text-center text-xl">Loading Data...</div>;

  const addToCart = (product: any) => {
    const existing = cart.find(item => item.id === product.id);
    if (existing) setCart(cart.map(item => item.id === product.id ? { ...item, qty: item.qty + 1 } : item));
    else setCart([...cart, { ...product, qty: 1 }]);
  };

  const total = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);

  const handleCheckout = async () => {
    const res = await fetch('/api/db', { method: 'POST', body: JSON.stringify({ items: cart, total, paymentMethod: paymentMode, amountPaid: total }) });
    if (res.ok) {
      alert('Checkout Sukses!');
      setCart([]); setPaymentMode(null);
      fetch('/api/db').then(res => res.json()).then(data => setDb(data)); // Refresh Data
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <div className="flex-1 p-6 overflow-y-auto">
        <h1 className="text-2xl font-bold mb-4">{db.store_config.store_name} - Kasir</h1>
        <div className="grid grid-cols-4 gap-4">
          {db.products.map((p: any) => (
            <div key={p.id} onClick={() => addToCart(p)} className="p-4 bg-white border rounded cursor-pointer hover:shadow-md">
              <h3 className="font-semibold">{p.name}</h3>
              <p className="text-blue-500">Rp {p.price.toLocaleString()}</p>
              <p className="text-xs text-gray-400">Stok: {p.stock}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="w-1/3 bg-white p-6 border-l flex flex-col">
        <h2 className="text-xl font-bold mb-4">Keranjang</h2>
        <div className="flex-1 overflow-y-auto">
          {cart.map(item => (
            <div key={item.id} className="flex justify-between mb-2 border-b pb-2">
              <div><p>{item.name}</p><p className="text-sm text-gray-500">{item.qty} x Rp {item.price}</p></div>
              <p className="font-semibold">Rp {(item.price * item.qty).toLocaleString()}</p>
            </div>
          ))}
        </div>
        <div className="border-t pt-4 mt-4">
          <div className="flex justify-between text-xl font-bold mb-4"><span>Total</span><span>Rp {total.toLocaleString()}</span></div>
          <button onClick={() => setPaymentMode('CASH')} className="w-full bg-green-500 text-white p-3 rounded mb-2">Cash</button>
          <button onClick={() => setPaymentMode('QRIS')} className="w-full bg-blue-500 text-white p-3 rounded">QRIS</button>
        </div>
      </div>
      {paymentMode && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-8 rounded text-center">
            <h2 className="text-2xl mb-4">Pembayaran {paymentMode}</h2>
            {paymentMode === 'QRIS' && <img src={db.store_config.qris_image_url} alt="QRIS" className="mb-4 mx-auto max-h-48" />}
            <p className="mb-4 font-bold text-xl">Total: Rp {total.toLocaleString()}</p>
            <button onClick={handleCheckout} className="bg-blue-600 text-white px-6 py-2 rounded mr-2">Konfirmasi Lunas</button>
            <button onClick={() => setPaymentMode(null)} className="bg-gray-400 text-white px-6 py-2 rounded">Batal</button>
          </div>
        </div>
      )}
    </div>
  );
}
