import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import connectMongoDB from '@/app/lib/mongodb';
import User from '@/app/models/user';


export async function POST(request: NextRequest) {
  await connectMongoDB();

  try {
    const body = await request.json();
    // Expected JSON example:
    // {
    //   "firstName": "John",
    //   "lastName": "Doe",
    //   "phoneNumber": "1234567890",
    //   "email": "john@example.com",
    //   "primaryInstrument": "Guitar",
    //   "backupInstrument": "Bass",
    //   "isManager": false,
    //   "password": "securepassword"
    // }

    // (Add input validation and password hashing as needed)
    const user = await User.create(body);
    return NextResponse.json({ success: true, user }, { status: 201 });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json(
      { success: false, error: error.message || 'Registration failed' },
      { status: 500 }
    );
  }
}
