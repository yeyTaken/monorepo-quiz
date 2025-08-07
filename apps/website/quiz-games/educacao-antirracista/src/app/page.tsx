"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import "../../public/page.css";

export default function Home() {
  const [name, setName] = useState("");
  const router = useRouter();

  const startQuiz = async () => {
    if (!name.trim()) return alert("Digite seu nome");

    const res = await fetch("/api/start", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: name.trim() }),
    });

    const data = await res.json();
    localStorage.setItem("playerName", name.trim());
    localStorage.setItem("quizId", data.id);
    localStorage.setItem("questions", JSON.stringify(data.perguntas));

    router.push("/quiz");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === "Enter") {
      startQuiz();
    }
  };

  return (
    <div className="home-container">
      <div className="home-card">
        <h1>Educação Antirracista</h1>
        <p className="home-description">
          Compreendendo o Papel da Escola na Luta contra o Racismo Estrutural.
        </p>
        <input
          className="home-input"
          type="text"
          placeholder="Seu nome"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button className="home-button" onClick={startQuiz}>
          Iniciar Quiz
        </button>
      </div>
    </div>
  );
}
