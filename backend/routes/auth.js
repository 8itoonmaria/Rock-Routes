const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

/* =====================================================
   POST /register
   Creates a new user account
   ===================================================== */
router.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;

    // 1. check if user already exists
    const existingUser = await User.findOne({ username });
    if (existingUser)
      // if username already exists, send error response
      return res.status(400).json({ message: "User already exists" });

    // 2. hash the password before storing it in the database
    // 10 = salt rounds (level of encryption work)
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3. save the user
    const newUser = new User({
      username: username,
      password: hashedPassword,
    });

    // save the new user to MongoDB
    await newUser.save();

    // send success response
    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    // if something goes wrong, send server error
    res.status(500).json({ error: err.message });
  }
});

/* =====================================================
   POST /login
   Authenticates a user and returns a JWT token
   ===================================================== */

router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    // 1. find the user in the database
    const user = await User.findOne({ username });
    // if user does not exist, send error response
    if (!user) return res.status(400).json({ message: "User not found" });

    // 2. compare the entered password with the hashed password in the database
    const isMatch = await bcrypt.compare(password, user.password);

    // if passwords don't match send error response
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    // 3. generate JWT  ("wristband")
    const token = jwt.sign(
      {
        // payload (data stored in the token)
        id: user._id, // user's database ID
        username: user.username,
      },

      // secret key used to sign the token
      process.env.JWT_SECRET || "fallbackSecret",
      { expiresIn: "1h" },
    );
    // send the token back to the client along with some user info
    res.json({ token, user: { id: user._id, username: user.username } });
  } catch (err) {
    // send server error if something fails
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
