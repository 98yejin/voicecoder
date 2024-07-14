import { useState, useEffect } from "react";
import Link from "next/link";
import { ProblemSet } from "../types";

export default function Home() {
  const [language, setLanguage] = useState<string>("ko");
  const [problemSets, setProblemSets] = useState<ProblemSet[]>([]);

  useEffect(() => {
    fetch(`http://localhost:8000/problems/${language}`)
      .then((res) => res.json())
      .then((data: ProblemSet[]) => setProblemSets(data));
  }, [language]);

  return (
    <div>
      <h1>VoiceCoder</h1>
      <select onChange={(e) => setLanguage(e.target.value)}>
        <option value="ko">한국어</option>
        <option value="en">English</option>
      </select>
      <h2>문제 세트</h2>
      <ul>
        {problemSets.map((set, index) => (
          <li key={index}>
            <Link href={`/problem-set/${language}/${set.name}`}>
              {set.name} - {set.type}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
