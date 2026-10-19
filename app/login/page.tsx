'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/auth', { method: 'POST', body: JSON.stringify({ username, password }) });
    const data = await res.json();
    if (data.success) router.push(data.role === 'admin' ? '/admin' : '/cashier');
    else alert('Login Gagal!');
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gray-100">
      <form onSubmit={handleLogin} className="p-8 bg-white rounded shadow-md w-96">
        <h1 className="text-2xl font-bold mb-6 text-center">POS Login</h1>
        <input className="w-full mb-4 p-2 border rounded" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} />
        <input className="w-full mb-6 p-2 border rounded" type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
        <button className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">Login</button>
      </form>
    </div>
  );
}
