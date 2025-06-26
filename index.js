const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

const PORT = 5000;
const MONGO_URI = 'mongodb+srv://harishvishaltm23aid:OSvevcYudmfq0HYS@cluster0.cgci7jo.mongodb.net/2er?retryWrites=true&w=majority&appName=Cluster0';

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

mongoose.connect(MONGO_URI)
    .then(() => {
        console.log("Connected to MongoDB");
    })
    .catch((err) => {
        console.log('MongoDB connection error', err);
    });

app.post('/Expense', async (req, res) => {
    try {
        const { title, amount } = req.body;
        const expense = new Expense({ title, amount });
        await expense.save();
        res.status(201).json(expense);
    } catch (error) {
        console.error('Error saving expense', error);
        res.status(500).json({ error: "Failed to save" });
    }
});

app.get('/Expense', async (req, res) => {
    try {
        const expenses = await Expense.find();
        res.status(200).json(expenses);
    } catch (error) {
        console.error('Error fetching expenses:', error);
        res.status(500).json({ error: "Failed to retrieve expenses" });
    }
});

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
        console.error('Error deleting expense:', error);
        res.status(500).json({ error: 'Failed to delete' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});
