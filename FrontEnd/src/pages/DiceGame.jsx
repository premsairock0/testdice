import { useState, useRef } from "react";
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

  const playDice = async () => {
    try {
      const res = await API.post("/dice/play", { bet, target, over });
      setResult(res.data);
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

      while (paused) {
        await new Promise((r) => setTimeout(r, 300));
      }

      const res = await playDice();
      if (!res) break;

      if (stopAt && res.balance >= stopAt) {
        alert(`🎯 Target balance of ${stopAt} reached. Autoplay stopped.`);
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
    <div style={{ maxWidth: "500px", margin: "auto", padding: "20px" }}>
      <h2>🎲 Dice Game</h2>

      {/* Bet Input + 2x */}
      <div style={{ marginBottom: "15px", display: "flex", alignItems: "center", gap: "10px" }}>
        <div style={{ flex: 1 }}>
          <label style={{ fontWeight: "bold" }}>Bet Amount:</label>
          <input
            type="number"
            value={bet}
            min={1}
            onChange={(e) => setBet(+e.target.value)}
            style={{ width: "100%", padding: "8px", fontSize: "16px", marginTop: "5px" }}
          />
        </div>
        <button
          onClick={() => setBet(bet * 2)}
          style={{
            marginTop: "24px",
            padding: "10px",
            background: "#ffc107",
            color: "#000",
            borderRadius: "6px",
            border: "none",
            cursor: "pointer"
          }}
        >
          2x
        </button>
      </div>

      {/* Rounds Input */}
      <div style={{ marginBottom: "15px" }}>
        <label style={{ fontWeight: "bold" }}>Rounds (Auto Play):</label>
        <input
          type="number"
          value={rounds}
          min={1}
          onChange={(e) => setRounds(+e.target.value)}
          style={{ width: "100%", padding: "8px", fontSize: "16px", marginTop: "5px" }}
        />
      </div>

      {/* Stop at Balance Input */}
      <div style={{ marginBottom: "15px" }}>
        <label style={{ fontWeight: "bold" }}>Stop at Balance (Optional):</label>
        <input
          type="number"
          value={stopAt || ""}
          placeholder="e.g. 5000"
          onChange={(e) => setStopAt(e.target.value ? +e.target.value : null)}
          style={{ width: "100%", padding: "8px", fontSize: "16px", marginTop: "5px" }}
        />
      </div>

      {/* Target Slider */}
      <div style={{ marginBottom: "30px", position: "relative" }}>
        <label style={{ fontWeight: "bold", fontSize: "18px" }}>
          🎯 Target: {target}
        </label>
        {result?.rolled && (
          <div
            style={{
              position: "absolute",
              left: rolledPosition(),
              top: "-20px",
              backgroundColor: "#007bff",
              color: "white",
              padding: "3px 6px",
              borderRadius: "4px",
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
            height: "30px",
            appearance: "none",
            background: "#ddd",
            borderRadius: "10px",
            outline: "none",
            marginTop: "10px"
          }}
        />
        <datalist id="tickmarks">
          <option value="20" label="20" />
          <option value="40" label="40" />
          <option value="60" label="60" />
          <option value="80" label="80" />
          <option value="99" label="99" />
        </datalist>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", marginTop: "5px" }}>
          <span>2</span><span>20</span><span>40</span><span>60</span><span>80</span><span>99</span>
        </div>
      </div>

      {/* Over/Under Selection */}
      <div style={{ marginBottom: "20px" }}>
        <label>
          <input type="radio" checked={!over} onChange={() => setOver(false)} /> Under
        </label>
        <label style={{ marginLeft: "20px" }}>
          <input type="radio" checked={over} onChange={() => setOver(true)} /> Over
        </label>
      </div>

      {/* Action Buttons */}
      <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginBottom: "20px" }}>
        <button
          onClick={playDice}
          disabled={rolling}
          style={buttonStyle("#007bff")}
        >
          Roll 🎲
        </button>
        <button
          onClick={autoplay}
          disabled={rolling}
          style={buttonStyle("#28a745")}
        >
          Auto Play 🔁
        </button>
        <button
          onClick={() => setPaused(!paused)}
          disabled={!rolling}
          style={buttonStyle("#17a2b8")}
        >
          {paused ? "Resume ▶️" : "Pause ⏸️"}
        </button>
        <button
          onClick={() => {
            stopAutoplay.current = true;
            setPaused(false);
          }}
          disabled={!rolling}
          style={buttonStyle("#dc3545")}
        >
          Stop ⛔
        </button>
      </div>

      {/* Result Display */}
      {result && (
        <div style={{ marginTop: "20px", fontSize: "16px" }}>
          <p>{result.win ? "🎉 You Win!" : "❌ You Lose"}</p>
          <p>💰 Balance: {result.balance} coins</p>
        </div>
      )}
    </div>
  );
}

function buttonStyle(color) {
  return {
    flex: 1,
    padding: "10px",
    fontSize: "14px",
    backgroundColor: color,
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    minWidth: "100px"
  };
}
