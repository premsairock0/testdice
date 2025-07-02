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

    const rolled = Math.floor(Math.random() * 100) + 1;
    const win = over ? rolled > target : rolled < target;

    const payout = win ? bet * 2 : 0;
    const updatedCoins = user.coins - bet + payout;

    // ✅ Update user coins
    user.coins = updatedCoins;
    await user.save();

    // ✅ Save game history
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
