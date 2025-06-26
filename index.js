const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

const PORT = process.env.PORT || 5000;

// ✅ Replace with your actual MongoDB URI
const MONGO_URI = 'mongodb+srv://harishvishaltm23aid:OSvevcYudmfq0HYS@cluster0.cgci7jo.mongodb.net/2er?retryWrites=true&w=majority&appName=Cluster0';

// ✅ Define schema and model
const expenseSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    }
});

const Expense = mongoose.model('Expense', expenseSchema);

// ✅ Connect to MongoDB
mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => {
    console.log("✅ Connected to MongoDB");
})
.catch((err) => {
    console.error('❌ MongoDB connection error:', err.message);
});

// ✅ Create a new expense
app.post('/Expense', async (req, res) => {
    try {
        const { title, amount } = req.body;

        if (!title || !amount) {
            return res.status(400).json({ error: "Title and amount are required" });
        }

        const expense = new Expense({ title, amount });
        await expense.save();
        res.status(201).json(expense);
    } catch (error) {
        console.error('❌ Error saving expense:', error.message);
        res.status(500).json({ error: "Failed to save" });
    }
});

// ✅ Get all expenses
app.get('/Expense', async (req, res) => {
    try {
        const expenses = await Expense.find();
        res.status(200).json(expenses);
    } catch (error) {
        console.error('❌ Error fetching expenses:', error.message);
        res.status(500).json({ error: "Failed to retrieve expenses" });
    }
});

// ✅ Delete expense by ID
app.delete('/Expense/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const deletedExpense = await Expense.findByIdAndDelete(id);
        if (deletedExpense) {
            res.status(200).json({ message: 'Deleted successfully' });
        } else {
            res.status(404).json({ error: 'Expense not found' });
        }
    } catch (error) {
        console.error('❌ Error deleting expense:', error.message);
        res.status(500).json({ error: 'Failed to delete' });
    }
});

// ✅ Start server
app.listen(PORT, () => {
    console.log(`🚀 Server is listening on port ${PORT}`);
});
