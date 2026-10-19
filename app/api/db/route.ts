import { NextResponse } from 'next/server';
import { getDatabase, updateDatabase } from '@/lib/utils';

// Untuk Fetch Data ke Klien
export async function GET() {
  const db = await getDatabase();
  return NextResponse.json(db.content);
}

// Untuk Checkout Kasir
export async function POST(request: Request) {
  const { items, total, paymentMethod, amountPaid } = await request.json();
  const db = await getDatabase();
  let dbContent = db.content;

  items.forEach((cartItem: any) => {
    const pIndex = dbContent.products.findIndex((p: any) => p.id === cartItem.id);
    if (pIndex > -1) dbContent.products[pIndex].stock -= cartItem.qty;
  });

  const newTransaction = { id: `TRX-${Date.now()}`, date: new Date().toISOString(), items, total, paymentMethod, amountPaid, change: amountPaid - total };
  dbContent.transactions.push(newTransaction);
  await updateDatabase(dbContent, db.sha, `Checkout TRX: ${newTransaction.id}`);
  return NextResponse.json({ success: true });
}

// Untuk Simpan CMS Admin
export async function PUT(request: Request) {
  const newData = await request.json();
  const db = await getDatabase();
  await updateDatabase(newData, db.sha, 'Admin DB Update');
  return NextResponse.json({ success: true });
}
