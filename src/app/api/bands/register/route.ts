import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import connectMongoDB from '@/app/lib/mongodb';
import Band from '@/app/models/band';


function generateBandCode(length = 6): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < length; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

export async function POST(request: NextRequest) {
  await connectMongoDB();
  try {
    const { bandName, managerId, mandatoryPositions } = await request.json();
    // mandatoryPositions is expected to be an array of strings (position names)
    const bandCode = generateBandCode();
    const band = await Band.create({
      bandName,
      bandCode,
      manager: managerId,
      mandatoryPositions: mandatoryPositions.map((position: string) => ({ position })),
      members: [managerId], // The manager is automatically added as a member.
    });
    return NextResponse.json({ success: true, band }, { status: 201 });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json(
      { success: false, error: error.message || 'Band creation failed' },
      { status: 500 }
    );
  }
}
