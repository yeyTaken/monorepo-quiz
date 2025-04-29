import { NextResponse } from 'next/server';
import { submitPlayer } from '../../../lib/store';

export async function POST(req: Request) {
  const { id } = await req.json();
  if (!id) return NextResponse.json({ error: 'quizId required' }, { status: 400 });

  const player = submitPlayer(id);
  if (!player) return NextResponse.json({ error: 'Invalid quizId' }, { status: 404 });

  return NextResponse.json({ name: player.name, score: player.score });
}