import { NextResponse } from 'next/server';
import { getTops } from '../../../lib/store';

export async function GET() {
  const data = getTops().map(p => ({
    id: p.id,
    name: p.name,
    score: p.score,
    time: ((p.endTime! - p.startTime) / 1000).toFixed(2) + 's',
  }));
  return NextResponse.json(data);
}