import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Problem } from "../../../types";

export default function ProblemSet() {
  const router = useRouter();
  const { language, name } = router.query;

  const [problems, setProblems] = useState<Problem[]>([]);
  const [currentProblem, setCurrentProblem] = useState<number>(0);
  const [timer, setTimer] = useState<number>(300); // 5 minutes
  const [isPaused, setIsPaused] = useState<boolean>(true);
  const [autoPlay, setAutoPlay] = useState<boolean>(false);

  useEffect(() => {
    if (language && name) {
      fetch(`http://localhost:8000/problems/${language}/${name}`)
        .then((res) => res.json())
        .then((data: Problem[]) => setProblems(data));
    }
  }, [language, name]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (!isPaused && timer > 0) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    } else if (timer === 0) {
      new Audio("/beep.mp3").play();
      setCurrentProblem((prevProblem) => prevProblem + 1);
      setTimer(300);
    }
    return () => clearInterval(interval);
  }, [isPaused, timer]);

  const toggleTimer = () => setIsPaused(!isPaused);

  const playAudio = () => {
    if (autoPlay && language && name) {
      new Audio(
        `/problems/${language}/${name}/problem-${currentProblem + 1}.mp3`
      ).play();
    }
  };

  if (!problems.length) return <div>Loading...</div>;

  return (
    <div>
      <h1>{name}</h1>
      <div>
        <label>
          <input
            type="checkbox"
            checked={autoPlay}
            onChange={() => setAutoPlay(!autoPlay)}
          />
          자동 재생
        </label>
      </div>
      <div>
        Timer: {Math.floor(timer / 60)}:{timer % 60 < 10 ? "0" : ""}
        {timer % 60}
        <button onClick={toggleTimer}>{isPaused ? "Start" : "Pause"}</button>
      </div>
      <div>
        <h2>Problem {currentProblem + 1}</h2>
        <p>{problems[currentProblem].question}</p>
        <button onClick={playAudio}>Play Audio</button>
      </div>
    </div>
  );
}
