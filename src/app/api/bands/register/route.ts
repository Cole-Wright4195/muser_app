import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import connectMongoDB from "@/app/lib/mongodb";
import Band from "@/app/models/band";
import User from "@/app/models/user";

function generateBandCode(length = 6): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "";
  for (let i = 0; i < length; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

export async function POST(request: NextRequest) {
  await connectMongoDB();
  try {
    const { bandName, managerId, mandatoryPositions } = await request.json();

    // ✅ Fetch manager details
    const manager = await User.findById(managerId);
    if (!manager) {
      return NextResponse.json({ success: false, message: "Manager not found" }, { status: 404 });
    }

    // ✅ Ensure `availability: "yellow"` is set
    const band = await Band.create({
      bandName,
      bandCode: generateBandCode(),
      manager: managerId,
      mandatoryPositions: mandatoryPositions.map((position: string) => ({ position })),
      members: [
        {
          _id: manager._id,
          firstName: manager.firstName, // ✅ Fetch from DB
          lastName: manager.lastName,
          availability: "yellow", // ✅ Default to yellow
        },
      ],
    });

    return NextResponse.json({ success: true, band }, { status: 201 });
  } catch (error: any) {
    console.error("🚨 Band creation failed:", error);
    return NextResponse.json({ success: false, error: error.message || "Band creation failed" }, { status: 500 });
  }
}
