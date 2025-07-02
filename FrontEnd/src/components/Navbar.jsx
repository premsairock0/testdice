import { logout } from "../utils/auth";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav style={{ display: "flex", justifyContent: "space-between", padding: "1rem" }}>
      <h3>🎲 Dice Game</h3>
      <button onClick={handleLogout}>Logout</button>
    </nav>
  );
}
