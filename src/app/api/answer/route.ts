import { NextResponse } from 'next/server';
import { updateScore } from '../../../lib/store';

export async function POST(req: Request) {
  const { id, correct } = await req.json();
  if (!id) return NextResponse.json({ error: 'quizId required' }, { status: 400 });
  if (correct) updateScore(id);
  return NextResponse.json({ ok: true });
}