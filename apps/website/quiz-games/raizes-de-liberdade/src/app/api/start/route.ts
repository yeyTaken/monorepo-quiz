import { NextResponse } from 'next/server';
import jsonData from '../../../issues/index.json';
import { createPlayer } from '../../../lib/store';

export async function POST(req: Request) {
  const { name } = await req.json();
  if (!name) return NextResponse.json({ error: 'Name required' }, { status: 400 });

  const id = createPlayer(name.trim());
  const perguntas = [...jsonData.perguntas]
    .sort(() => Math.random() - 0.5)
    .slice(0, 5);

  return NextResponse.json({ id, perguntas });
}
