import { useEffect, useState } from "react";
import API from "../api/axios";

export default function History() {
  const [games, setGames] = useState([]);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await API.get("/dice/history");
        setGames(res.data);
      } catch (err) {
        console.error("History fetch failed", err);
      }
    };
    fetchHistory();
  }, []);

  return (
    <div>
      <h2>Last 10 Dice Games</h2>
      <table border="1">
        <thead>
          <tr>
            <th>Bet</th>
            <th>Target</th>
            <th>Over</th>
            <th>Rolled</th>
            <th>Win</th>
            <th>Payout</th>
            <th>Time</th>
          </tr>
        </thead>
        <tbody>
          {games.map((game, i) => (
            <tr key={i}>
              <td>{game.bet}</td>
              <td>{game.target}</td>
              <td>{game.over ? "Over" : "Under"}</td>
              <td>{game.rolled}</td>
              <td>{game.win ? "✅" : "❌"}</td>
              <td>{game.payout}</td>
              <td>{new Date(game.playedAt).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
