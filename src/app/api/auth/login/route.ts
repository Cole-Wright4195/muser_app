// app/api/auth/login/route.ts
import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import connectMongoDB from '@/app/lib/mongodb';
import User, { IUser } from '@/app/models/user';
import bcrypt from 'bcrypt';
import { generateToken } from '@/app/lib/auth';

export async function POST(request: NextRequest) {
  await connectMongoDB();

  try {
    const { email, password } = await request.json();

    // Find the user by email.
    const user: IUser | null = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ success: false, message: 'Invalid credentials' }, { status: 401 });
    }

    // Compare the provided password with the hashed password.
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return NextResponse.json({ success: false, message: 'Invalid credentials' }, { status: 401 });
    }

    // Generate a JWT token.
    const token = generateToken(user);

    // Set the token in an HTTP‑only cookie.
    const response = NextResponse.json({ success: true, user, token });
    response.cookies.set('token', token, {
      httpOnly: true,
      path: '/',
      // secure: process.env.NODE_ENV === 'production',
      // sameSite: 'strict',
    });
    return response;
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ success: false, error: error.message || 'Login failed' }, { status: 500 });
  }
}
