const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const { rollDice } = require("../controllers/diceController");
const User = require("../models/User");


router.get("/balance", auth, async (req, res) => {
  const user = await User.findById(req.user.id);
  res.json({ coins: user.coins });
});

router.get("/history", auth, async (req, res) => {
  const history = await DiceGame.find({ userId: req.user.id }).sort({ playedAt: -1 });
  res.json(history);
});

router.post("/play", auth, rollDice);

module.exports = router;
