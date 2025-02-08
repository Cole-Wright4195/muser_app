import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import connectMongoDB from '@/app/lib/mongodb';
import User from '@/app/models/user';

export async function POST(request: NextRequest) {
  await connectMongoDB();

  try {
    const { email, password } = await request.json();
    // Validate credentials (ensure you implement proper hashing and comparison in a production app)
    const user = await User.findOne({ email });
    if (!user || user.password !== password) {
      return NextResponse.json(
        { success: false, message: 'Invalid credentials' },
        { status: 401 }
      );
    }
    // Optionally generate and return a token/session.
    return NextResponse.json({ success: true, user }, { status: 200 });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json(
      { success: false, error: error.message || 'Login failed' },
      { status: 500 }
    );
  }
}
