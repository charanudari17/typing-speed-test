import { useState, useEffect } from "react";

// ------------ Function to determine backend domain dynamically ------------
// You don't need to understand this function, it's just a helper function to get the backend domain

// ---------------------------------------------------------------------------

function App() {
  const [input, setInput] = useState("");
  const [startTime, setStartTime] = useState(null);
  const [result, setResult] = useState("");
  const [name, setName] = useState("");
  const [leaderboard, setLeaderboard] = useState([]);
  const [isStarted, setIsStarted] = useState(false);

  const sampleText = "The quick brown fox jumps over the lazy dog";

  // Get dynamic backend domain
  // const backendDomain = getBackendDomain();
  const backendDomain = "https://render.com/docs/web-services#port-binding"; // Replace with your backend domain
  

  // Function to fetch leaderboard from backend
  const fetchLeaderboard = async () => {
    const res = await fetch(`${backendDomain}/leaderboard`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    const data = await res.json();
    setLeaderboard(data.leaderboard || data);
  };

  // Function to save score to backend
  const saveScore = async (name, wpm) => {
    await fetch(`${backendDomain}/score`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, wpm }),
    });
  };

  const handleInput = async (e) => {
    const value = e.target.value;
    setInput(value);

    if (!startTime) setStartTime(new Date());

    if (value.trim() === sampleText.trim()) {
      const endTime = new Date();
      const timeTaken = (endTime - startTime) / 1000 / 60;
      const words = sampleText.split(" ").length;
      const wpm = Math.round(words / timeTaken);

      let correctChars = 0;
      for (let i = 0; i < value.length; i++) {
        if (value[i] === sampleText[i]) correctChars++;
      }
      const accuracy = Math.round((correctChars / sampleText.length) * 100);

      setResult(`🎉 ${name}, you typed at ${wpm} WPM with ${accuracy}% accuracy!`);

      // Save score to backend
      await saveScore(name, wpm);

      // Refresh leaderboard
      fetchLeaderboard();
      
      setIsStarted(false); // stop after completion
    }
  };

  // Start button handler
  const handleStart = () => {
    setInput("");
    setResult("");
    setStartTime(null);
    setIsStarted(true);
  };

  // Fetch leaderboard on component mount
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
        style={{
          padding: "10px 20px",
          fontSize: "16px",
          marginBottom: "15px",
          cursor: "pointer",
        }}

        // require name before starting
        disabled={!name} 
      >
      Start Test
      </button>
      
      <br />

      <input
        type="text"
        value={input}
        onChange={handleInput}
        style={{ width: "80%", padding: "10px", fontSize: "16px" }}
        placeholder="Start typing here..."
        disabled={!isStarted}
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

