import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import connectMongoDB from '@/app/lib/mongodb';
import Band from '@/app/models/band';
import Event from '@/app/models/event';



export async function POST(request: NextRequest) {
  await connectMongoDB();
  try {
    const { bandId, eventname, date, location } = await request.json();

    // Find the band and populate its members.
    const band = await Band.findById(bandId).populate('members');
    if (!band) {
      return NextResponse.json(
        { success: false, message: 'Band not found' },
        { status: 404 }
      );
    }

    // Prepare the attendance list from band members.
    const attendance = band.members.map((member: any) => ({
      user: member._id,
      response: 'Pending',
    }));

    const event = await Event.create({
      band: bandId,
      eventname,
      date,
      location,
      attendance,
    });

    return NextResponse.json({ success: true, event }, { status: 201 });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json(
      { success: false, error: error.message || 'Event creation failed' },
      { status: 500 }
    );
  }
}
