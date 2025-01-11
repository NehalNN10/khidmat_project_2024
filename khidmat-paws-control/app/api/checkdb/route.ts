import { dbConnect } from '@/app/lib/db';
import { NextResponse } from 'next/server';

export async function GET()
{
    const con = dbConnect();
    return new NextResponse('Connected to MongoDB');
}