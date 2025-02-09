// app/api/bands/join/route.ts
import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import connectMongoDB from '@/app/lib/mongodb';
import Band from '@/app/models/band';
import User from '@/app/models/user';

export async function POST(request: NextRequest) {
  await connectMongoDB();
  try {
    const { userId, bandCode } = await request.json();

    // Find the band by its band code.
    const band = await Band.findOne({ bandCode });
    if (!band) {
      return NextResponse.json(
        { success: false, message: 'Band not found' },
        { status: 404 }
      );
    }

    // Find the user by userId.
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    // For each mandatory position, if the user's primaryInstrument matches (ignoring case)
    // and the primary slot is vacant, update filledBy with the user's ObjectId.
    band.mandatoryPositions = band.mandatoryPositions.map((pos) => {
      if (
        user.primaryInstrument &&
        user.primaryInstrument.toLowerCase() === pos.position.toLowerCase() &&
        !pos.filledBy
      ) {
        pos.filledBy = user._id;
      }
      return pos;
    });

    // Also add the user to the band's members array if not already present.
    if (!band.members.some((m) => m.toString() === user._id.toString())) {
      band.members.push(user._id);
    }

    // Save the updated band document.
    await band.save();

    // Populate the filledBy field so that it returns the user document
    // (with firstName and lastName) instead of just the ObjectId.
    await band.populate('mandatoryPositions.filledBy');

    return NextResponse.json({ success: true, band });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to join band' },
      { status: 500 }
    );
  }
}
