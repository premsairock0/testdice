const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const { rollDice } = require("../controllers/diceController");
const User = require("../models/User");
const DiceGame = require("../models/Dicegame");

router.get("/balance", auth, async (req, res) => {
  const user = await User.findById(req.user.id);
  res.json({ coins: user.coins });
});

router.post("/play", auth, rollDice);

// ✅ Last 10 dice game results
router.get("/history", auth, async (req, res) => {
  const history = await DiceGame.find({ userId: req.user.id })
    .sort({ playedAt: -1 })
    .limit(10);
  res.json(history);
});

module.exports = router;
