// app/api/users/route.ts
import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import connectMongoDB from '@/app/lib/mongodb';
import User from '@/app/models/user';

export async function GET(request: NextRequest) {
  await connectMongoDB();
  
  try {
    // Retrieve all users from the database.
    const users = await User.find({});
    return NextResponse.json({ success: true, users });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to retrieve users' },
      { status: 500 }
    );
  }
}
