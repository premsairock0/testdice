import { useEffect, useState } from "react";
import API from "../api/axios";

export default function BalanceSlider() {
  const [balance, setBalance] = useState(0);

  const fetchBalance = async () => {
    try {
      const res = await API.get("/dice/balance");
      setBalance(res.data.coins);
    } catch (err) {
      console.error("Failed to fetch balance", err);
    }
  };

  useEffect(() => {
    fetchBalance();

    // Optional: auto-refresh every 10 seconds
    const interval = setInterval(fetchBalance, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{
      position: "fixed", top: 0, right: 0,
      background: "#1d1d1d", color: "#fff",
      padding: "10px 20px", zIndex: 1000,
      borderBottomLeftRadius: "10px"
    }}>
      💰 Coins: {balance}
    </div>
  );
}
