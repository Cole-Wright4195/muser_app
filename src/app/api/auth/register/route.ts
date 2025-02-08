// app/api/auth/register/route.ts
import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import connectMongoDB from '@/app/lib/mongodb';
import User, { IUser } from '@/app/models/user';
import bcrypt from 'bcrypt';
import { generateToken } from '@/app/lib/auth';

export async function POST(request: NextRequest) {
  await connectMongoDB();

  try {
    const data = await request.json();
    const { email, password, firstName, lastName, phoneNumber, primaryInstrument, backupInstrument, isManager } = data;
    
    // Check if a user with the provided email already exists.
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ success: false, message: 'User already exists' }, { status: 400 });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the new user
    const newUser: IUser = await User.create({
      email,
      password: hashedPassword,
      firstName,
      lastName,
      phoneNumber,
      primaryInstrument,
      backupInstrument,
      isManager: isManager || false,
    });

    // Generate a JWT token
    const token = generateToken(newUser);

    // Create the response and set an HTTP‑only cookie for the token.
    const response = NextResponse.json({ success: true, user: newUser, token });
    response.cookies.set('token', token, {
      httpOnly: true,
      path: '/',
      // secure: process.env.NODE_ENV === 'production',
      // sameSite: 'strict',
    });
    return response;
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ success: false, error: error.message || 'Registration failed' }, { status: 500 });
  }
}
