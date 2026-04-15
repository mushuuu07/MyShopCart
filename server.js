require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// --- Database Connection ---
mongoose.connect(process.env.MONGO_URI, { dbName: 'ShopCart' })
.then(() => console.log("Success: Connected to MongoDb Atlas!"))
.catch(err => console.error("Connection Error:", err));

// --- Models ---
const Address = mongoose.model('Address', new mongoose.Schema({
    fullName: String, phone: String, street: String, city: String, state: String, pincode: String
}));

const User = mongoose.model('User', new mongoose.Schema({
    name: String, email: String, phone: String
}));

const Payment = mongoose.model('Payment', new mongoose.Schema({
    method: String, details: mongoose.Schema.Types.Mixed
}, { timestamps: true }));

// --- Routes ---

// Root Route (Fixes "Cannot GET /")
app.get('/', (req, res) => {
    res.send("ShopCart Backend is Live!");
});

app.post('/register', async (req, res) => {
    try {
        const newUser = new User(req.body);
        await newUser.save();
        res.status(201).json({ message: "User registered successfully!" });
    } catch (err) {
        res.status(500).json({ message: "Error saving user", error: err.message });
    }
});

app.post('/save-address', async (req, res) => {
    try {
        const addressData = new Address(req.body);
        await addressData.save();
        res.status(200).json({ message: "Address saved!" });
    } catch (err) {
        res.status(500).json({ message: "Error saving address" });
    }
});

app.post('/save-payment', async (req, res) => {
    try {
        const newPayment = new Payment(req.body);
        await newPayment.save();
        res.status(200).json({ message: "Payment details saved!" });
    } catch (err) {
        res.status(500).json({ message: "Error saving payment" });
    }
});

// --- Start Server ---
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
