// app/api/users/[id]/route.ts
import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import connectMongoDB from '@/app/lib/mongodb';
import User from '@/app/models/user';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  await connectMongoDB();

  try {
    // Find the user by their ID from the URL parameter
    const user = await User.findById(params.id);
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    // Return the user information as JSON
    return NextResponse.json({ success: true, user });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to retrieve user' },
      { status: 500 }
    );
  }
}
