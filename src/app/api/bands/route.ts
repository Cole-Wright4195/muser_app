import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import connectMongoDB from '@/app/lib/mongodb';
import Band from '@/app/models/band';

export async function GET(request: NextRequest) {
    await connectMongoDB();
    const { searchParams } = new URL(request.url);
    // Extract the managerId from the query string (if provided)
    const managerId = searchParams.get("managerId");

    // Build the query object conditionally
    const query = managerId ? { manager: managerId } : {};

    try {
        // Find bands, and populate `filledBy` in `mandatoryPositions` with `firstName` & `lastName`
        const bands = await Band.find(query)
            .populate({
                path: 'mandatoryPositions.filledBy',
                select: 'firstName lastName _id' // Only return relevant fields
            })
            .populate({
                path: 'members',
                select: 'firstName lastName _id' // Populate members as well
            });

        return NextResponse.json({ success: true, bands });
    } catch (error: any) {
        console.error('Error fetching bands:', error);
        return NextResponse.json(
            { success: false, error: error.message || 'Failed to retrieve bands' },
            { status: 500 }
        );
    }
}
