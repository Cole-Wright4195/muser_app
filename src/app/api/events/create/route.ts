import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import connectMongoDB from '@/app/lib/mongodb';
import Band from '@/app/models/band';
import Event from '@/app/models/event';

export async function POST(request: NextRequest) {
  await connectMongoDB();
  try {
    const { bandId, eventname, date, location } = await request.json();

    console.log("bandId received:", bandId);

    // Find the band and populate members
    const band = await Band.findById(bandId).populate('members');
    if (!band) {
      return NextResponse.json(
        { success: false, message: 'Band not found' },
        { status: 404 }
      );
    }

    // Ensure members exist before mapping
    if (!band.members || band.members.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Band has no members' },
        { status: 400 }
      );
    }

    // Build attendance list
    const attendance = band.members.map((member: any) => ({
      user: member._id,
      response: 'Pending',
    }));

    // Create event with converted date
    const event = await Event.create({
      band: bandId,
      eventname,
      date: new Date(date),  // Convert date string to Date object
      location,
      attendance,
    });

    return NextResponse.json({ success: true, event }, { status: 201 });

  } catch (error: any) {
    console.error("Event Creation Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || 'Event creation failed' },
      { status: 500 }
    );
  }
}
