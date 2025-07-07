import { v4 as uuidv4 } from 'uuid';

type Player = {
  id: string;
  name: string;
  score: number;
  startTime: number;
  endTime?: number;
  finished: boolean;
};

const players = new Map<string, Player>();
const tops: Player[] = [];

export function createPlayer(name: string) {
  const id = uuidv4();
  players.set(id, { id, name, score: 0, startTime: Date.now(), finished: false });
  return id;
}

export function updateScore(id: string) {
  const p = players.get(id);
  if (p && !p.finished) p.score++;
}

export function submitPlayer(id: string) {
  const p = players.get(id);
  if (!p || p.finished) return null;
  p.finished = true;
  p.endTime = Date.now();
  tops.push(p);
  tops.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return (a.endTime! - a.startTime) - (b.endTime! - a.startTime);
  });
  return p;
}

export function getTops() {
  return tops.slice(0, 10);
}
