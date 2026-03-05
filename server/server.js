require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const nodemailer = require("nodemailer");
const bcrypt = require("bcryptjs");

const app = express();

// --- 🌟 PRODUCTION-READY MIDDLEWARE ---
// Using a flexible CORS policy so ANY Vercel preview URL will work automatically
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
// Models MUST be defined before the routes use them!

// 1. 🌟 FIXED RAGA SCHEMA: Now perfectly matches your CSV Database!
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

// 2. User Model
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
}, { timestamps: true }); // Automatically adds createdAt and updatedAt
const User = mongoose.model("User", userSchema);

// 3. User History Model (For Cloud Session Logs)
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
  secure: false, // Must be false for port 587
  requireTLS: true,
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false, // Helps bypass Render's internal proxy blocking
  },
});

// --- TRANSPORTER VERIFICATION ---
transporter.verify((error, success) => {
  if (error) {
    console.error("❌ TRANSPORTER VERIFICATION FAILED:", error);
  } else {
    console.log("✅ TRANSPORTER READY:", success);
  }
});

// --- ROUTES: DIAGNOSTICS ---
app.get("/ping", (req, res) => {
  res.send(`<div style="background:#000; color:#FF7F11; padding:50px; font-family:monospace; border:5px solid #FF7F11; text-align:center;">
            <h1>🚀 TuneX CLOUD ENGINE ONLINE</h1>
            <p style="color:#fff;">Status: Active | Protocol: HTTPS</p>
        </div>`);
});

// --- ROUTES: RAGAS ---
// Fetch all Ragas from the database
app.get('/api/ragas', async (req, res) => {
  try {
    const ragas = await Raga.find(); // Retrieves all documents from the 'ragas' collection
    res.status(200).json(ragas);
  } catch (error) {
    console.error("❌ Error fetching ragas:", error);
    res.status(500).json({ message: "Failed to fetch Raga database." });
  }
});

// --- ROUTES: CLOUD HISTORY ---
// Save a played scale to the cloud
// --- ROUTES: CLOUD HISTORY ---
// Save a played scale to the cloud
app.post('/api/history/add', async (req, res) => {
  console.log(`📥 Incoming play event from: ${req.body.userEmail}`); // 🌟 TRACKER 1
  
  try {
    const { userEmail, ragaData } = req.body;
    const newLog = new UserHistory({ userEmail, ragaData, playedAt: new Date() });
    
    await newLog.save();
    console.log("✅ Successfully saved to MongoDB Atlas!"); // 🌟 TRACKER 2
    res.status(201).json({ message: "History saved!" });

  } catch (error) {
    console.error("❌ Database Save Error:", error.message); // 🌟 TRACKER 3
    res.status(500).json({ error: "Failed to save history", details: error.message });
  }
});

// Fetch user's history
app.get('/api/history/:email', async (req, res) => {
  try {
    const history = await UserHistory.find({ userEmail: req.params.email })
      .sort({ playedAt: -1 })
      .limit(50);
      
    // Format data so the React CardDisplay understands it perfectly
    const formattedHistory = history.map(log => ({
      ...log.ragaData,
      playedAt: log.playedAt,
      _id: log._id
    }));

    res.status(200).json(formattedHistory);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch history" });
  }
});

// --- ROUTES: AUTHENTICATION ---

// 1. Registration Phase 1 (Send OTP)
app.post("/api/auth/register-initiate", async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "Identity already registered." });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    otpStore[email] = {
      otp,
      userData: { name, email, password },
      expires: Date.now() + 300000,
    };

    await transporter.sendMail({
      from: `"TuneX Systems" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: "TuneX Verification Code",
      html: `<h1 style="color:#FF7F11;">Verification Code: ${otp}</h1>`,
    });

    console.log("✅ Email successfully sent to", email);
    res.status(200).json({ message: "OTP sent to email." });
  } catch (error) {
    console.error("❌ NODEMAILER FAILURE:", error.message);
    console.error("📋 Full Error Details:", error);
    res.status(500).json({
      message: "Mail Server Error.",
      error: error.message,
      hint: "Ensure Gmail has 2FA enabled and App Password is set in .env",
    });
  }
});

// 2. Registration Phase 2 (Verify OTP & Save)
app.post("/api/auth/verify-otp", async (req, res) => {
  const { email, otp } = req.body;
  const record = otpStore[email];

  if (!record || record.otp !== otp || Date.now() > record.expires) {
    return res.status(400).json({ message: "Invalid or expired OTP." });
  }

  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(record.userData.password, salt);

    const newUser = new User({
      name: record.userData.name,
      email: record.userData.email,
      password: hashedPassword,
    });

    await newUser.save();
    delete otpStore[email];
    res
      .status(201)
      .json({ user: { name: newUser.name, email: newUser.email } });
  } catch (err) {
    res.status(500).json({ message: "Account Creation Failed." });
  }
});

// 3. Login
app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found." });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Incorrect password." });

    res.status(200).json({ user: { name: user.name, email: user.email } });
  } catch (err) {
    res.status(500).json({ message: "Internal Server Error." });
  }
});

// 4. Forgot Password (Initiate)
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
    console.error("❌ FORGOT PASSWORD EMAIL FAILURE:", error.message);
    console.error("📋 Full Error Details:", error);
    res.status(500).json({
      message: "Mail Error.",
      error: error.message,
    });
  }
});

// 5. Reset Password (Finalize)
app.post("/api/auth/reset-password", async (req, res) => {
  const { email, otp, newPassword } = req.body;
  const record = resetStore[email];

  if (!record || record.otp !== otp || Date.now() > record.expires) {
    return res.status(400).json({ message: "Invalid or expired code." });
  }

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

// The '0.0.0.0' is crucial for Render
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Engine Live on Port ${PORT}`);
});