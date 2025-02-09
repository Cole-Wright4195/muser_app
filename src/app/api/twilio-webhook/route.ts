import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import connectMongoDB from '@/app/lib/mongodb';
import User from '@/app/models/user';
import Event from '@/app/models/event';

// Handle Twilio Incoming SMS
export async function POST(request: NextRequest) {
  await connectMongoDB();
  try {
    const formData = await request.formData();
    const fromNumber = formData.get("From") as string;
    const messageBody = formData.get("Body") as string;

    console.log("Incoming SMS from:", fromNumber, "Message:", messageBody);

    // Find the user by phone number
    const user = await User.findOne({ phoneNumber: fromNumber });
    if (!user) {
      return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
    }

    // Determine status based on response
    let statusUpdate;
    if (messageBody.trim().toUpperCase() === "YES") {
      statusUpdate = 'green';
    } else if (messageBody.trim().toUpperCase() === "NO") {
      statusUpdate = 'red';
    } else {
      return NextResponse.json({ success: false, message: 'Invalid response' }, { status: 400 });
    }

    // Update user's attendance status in Event
    await Event.updateMany(
      { "attendance.user": user._id },
      { $set: { "attendance.$.response": messageBody.toUpperCase() } }
    );

    return NextResponse.json({ success: true, message: 'Status updated successfully' });

  } catch (error: any) {
    console.error("Error handling SMS reply:", error);
    return NextResponse.json({ success: false, error: error.message || 'Failed to process SMS' }, { status: 500 });
  }
}
