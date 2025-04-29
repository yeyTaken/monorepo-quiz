"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

type Question = {
  id: number;
  pergunta: string;
  opcoes: Record<string, string>;
  resposta_correta: string;
  explicacao: string;
};

export default function QuizPage() {
  const router = useRouter();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);

  useEffect(() => {
    const qs = localStorage.getItem('questions');
    const qid = localStorage.getItem('quizId');
    if (!qs || !qid) {
      router.replace('/');
      return;
    }
    setQuestions(JSON.parse(qs));
  }, [router]);

  if (!questions.length) return <div className="p-4">Carregando...</div>;

  const q = questions[current];

  const handleSelect = async (key: string) => {
    if (selected) return;
    setSelected(key);
    const correct = key === q.resposta_correta;
    await fetch('/api/answer', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: localStorage.getItem('quizId'), correct }),
    });
    setShowExplanation(true);
  };

  const handleNext = async () => {
    if (current === questions.length - 1) {
      await fetch('/api/submit', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: localStorage.getItem('quizId') }),
      });
      router.push('/top');
    } else {
      setCurrent(c => c + 1);
      setSelected(null);
      setShowExplanation(false);
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h2 className="text-xl font-bold mb-4">Pergunta {current + 1} / {questions.length}</h2>
      <p className="mb-6">{q.pergunta}</p>
      <div className="flex flex-col gap-4">
        {Object.entries(q.opcoes).map(([key, val]) => {
          const isCorrect = key === q.resposta_correta;
          const isSelected = key === selected;
          let bgClass = '';
          if (selected) {
            if (isCorrect) bgClass = 'bg-green-200';
            else if (isSelected) bgClass = 'bg-red-200';
            else bgClass = 'opacity-50';
          } else bgClass = 'hover:bg-gray-100';

          return (
            <button
              key={key}
              disabled={!!selected}
              onClick={() => handleSelect(key)}
              className={`border p-3 rounded text-left ${bgClass}`}
            >
              <strong>{key.toUpperCase()})</strong> {val}
            </button>
          );
        })}
      </div>
      {showExplanation && (
        <div className="mt-6">
          <p className="mb-2"><strong>Explicação:</strong> {q.explicacao}</p>
          {selected !== q.resposta_correta && (
            <p className="mb-4 text-blue-600">
              Resposta certa: <strong>{q.resposta_correta.toUpperCase()}) {q.opcoes[q.resposta_correta]}</strong>
            </p>
          )}
          <button
            onClick={handleNext}
            className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700"
          >
            {current + 1 === questions.length ? 'Finalizar Quiz' : 'Próxima'}
          </button>
        </div>
      )}
    </div>
  );
}