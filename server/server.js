require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const nodemailer = require('nodemailer');
const bcrypt = require('bcryptjs');

const app = express();

// --- 🌟 PRODUCTION-READY MIDDLEWARE ---
// Explicitly allowing your Vercel URL and localhost to prevent "Preflight" errors
app.use(cors({ 
    origin: true, // 🌟 Dynamically allow the requesting origin
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], 
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true 
}));
app.use(express.json());

// --- 🌐 CLOUD MONGODB CONNECTION ---
const mongoURI = process.env.MONGO_URI;
mongoose.connect(mongoURI)
  .then(() => console.log("✅ TuneX Engine: Cloud MongoDB Connected"))
  .catch(err => console.error("❌ Database Connection Error:", err));

// --- SCHEMAS & MODELS ---
const ragaSchema = new mongoose.Schema({ 
    no: Number, 
    name: String, 
    scale: String, 
    chord1: String, 
    chord2: String, 
    chord3: String 
});
const Raga = mongoose.model('Raga', ragaSchema, 'ragas');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});
const User = mongoose.model('User', userSchema);

// --- VOLATILE MEMORY STORES ---
const otpStore = {}; 
const resetStore = {}; 

// --- CLOUD MAIL CONFIG ---
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS
  }
});

// --- ROUTES: DIAGNOSTICS ---
app.get('/ping', (req, res) => {
    res.send(`<div style="background:#000; color:#FF7F11; padding:50px; font-family:monospace; border:5px solid #FF7F11; text-align:center;">
            <h1>🚀 TuneX CLOUD ENGINE ONLINE</h1>
            <p style="color:#fff;">Status: Active | Protocol: HTTPS</p>
        </div>`);
});

// --- ROUTES: AUTHENTICATION ---

// 1. Registration Phase 1 (Send OTP)
app.post('/api/auth/register-initiate', async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: "Identity already registered." });

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        otpStore[email] = { otp, userData: { name, email, password }, expires: Date.now() + 300000 };

        await transporter.sendMail({
            from: `"TuneX Systems" <${process.env.GMAIL_USER}>`,
            to: email,
            subject: 'TuneX Verification Code',
            html: `<h1 style="color:#FF7F11;">Verification Code: ${otp}</h1>`
        });
        res.status(200).json({ message: "OTP sent to email." });
    } catch (error) { res.status(500).json({ message: "Mail Server Error." }); }
});

// 2. Registration Phase 2 (Verify OTP & Save)
app.post('/api/auth/verify-otp', async (req, res) => {
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
            password: hashedPassword 
        });

        await newUser.save();
        delete otpStore[email];
        res.status(201).json({ user: { name: newUser.name, email: newUser.email } });
    } catch (err) { res.status(500).json({ message: "Account Creation Failed." }); }
});

// 3. Login
app.post('/api/auth/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "User not found." });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Incorrect password." });

        res.status(200).json({ user: { name: user.name, email: user.email } });
    } catch (err) { res.status(500).json({ message: "Internal Server Error." }); }
});

// 4. Forgot Password (Initiate)
app.post('/api/auth/forgot-password', async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: "Email not found." });

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        resetStore[email] = { otp, expires: Date.now() + 300000 };

        await transporter.sendMail({
            from: `"TuneX Systems" <${process.env.GMAIL_USER}>`,
            to: email,
            subject: 'TuneX Password Recovery',
            html: `<h1 style="color:#FF7F11;">Recovery Code: ${otp}</h1>`
        });
        res.status(200).json({ message: "Recovery code sent." });
    } catch (error) { res.status(500).json({ message: "Mail Error." }); }
});

// 5. Reset Password (Finalize)
app.post('/api/auth/reset-password', async (req, res) => {
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
    } catch (error) { res.status(500).json({ message: "Update Error." }); }
});

// --- SERVER START ---
const PORT = process.env.PORT || 5005;
app.listen(PORT, () => console.log(`🚀 Engine Live on Port ${PORT}`));