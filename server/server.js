require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const nodemailer = require("nodemailer");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken"); // 🌟 NEW: Added JWT

const app = express();

// --- 🌟 PRODUCTION-READY MIDDLEWARE ---
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (origin.startsWith("http://localhost") || origin.endsWith("vercel.app")) {
        return callback(null, true);
      } else {
        return callback(new Error("CORS Blocking: Origin not allowed"), false);
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);
app.use(express.json());

// --- 🌐 CLOUD MONGODB CONNECTION ---
const mongoURI = process.env.MONGO_URI;
mongoose
  .connect(mongoURI)
  .then(() => console.log("✅ TuneX Engine: Cloud MongoDB Connected"))
  .catch((err) => console.error("❌ Database Connection Error:", err));

// --- 🎼 SCHEMAS & MODELS ---
const RagaSchema = new mongoose.Schema({
  No: { type: Number },
  "Raga Name": { type: String },
  "Scale (Notes)": { type: String },
  "Chord 1 (Notes)": { type: String },
  "Chord 2 (Notes)": { type: String },
  "Chord 3 (Notes)": { type: String },
  Chakra: { type: String }
}, { timestamps: true });
const Raga = mongoose.model('Raga', RagaSchema);

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin', 'owner'], default: 'user' }
}, { timestamps: true });
const User = mongoose.model("User", userSchema);

const historySchema = new mongoose.Schema({
  userEmail: { type: String, required: true },
  ragaData: { type: Object, required: true }, 
  playedAt: { type: Date, default: Date.now, required: true }
});
const UserHistory = mongoose.model("UserHistory", historySchema, "user_history");

// --- VOLATILE MEMORY STORES ---
const otpStore = {};
const resetStore = {};

// --- 📧 CLOUD MAIL CONFIG ---
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, 
  requireTLS: true,
  auth: { user: process.env.GMAIL_USER, pass: process.env.GMAIL_PASS },
  tls: { rejectUnauthorized: false },
});

// --- 🛡️ SECURITY MIDDLEWARE (NEW) ---
// 1. Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'tunex_fallback_secret', { expiresIn: '30d' });
};

// 2. Protect Route (Check if user is logged in)
const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'tunex_fallback_secret');
      req.user = await User.findById(decoded.id).select('-password');
      next();
    } catch (error) {
      res.status(401).json({ message: "Not authorized, token failed." });
    }
  }
  if (!token) res.status(401).json({ message: "Not authorized, no token." });
};

// 3. Admin Only Route (Check if user is admin)
const adminOnly = (req, res, next) => {
  if (req.user && (req.user.role === 'admin' || req.user.role === 'owner')) {
    next();
  } else {
    res.status(403).json({ message: "Access Denied. Admin privileges required." });
  }
};

// --- ROUTES: DIAGNOSTICS ---
app.get("/ping", (req, res) => res.send(`<h1>🚀 TuneX CLOUD ENGINE ONLINE</h1>`));

// --- ROUTES: RAGAS ---
// Public: Fetch all Ragas
app.get('/api/ragas', async (req, res) => {
  try {
    const ragas = await Raga.find(); 
    res.status(200).json(ragas);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch Raga database." });
  }
});

// 🌟 SECURED: Create a new Raga
app.post('/api/ragas', protect, adminOnly, async (req, res) => {
  try {
    const newRaga = new Raga(req.body);
    await newRaga.save();
    res.status(201).json(newRaga);
  } catch (error) {
    res.status(500).json({ message: "Failed to map new Raga." });
  }
});

// 🌟 SECURED: Update a specific Raga
app.put('/api/ragas/:id', protect, adminOnly, async (req, res) => {
  try {
    const updatedRaga = await Raga.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!updatedRaga) return res.status(404).json({ message: "Raga not found in database." });
    res.status(200).json(updatedRaga);
  } catch (error) {
    res.status(500).json({ message: "Failed to update Raga." });
  }
});

// 🌟 SECURED: Delete a specific Raga
app.delete('/api/ragas/:id', protect, adminOnly, async (req, res) => {
  try {
    const deletedRaga = await Raga.findByIdAndDelete(req.params.id);
    if (!deletedRaga) return res.status(404).json({ message: "Raga not found in database." });
    res.status(200).json({ message: "Raga successfully deleted." });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete Raga." });
  }
});

