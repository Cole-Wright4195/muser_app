import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import connectMongoDB from '@/app/lib/mongodb';
import User from '@/app/models/user';
import Band from '@/app/models/band';

export async function POST(request: NextRequest) {
  await connectMongoDB();
  try {
    const formData = await request.formData();
    const fromNumber = formData.get("From") as string;
    const messageBody = formData.get("Body") as string;

    console.log("📩 Incoming SMS from:", fromNumber, "Message:", messageBody);

    // Find user by phone number
    const user = await User.findOne({ phoneNumber: fromNumber });
    if (!user) {
      console.error("❌ User not found for phone:", fromNumber);
      return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
    }

    // Determine availability status
    let availabilityStatus: 'green' | 'red' | 'yellow' = 'yellow'; // Default is yellow
    if (messageBody.trim().toUpperCase() === "YES") {
      availabilityStatus = 'green'; // Confirmed attendance
    } else if (messageBody.trim().toUpperCase() === "NO") {
      availabilityStatus = 'red'; // Declined attendance
    } else {
      return NextResponse.json({ success: false, message: 'Invalid response' }, { status: 400 });
    }

    // Update user status in Band model
    const updatedBand = await Band.findOneAndUpdate(
      { "members._id": user._id },
      { $set: { "members.$.availability": availabilityStatus } },
      { new: true }
    );

    if (!updatedBand) {
      console.error("❌ Band not found for user:", user._id);
      return NextResponse.json({ success: false, message: 'Band not found' }, { status: 404 });
    }

    console.log(`✅ Updated ${user.firstName}'s availability to:`, availabilityStatus);
    return NextResponse.json({ success: true, message: 'Status updated successfully' });

  } catch (error: any) {
    console.error("🚨 Error in Twilio Webhook:", error);
    return NextResponse.json({ success: false, error: error.message || 'Failed to process SMS' }, { status: 500 });
  }
}
