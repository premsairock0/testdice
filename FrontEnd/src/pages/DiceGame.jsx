import { useState, useRef, useEffect } from "react";
import API from "../api/axios";

export default function DiceGame() {
  const [bet, setBet] = useState(10);
  const [target, setTarget] = useState(49);
  const [over, setOver] = useState(false);
  const [result, setResult] = useState(null);
  const [rounds, setRounds] = useState(1);
  const [rolling, setRolling] = useState(false);
  const [paused, setPaused] = useState(false);
  const [stopAt, setStopAt] = useState(null);
  const stopAutoplay = useRef(false);

  // 🎵 Load win sound
  const winSound = useRef(new Audio("/sounds/win.mp3"));

  const playDice = async () => {
    try {
      const res = await API.post("/dice/play", { bet, target, over });
      setResult(res.data);

      // 🎵 Play win sound
      if (res.data?.win) {
        winSound.current.currentTime = 0;
        winSound.current.play().catch((e) => console.warn("Sound play error:", e));
      }

      return res.data;
    } catch (err) {
      alert(err.response?.data?.message || "Something went wrong");
    }
  };

  const autoplay = async () => {
    setRolling(true);
    stopAutoplay.current = false;

    for (let i = 0; i < rounds; i++) {
      if (stopAutoplay.current) break;
      while (paused) await new Promise((r) => setTimeout(r, 300));

      const res = await playDice();
      if (!res) break;

      if (stopAt && res.balance >= stopAt) {
        alert(`🎯 Reached target of ${stopAt} coins. Stopping autoplay.`);
        break;
      }

      if (res.balance < 100) {
        alert(`⚠️ Balance dropped below 100 coins. Autoplay stopped.`);
        break;
      }

      await new Promise((r) => setTimeout(r, 800));
    }

    setRolling(false);
  };

  const rolledPosition = () => {
    if (!result?.rolled) return "0%";
    const pct = (result.rolled / 100) * 100;
    return `calc(${pct}% - 10px)`;
  };

  return (
    <div style={{
      backgroundColor: "#0f0f0f",
      minHeight: "100vh",
      padding: "30px",
      color: "#ffffff",
      fontFamily: "sans-serif",
    }}>
      <div style={{
        maxWidth: "500px",
        margin: "auto",
        backgroundColor: "#1e1e1e",
        borderRadius: "12px",
        padding: "25px",
        boxShadow: "0 0 10px rgba(0, 224, 255, 0.2)"
      }}>
        <h2 style={{ textAlign: "center", color: "#00e0ff" }}>🎲 Dice Game</h2>

        {/* Bet Input + 2x */}
        <div style={{ marginBottom: "15px", display: "flex", gap: "10px" }}>
          <div style={{ flex: 1 }}>
            <label>💸 Bet:</label>
            <input
              type="number"
              value={bet}
              min={1}
              onChange={(e) => setBet(+e.target.value)}
              style={inputStyle()}
            />
          </div>
          <button onClick={() => setBet(bet * 2)} style={buttonStyle("#ffcc00")}>
            2x
          </button>
        </div>

        {/* Rounds Input */}
        <div style={{ marginBottom: "15px" }}>
          <label>🔁 Auto Play Rounds:</label>
          <input
            type="number"
            value={rounds}
            min={1}
            onChange={(e) => setRounds(+e.target.value)}
            style={inputStyle()}
          />
        </div>

        {/* Stop at Balance */}
        <div style={{ marginBottom: "15px" }}>
          <label>🎯 Stop at Balance:</label>
          <input
            type="number"
            value={stopAt || ""}
            placeholder="e.g. 5000"
            onChange={(e) => setStopAt(e.target.value ? +e.target.value : null)}
            style={inputStyle()}
          />
        </div>

        {/* Target Slider */}
        <div style={{ marginBottom: "30px", position: "relative" }}>
          <label>🎯 Target: {target}</label>
          {result?.rolled && (
            <div
              style={{
                position: "absolute",
                left: rolledPosition(),
                top: "-25px",
                backgroundColor: "#00e0ff",
                color: "#000",
                padding: "2px 6px",
                borderRadius: "6px",
                fontSize: "12px",
                transform: "translateX(-50%)",
              }}
            >
              {result.rolled}
            </div>
          )}
          <input
            type="range"
            min={2}
            max={99}
            step={1}
            value={target}
            list="tickmarks"
            onChange={(e) => setTarget(+e.target.value)}
            style={{
              width: "100%",
              marginTop: "10px",
              accentColor: "#00e0ff",
            }}
          />
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: "12px",
            color: "#aaa",
            marginTop: "5px"
          }}>
            <span>2</span><span>20</span><span>40</span><span>60</span><span>80</span><span>99</span>
          </div>
        </div>

        {/* Over/Under */}
        <div style={{ marginBottom: "20px", color: "#ccc" }}>
          <label>
            <input type="radio" checked={!over} onChange={() => setOver(false)} /> Under
          </label>
          <label style={{ marginLeft: "20px" }}>
            <input type="radio" checked={over} onChange={() => setOver(true)} /> Over
          </label>
        </div>

        {/* Buttons */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
          <button
            onClick={playDice}
            disabled={rolling}
            style={buttonStyle("#00e0ff")}
          >
            Roll 🎲
          </button>
          <button
            onClick={autoplay}
            disabled={rolling}
            style={buttonStyle("#00ff88")}
          >
            Auto Play 🔁
          </button>
          <button
            onClick={() => setPaused(!paused)}
            disabled={!rolling}
            style={buttonStyle("#ffaa00")}
          >
            {paused ? "▶️ Resume" : "⏸️ Pause"}
          </button>
          <button
            onClick={() => {
              stopAutoplay.current = true;
              setPaused(false);
            }}
            disabled={!rolling}
            style={buttonStyle("#ff0044")}
          >
            ⛔ Stop
          </button>
        </div>

        {/* Results */}
        {result && (
          <div style={{ marginTop: "20px", fontSize: "16px", textAlign: "center" }}>
            <p>{result.win ? "🎉 You Win!" : "❌ You Lose"}</p>
            <p>💰 Balance: <span style={{ color: "#00e0ff" }}>{result.balance}</span> coins</p>
          </div>
        )}
      </div>
    </div>
  );
}

// Styles
const inputStyle = () => ({
  width: "100%",
  padding: "10px",
  marginTop: "5px",
  backgroundColor: "#2a2a2a",
  border: "1px solid #444",
  color: "white",
  borderRadius: "6px",
  fontSize: "14px",
});

const buttonStyle = (color) => ({
  flex: 1,
  padding: "10px",
  fontSize: "14px",
  backgroundColor: color,
  color: "#000",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
  minWidth: "100px",
  boxShadow: `0 0 8px ${color}`,
  fontWeight: "bold"
});
