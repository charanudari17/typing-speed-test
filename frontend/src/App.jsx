import { useState, useEffect } from "react";

function App() {
  const [input, setInput] = useState("");
  const [startTime, setStartTime] = useState(null);
  const [result, setResult] = useState("");
  const [name, setName] = useState("");
  const [leaderboard, setLeaderboard] = useState([]);
  const [isStarted, setIsStarted] = useState(false);

  const sampleText = "The quick brown fox jumps over the lazy dog";

  // Backend URL
  const backendDomain = import.meta.env.VITE_BACKEND_URL;

  // Fetch leaderboard
  const fetchLeaderboard = async () => {
    try {
      console.log("Backend:", backendDomain);

      const res = await fetch(`${backendDomain}/leaderboard`);

      const data = await res.json();

      console.log("Leaderboard:", data);

      setLeaderboard(data.leaderboard || []);
    } catch (err) {
      console.error("Leaderboard Error:", err);
    }
  };

  // Save score
  const saveScore = async (name, wpm) => {
    try {
      await fetch(`${backendDomain}/score`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, wpm }),
      });
    } catch (err) {
      console.error("Save Error:", err);
    }
  };

  const handleInput = async (e) => {
    const value = e.target.value;
    setInput(value);

    if (!startTime) {
      setStartTime(new Date());
    }

    if (value.trim() === sampleText.trim()) {
      const endTime = new Date();

      const timeTaken = (endTime - startTime) / 1000 / 60;

      const words = sampleText.split(" ").length;

      const wpm = Math.round(words / timeTaken);

      let correctChars = 0;

      for (let i = 0; i < value.length; i++) {
        if (value[i] === sampleText[i]) {
          correctChars++;
        }
      }

      const accuracy = Math.round(
        (correctChars / sampleText.length) * 100
      );

      setResult(
        `🎉 ${name}, you typed at ${wpm} WPM with ${accuracy}% accuracy!`
      );

      await saveScore(name, wpm);

      await fetchLeaderboard();

      setIsStarted(false);
    }
  };

  const handleStart = () => {
    setInput("");
    setResult("");
    setStartTime(null);
    setIsStarted(true);
  };

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  return (
    <div style={{ textAlign: "center", marginTop: "30px" }}>
      <h1>Typing Speed Test</h1>

      <p>{sampleText}</p>

      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Enter your name"
        style={{
          width: "80%",
          padding: "10px",
          fontSize: "16px",
          marginBottom: "10px",
        }}
      />

      <br />

      <button
        onClick={handleStart}
        disabled={!name}
        style={{
          padding: "10px 20px",
          fontSize: "16px",
          marginBottom: "15px",
          cursor: "pointer",
        }}
      >
        Start Test
      </button>

      <br />

      <input
        type="text"
        value={input}
        onChange={handleInput}
        disabled={!isStarted}
        placeholder="Start typing here..."
        style={{
          width: "80%",
          padding: "10px",
          fontSize: "16px",
        }}
      />

      <p>{result}</p>

      <h2>🏆 Leaderboard</h2>

      <ul>
        {leaderboard.map((score, index) => (
          <li key={index}>
            {score.name}: {score.wpm} WPM
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;