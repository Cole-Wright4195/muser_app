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
  
      // Find the band and user
      const band = await Band.findOne({ bandCode });
      if (!band) {
        return NextResponse.json({ success: false, message: "Band not found" }, { status: 404 });
      }
  
      const user = await User.findById(userId);
      if (!user) {
        return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
      }
  
      // Check if already a member
      const isAlreadyMember = band.members.some((m) => m._id.toString() === user._id.toString());
      if (isAlreadyMember) {
        return NextResponse.json({ success: false, message: "User already in band" }, { status: 400 });
      }
  
      // ✅ Ensure new member has `availability: "yellow"`
      band.members.push({
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        availability: "yellow", // ✅ Default to yellow
      });
  
      // ✅ If this user fills a vacant mandatory position, update `filledBy`
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
  
      await band.save();
      await band.populate("mandatoryPositions.filledBy"); // Ensure `filledBy` is populated
  
      return NextResponse.json({ success: true, band });
    } catch (error: any) {
      console.error("🚨 Error adding user to band:", error);
      return NextResponse.json({ success: false, error: error.message || "Failed to join band" }, { status: 500 });
    }
  }
  
