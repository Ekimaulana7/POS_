import { NextResponse } from 'next/server';
import { getDatabase, encrypt } from '@/lib/utils';

export async function POST(request: Request) {
  const { username, password } = await request.json();
  const db = await getDatabase();
  const user = db.content.users.find((u: any) => u.username === username && u.password === password);
  
  if (!user) return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });

  const session = await encrypt({ id: user.id, role: user.role, name: user.name });
  const response = NextResponse.json({ success: true, role: user.role });
  
  response.cookies.set({ name: 'pos_session', value: session, httpOnly: true, secure: process.env.NODE_ENV === 'production', maxAge: 43200, path: '/' });
  return response;
}
