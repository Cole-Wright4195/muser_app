// app/api/auth/session/route.ts
import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import { verifyToken } from '@/app/lib/auth';

export async function GET(request: NextRequest) {
  // Get the token from cookies
  const tokenCookie = request.cookies.get('token');
  if (!tokenCookie) {
    return NextResponse.json(
      { success: false, message: 'No token found' },
      { status: 401 }
    );
  }
  try {
    // Decode and verify the token
    const payload = verifyToken(tokenCookie.value) as { id: string; email: string };
    return NextResponse.json({ success: true, userId: payload.id });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Invalid token' },
      { status: 401 }
    );
  }
}
