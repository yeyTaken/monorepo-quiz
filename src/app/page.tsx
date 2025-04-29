"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Input } from "@heroui/react";

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

  return (
    <div>
      <div>
        <h1>Quiz Trigonométrico</h1>
        <input
          type="text"
          placeholder="Seu nome"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        
        <Button onClick={startQuiz} color="primary" variant="ghost">
        Iniciar Quiz
        </Button>
      </div>
    </div>
  );
}
