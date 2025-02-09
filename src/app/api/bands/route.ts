import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import connectMongoDB from '@/app/lib/mongodb';
import Band from '@/app/models/band';

export async function GET(request: NextRequest) {
    await connectMongoDB();
    const { searchParams } = new URL(request.url);
    // Extract the managerId from the query string
    const managerId = searchParams.get("managerId");
  
    // Build the query object conditionally
    const query = managerId ? { manager: managerId } : {};
  
    // Find bands with or without filtering
    const bands = await Band.find(query);
    return NextResponse.json({ success: true, bands });
  }