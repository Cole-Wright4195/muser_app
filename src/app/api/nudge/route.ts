import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import connectMongoDB from '@/app/lib/mongodb';
import User from '@/app/models/user';
import Twilio from 'twilio';

// Twilio Config
const accountSid = process.env.TWILIO_ACCOUNT_SID!;
const authToken = process.env.TWILIO_AUTH_TOKEN!;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER!;
const client = Twilio(accountSid, authToken);

export async function POST(request: NextRequest) {
  await connectMongoDB();
  try {
    console.log("🔹 Received Nudge Request");

    const { userId, bandName } = await request.json();
    console.log("📢 Nudge for UserID:", userId, "Band Name:", bandName);

    // Fetch the user from the database
    const user = await User.findById(userId);
    if (!user) {
      console.error("❌ User not found in database:", userId);
      return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
    }

    console.log("👤 Found User:", user.firstName, user.lastName, "Phone:", user.phoneNumber);

    // Check if the user has a valid phone number
    if (!user.phoneNumber) {
      console.error("❌ User has no phone number:", userId);
      return NextResponse.json({ success: false, message: 'User has no phone number' }, { status: 400 });
    }

    // Send SMS via Twilio
    console.log("📤 Sending Twilio SMS...");
    const message = await client.messages.create({
      body: `Hello ${user.firstName}, you have been nudged for an event with ${bandName}. Reply YES if you're attending or NO if not.`,
      from: twilioPhoneNumber,
      to: process.env.TWILIO_TEST_NUMBER || "+18777804236"
    });

    console.log("✅ Twilio Message Sent! Message SID:", message.sid);
    return NextResponse.json({ success: true, message: 'Nudge sent successfully!' });

  } catch (error: any) {
    console.error("🚨 Error in Nudge API:", error);
    return NextResponse.json({ success: false, error: error.message || 'Failed to send nudge' }, { status: 500 });
  }
}
