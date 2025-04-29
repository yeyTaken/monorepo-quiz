"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import confetti from "canvas-confetti";
import "../../../public/quiz/page.css";

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
  const [current, setCurrent] = useState<number>(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [correctAnswers, setCorrectAnswers] = useState<number[]>(() => {
    const saved = localStorage.getItem("correctAnswers");
    return saved ? (JSON.parse(saved) as number[]) : [];
  });
  const score = correctAnswers.length;
  const [showFeedback, setShowFeedback] = useState<boolean>(false);
  const [finished, setFinished] = useState<boolean>(false);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [endTime, setEndTime] = useState<Date | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("questions");
    const name = localStorage.getItem("playerName");
    if (!stored || !name) {
      router.push("/");
      return;
    }
    setQuestions(JSON.parse(stored) as Question[]);
    setStartTime(new Date());
  }, [router]);

  useEffect(() => {
    localStorage.setItem("correctAnswers", JSON.stringify(correctAnswers));
    localStorage.setItem("score", String(score));
  }, [correctAnswers, score]);

  if (questions.length === 0) {
    return (
      <div className="quiz-container">
        <p>Carregando...</p>
      </div>
    );
  }

  const q = questions[current];

  const fireConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0 }
    });
  };

  const handleSelect = (key: string) => {
    if (selected) return;
    setSelected(key);
    const isCorrect = key === q.resposta_correta;
    if (isCorrect) {
      setCorrectAnswers(prev => [...prev, current]);
      fireConfetti();
    }
    setShowFeedback(true);
  };

  const handleNext = () => {
    setSelected(null);
    setShowFeedback(false);
    setCurrent(prev => prev + 1);
  };

  const handleFinish = () => {
    setEndTime(new Date());
    setFinished(true);
  };

  const calculateTime = (): string => {
    if (!startTime || !endTime) return "0.00s";
    return ((endTime.getTime() - startTime.getTime()) / 1000).toFixed(2) + "s";
  };

  if (finished) {
    const playerName = localStorage.getItem("playerName") ?? "Jogador";
    return (
      <div className="quiz-container quiz-finish">
        <h1>🎉 Parabéns, {playerName}!</h1>
        <p>
          Acertos: <span>{score}</span> / {questions.length}
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
    );
  }

  return (
    <div className="quiz-container">
      <div className="quiz-header">
        <span>
          Pergunta {current + 1}/{questions.length}
        </span>
        <span>Score: {score}</span>
      </div>

      <div className="quiz-question">
        <h2>{q.pergunta}</h2>
      </div>

      <ul className="quiz-options">
        {Object.entries(q.opcoes).map(([key, text]) => {
          const isSelected = selected === key;
          const isCorrect = key === q.resposta_correta;
          const optionClass = selected
            ? isCorrect
              ? "option-correct"
              : isSelected
              ? "option-incorrect"
              : ""
            : "";
          return (
            <li key={key}>
              <label className={optionClass}>
                <input
                  type="radio"
                  name={`question-${current}`}
                  checked={isSelected}
                  disabled={!!selected}
                  onChange={() => handleSelect(key)}
                />
                <span className="option-key">{key})</span>
                <span className="option-text">{text}</span>
              </label>
            </li>
          );
        })}
      </ul>

      {showFeedback && (
        <div className="feedback-container">
          <p className="feedback-explain">
            <strong>Explicação:</strong> {q.explicacao}
          </p>

          {current < questions.length - 1 ? (
            <button onClick={handleNext}>Próxima</button>
          ) : (
            <button onClick={handleFinish}>Finalizar</button>
          )}
        </div>
      )}
    </div>
  );
}
