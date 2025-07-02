const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

const register = async (req, res) => {
  const { username, password } = req.body;

  const existing = await User.findOne({ username });
  if (existing) return res.status(400).json({ message: "User already exists" });

  const hashed = await bcrypt.hash(password, 10);
  const user = new User({ username, password: hashed });
  await user.save();

  const token = generateToken(user._id);
  res.json({ token, user: { username: user.username, coins: user.coins } });
};

const login = async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username });
  if (!user) return res.status(400).json({ message: "User not found" });

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(400).json({ message: "Invalid password" });

  const token = generateToken(user._id);
  res.json({ token, user: { username: user.username, coins: user.coins } });
};

module.exports = { register, login };
