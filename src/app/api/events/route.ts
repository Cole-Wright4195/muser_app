import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import connectMongoDB from '@/app/lib/mongodb';
import Event from '@/app/models/event';

export async function GET(request: NextRequest) {
  await connectMongoDB();
  
  try {
    // Retrieve all users from the database.
    const events = await Event.find({});
    return NextResponse.json({ success: true, events });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to retrieve users' },
      { status: 500 }
    );
  }
}