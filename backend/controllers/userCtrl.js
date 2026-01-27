const Users = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const userCtrl = {
  // ✅ REGISTER USER
  registerUser: async (req, res) => {
    try {
      const { username, email, password } = req.body;

      // Check if email already exists
      const userExists = await Users.findOne({ email });
      if (userExists)
        return res.status(400).json({ msg: "The email already exists" });

      // Hash password
      const passwordHash = await bcrypt.hash(password, 10);

      // Create new user
      const newUser = new Users({
        username,
        email,
        password: passwordHash,
      });

      await newUser.save();
      res.json({ msg: "Signup successful" });
    } catch (err) {
      res.status(500).json({ msg: err.message });
    }
  },

  // ✅ LOGIN USER
  loginUser: async (req, res) => {
    try {
      const { email, password } = req.body;

      const user = await Users.findOne({ email });
      if (!user) return res.status(400).json({ msg: "User does not exist." });

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(400).json({ msg: "Incorrect password" });

      // ✅ Create JWT token
      const payload = { id: user._id, name: user.username };
      const token = jwt.sign(payload, process.env.TOKEN_SECRET, { expiresIn: "7d" });

      res.json({ token });
    } catch (err) {
      res.status(500).json({ msg: err.message });
    }
  },

  // ✅ VERIFY TOKEN (used for frontend to check login)
  verifyToken: async (req, res) => {
    try {
      const token = req.header("Authorization");
      if (!token) return res.send(false);

      jwt.verify(token, process.env.TOKEN_SECRET, async (err, verified) => {
        if (err) return res.send(false);

        const user = await Users.findById(verified.id);
        if (!user) return res.send(false);

        return res.send(true);
      });
    } catch (err) {
      res.status(400).json({ msg: err.message });
    }
  },
};

module.exports = userCtrl;
