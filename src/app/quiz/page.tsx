"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

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
  const [correctAnswers, setCorrectAnswers] = useState<number[]>(() => {
    const saved = localStorage.getItem("correctAnswers");
    return saved ? JSON.parse(saved) : [];
  });
  const score = correctAnswers.length;
  const [showFeedback, setShowFeedback] = useState(false);
  const [finished, setFinished] = useState(false);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [endTime, setEndTime] = useState<Date | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("questions");
    const name = localStorage.getItem("playerName");
    if (!stored || !name) return router.push("/");
    setQuestions(JSON.parse(stored));
    setStartTime(new Date());
  }, [router]);

  useEffect(() => {
    localStorage.setItem("correctAnswers", JSON.stringify(correctAnswers));
    localStorage.setItem("score", String(score));
  }, [correctAnswers, score]);

  if (questions.length === 0)
    return (
      <div>
        <p>Carregando...</p>
      </div>
    );

  const q = questions[current];

  const handleSelect = (key: string) => {
    if (selected) return;
    setSelected(key);
    const isCorrect = key === q.resposta_correta;
    if (isCorrect && !correctAnswers.includes(current))
      setCorrectAnswers((prev) => [...prev, current]);
    setShowFeedback(true);
    if (current === questions.length - 1) {
      setEndTime(new Date());
      setFinished(true);
    }
  };

  const handleNext = () => {
    setSelected(null);
    setShowFeedback(false);
    setCurrent((prev) => prev + 1);
  };

  const calculateTime = () => {
    if (!startTime || !endTime) return "0.00s";
    return ((endTime.getTime() - startTime.getTime()) / 1000).toFixed(2) + "s";
  };

  if (finished) {
    const playerName = localStorage.getItem("playerName");
    return (
      <div>
        <div>
          <h1>
            🎉 Parabéns, {playerName}!
          </h1>
          <p>
            Acertos: <span>{score}</span> /{" "}
            {questions.length}
          </p>
          <p>
            Tempo: <span>{calculateTime()}</span>
          </p>
          <button
            onClick={() => {
              localStorage.clear();
              router.push("/");
            }}
          >
            Jogar Novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div>
        <div>
          <span>
            Pergunta {current + 1}/{questions.length}
          </span>
          <span>Score: {score}</span>
        </div>
        <div>
          <h2>
            {q.pergunta}
          </h2>
          <ul>
            {Object.entries(q.opcoes).map(([key, text]) => {
              const isChecked = selected === key;
              const isCorrect = key === q.resposta_correta;
              return (
                <li key={key}>
                  <label>
                    <input
                      type="radio"
                      name={`question-${current}`}
                      checked={isChecked}
                      disabled={!!selected}
                      onChange={() => handleSelect(key)}
                    />
                    <span>{key})</span>
                    <span>{text}</span>
                  </label>
                </li>
              );
            })}
          </ul>
          {showFeedback && (
            <div>
              {selected === q.resposta_correta ? (
                <p>
                  ✅ Você acertou!
                </p>
              ) : (
                <>
                  <p>
                    ❌ Você errou!
                  </p>
                  <p>
                    Resposta correta:{" "}
                    <strong>
                      {q.resposta_correta}) {q.opcoes[q.resposta_correta]}
                    </strong>
                  </p>
                </>
              )}
              {current < questions.length - 1 && (
                <button
                  onClick={handleNext}
                >
                  Próxima
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
