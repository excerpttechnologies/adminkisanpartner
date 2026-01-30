import { NextRequest, NextResponse } from 'next/server';
import Vehicle from '@/app/models/vehicles';
import connectDB from '../../lib/Db';

// GET all vehicles
export async function GET() {
  try {
    await connectDB();
    const vehicles = await Vehicle.find().sort({ createdAt: -1 });
    return NextResponse.json(vehicles);
  } catch (error) {
    console.error('GET Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch vehicles' }, 
      { status: 500 }
    );
  }
}

// POST new vehicle
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();
    
    const vehicle = await Vehicle.create(body);
    return NextResponse.json(vehicle, { status: 201 });
  } catch (error) {
    console.error('POST Error:', error);
    return NextResponse.json(
      { error: 'Failed to create vehicle' }, 
      { status: 500 }
    );
  }
}