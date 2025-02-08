import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import connectMongoDB from '@/app/lib/mongodb';
import Band from '@/app/models/band';

export async function GET(request: NextRequest) {
  await connectMongoDB();
  
  try {
    // Retrieve all users from the database.
    const bands = await Band.find({});
    return NextResponse.json({ success: true, bands });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to retrieve bands' },
      { status: 500 }
    );
  }
}