const User = require("../models/User");
const DiceGame = require("../models/Dicegame");

const rollDice = async (req, res) => {
  try {
    const { bet, target, over } = req.body;

    if (!bet || !target) {
      return res.status(400).json({ message: "Bet and target required" });
    }

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.coins < bet) {
      return res.status(400).json({ message: "Insufficient balance" });
    }

    // 🎲 Roll between 0.00 and 100.00
    const rolled = parseFloat((Math.random() * 100).toFixed(2));

    // 🎯 Decide if user wins
    const win = over ? rolled > target : rolled < target;

    // 💰 Calculate payout ratio like Stake
    let payout = 0;
    if (win) {
      payout = over
        ? parseFloat((bet * (100 / (100 - target))).toFixed(2))
        : parseFloat((bet * (100 / target)).toFixed(2));
    }

    // 🪙 Update coins
    user.coins = user.coins - bet + payout;
    await user.save();

    // 📦 Save game history
    const game = new DiceGame({
      userId: req.user.id,
      bet,
      target,
      over,
      rolled,
      win,
      payout,
      playedAt: new Date(),
    });

    await game.save();

    // ✅ Send response
    res.json({
      rolled,
      win,
      payout,
      balance: user.coins,
    });
  } catch (err) {
    console.error("Dice Roll Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { rollDice };
