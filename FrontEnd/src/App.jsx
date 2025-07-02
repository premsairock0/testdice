import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Register from "./auth/Register";
import Login from "./auth/Login";
import DiceGame from "./pages/DiceGame";
import Navbar from "./components/Navbar";
import BalanceSlider from "./components/BalanceSlider";
import History from "./pages/History";





export default function App() {
  return (
    <Router>
      <Navbar />
      <BalanceSlider/>
      <Routes>
        <Route path="/" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/game" element={<DiceGame />} />
        <Route path="/history" element={<History />} />
      </Routes>
    </Router>
  );
}
