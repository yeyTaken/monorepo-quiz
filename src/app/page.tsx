"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const [name, setName] = useState('');
  const router = useRouter();

  const startQuiz = async () => {
    if (!name.trim()) return alert('Digite seu nome');
    localStorage.setItem('playerName', name.trim());

    const res = await fetch('/api/start', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: name.trim() }),
    });
    const data = await res.json();
    localStorage.setItem('quizId', data.id);
    localStorage.setItem('questions', JSON.stringify(data.perguntas));
    router.push('/quiz');
  };

  return (
    <div className="flex flex-col items-center mt-20">
      <h1 className="text-3xl font-bold mb-6">Quiz de Funções Trigonométricas</h1>
      <input
        className="border p-2 mb-4 w-64 rounded"
        placeholder="Digite seu nome"
        value={name}
        onChange={e => setName(e.target.value)}
      />
      <button
        onClick={startQuiz}
        className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
      >
        Iniciar Quiz
      </button>
    </div>
  );
}