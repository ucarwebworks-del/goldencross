import { NextRequest, NextResponse } from 'next/server';
import { getFromRedis, setToRedis } from '@/lib/redis';

// GET - Retrieve data by key
export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const key = searchParams.get('key');

    if (!key) {
        return NextResponse.json({ error: 'Key is required' }, { status: 400 });
    }

    try {
        const data = await getFromRedis(key);
        return NextResponse.json({ data: data || [] });
    } catch (error) {
        console.error('Redis GET error:', error);
        return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
    }
}

// POST - Save data by key
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { key, data } = body;

        if (!key) {
            return NextResponse.json({ error: 'Key is required' }, { status: 400 });
        }

        await setToRedis(key, data);
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Redis POST error:', error);
        return NextResponse.json({ error: 'Failed to save data' }, { status: 500 });
    }
}
