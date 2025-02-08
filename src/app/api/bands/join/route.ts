import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import connectMongoDB from '@/app/lib/mongodb';
import Band from '@/app/models/band';
import User from '@/app/models/user';



export async function POST(request: NextRequest) {
  await connectMongoDB();
  try {
    const { userId, bandCode } = await request.json();
    const band = await Band.findOne({ bandCode });
    if (!band) {
      return NextResponse.json(
        { success: false, message: 'Band not found' },
        { status: 404 }
      );
    }
    // Update the user's band reference and add them to the band's members list.
    await User.findByIdAndUpdate(userId, { band: band._id });
    if (!band.members.includes(userId)) {
      band.members.push(userId);
      await band.save();
    }
    return NextResponse.json({ success: true, band }, { status: 200 });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to join band' },
      { status: 500 }
    );
  }
}
