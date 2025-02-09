import { NextResponse, NextRequest } from 'next/server';
import connectMongoDB from "@/app/lib/mongodb";
import Band from "@/app/models/band";

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
    await connectMongoDB();
    try {
      const { id } = params;
  
      // ✅ Ensure `availability` is included in `members`
      const band = await Band.findById(id).populate({
        path: "members",
        select: "firstName lastName availability",
      });
  
      if (!band) {
        return NextResponse.json({ success: false, message: "Band not found" }, { status: 404 });
      }
  
      return NextResponse.json({ success: true, band }, { status: 200 });
    } catch (error: any) {
      console.error("🚨 Error fetching band:", error);
      return NextResponse.json({ success: false, error: error.message || "Failed to get band" }, { status: 500 });
    }
  }
  