// --- ROUTES: ADMIN ---
// 🌟 SECURED: Get all users
app.get("/api/users", protect, adminOnly, async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch users database." });
  }
});

// 🌟 SECURED: Update User Role
app.put("/api/users/:id/role", protect, adminOnly, async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, { role: req.body.role }, { new: true }).select('-password');
    if (!updatedUser) return res.status(404).json({ message: "User not found" });
    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(500).json({ message: "Failed to update role." });
  }
});

// 🌟 SECURED: Delete a User
app.delete("/api/users/:id", protect, adminOnly, async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) return res.status(404).json({ message: "User not found" });
    res.status(200).json({ message: "User successfully removed." });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete user." });
  }
});

// --- ROUTES: CLOUD HISTORY ---
app.post('/api/history/add', async (req, res) => {
  try {
    const newLog = new UserHistory({ userEmail: req.body.userEmail, ragaData: req.body.ragaData, playedAt: new Date() });
    await newLog.save();
    res.status(201).json({ message: "History saved!" });
  } catch (error) {
    res.status(500).json({ error: "Failed to save history" });
  }
});

app.get('/api/history/:email', async (req, res) => {
  try {
    const history = await UserHistory.find({ userEmail: req.params.email }).sort({ playedAt: -1 }).limit(50);
    const formattedHistory = history.map(log => ({ ...log.ragaData, playedAt: log.playedAt, _id: log._id }));
    res.status(200).json(formattedHistory);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch history" });
  }
});

// --- ROUTES: AUTHENTICATION ---
app.post("/api/auth/register-initiate", async (req, res) => {
  // ... (Your existing code here is fine)
  const { name, email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "Identity already registered." });
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    otpStore[email] = { otp, userData: { name, email, password }, expires: Date.now() + 300000 };
    await transporter.sendMail({
      from: `"TuneX Systems" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: "TuneX Verification Code",
      html: `<h1 style="color:#FF7F11;">Verification Code: ${otp}</h1>`,
    });
    res.status(200).json({ message: "OTP sent to email." });
  } catch (error) {
    res.status(500).json({ message: "Mail Server Error." });
  }
});

app.post("/api/auth/verify-otp", async (req, res) => {
  const { email, otp } = req.body;
  const record = otpStore[email];
  if (!record || record.otp !== otp || Date.now() > record.expires) return res.status(400).json({ message: "Invalid or expired OTP." });
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(record.userData.password, salt);
    const newUser = new User({ name: record.userData.name, email: record.userData.email, password: hashedPassword, role: 'user' });
    await newUser.save();
    delete otpStore[email];
    
    // 🌟 RETURN TOKEN
    res.status(201).json({ 
      user: { _id: newUser._id, name: newUser.name, email: newUser.email, role: newUser.role },
      token: generateToken(newUser._id)
    });
  } catch (err) {
    res.status(500).json({ message: "Account Creation Failed." });
  }
});

app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found." });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Incorrect password." });

    // 🌟 RETURN TOKEN
    res.status(200).json({ 
        user: { _id: user._id, name: user.name, email: user.email, role: user.role },
        token: generateToken(user._id)
    });
  } catch (err) {
    res.status(500).json({ message: "Internal Server Error." });
  }
});

// ... (Forgot Password / Reset routes remain identical)
app.post("/api/auth/forgot-password", async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "Email not found." });
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    resetStore[email] = { otp, expires: Date.now() + 300000 };
    await transporter.sendMail({
      from: `"TuneX Systems" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: "TuneX Password Recovery",
      html: `<h1 style="color:#FF7F11;">Recovery Code: ${otp}</h1>`,
    });
    res.status(200).json({ message: "Recovery code sent." });
  } catch (error) {
    res.status(500).json({ message: "Mail Error.", error: error.message });
  }
});

app.post("/api/auth/reset-password", async (req, res) => {
  const { email, otp, newPassword } = req.body;
  const record = resetStore[email];
  if (!record || record.otp !== otp || Date.now() > record.expires) return res.status(400).json({ message: "Invalid or expired code." });
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    await User.findOneAndUpdate({ email }, { password: hashedPassword });
    delete resetStore[email];
    res.status(200).json({ message: "Password updated." });
  } catch (error) {
    res.status(500).json({ message: "Update Error." });
  }
});

// --- SERVER START ---
const PORT = process.env.PORT || 5005;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Engine Live on Port ${PORT}`);
});