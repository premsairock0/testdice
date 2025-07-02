import { useState } from "react";
import API from "../api/axios";

export default function DiceGame() {
  const [bet, setBet] = useState(10);
  const [target, setTarget] = useState(49.5);
  const [over, setOver] = useState(false);
  const [result, setResult] = useState(null);

  const playDice = async () => {
    try {
      const res = await API.post("/dice/play", { bet, target, over });
      setResult(res.data);
    } catch (err) {
      alert(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div>
      <h2>Dice Game</h2>
      <input
        type="number"
        placeholder="Bet"
        value={bet}
        onChange={(e) => setBet(+e.target.value)}
      />
      <input
        type="number"
        placeholder="Target (1-99)"
        value={target}
        onChange={(e) => setTarget(+e.target.value)}
      />
      <div>
        <label>
          <input type="radio" checked={!over} onChange={() => setOver(false)} />
          Under
        </label>
        <label>
          <input type="radio" checked={over} onChange={() => setOver(true)} />
          Over
        </label>
      </div>
      <button onClick={playDice}>Roll</button>

      {result && (
        <div>
          <p>Rolled: {result.rolled}</p>
          <p>{result.win ? "🎉 You Win!" : "❌ You Lose"}</p>
          <p>Balance: {result.balance} coins</p>
        </div>
      )}
    </div>
  );
}
