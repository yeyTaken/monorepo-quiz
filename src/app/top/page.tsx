"use client";

import { useEffect, useState } from 'react';

type Player = { id: string; name: string; score: number; time: string };

export default function TopPage() {
  const [tops, setTops] = useState<Player[]>([]);

  useEffect(() => {
    fetch('/api/top')
      .then(res => res.json())
      .then(setTops);
  }, []);

  if (!tops.length) {
    return <div className="p-4 text-center">Ainda não há resultados.</div>;
  }

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-6">🏆 Ranking</h1>
      <ol className="list-decimal list-inside space-y-3">
        {tops.map((p, i) => (
          <li key={p.id} className="border p-3 rounded">
            <strong>{i + 1}º</strong> – {p.name} | {p.score}/10 | {p.time}
          </li>
        ))}
      </ol>
    </div>
  );
}