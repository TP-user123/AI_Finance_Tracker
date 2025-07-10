const Transaction = require('../Model/Transaction');

// GET all transactions
const getAllTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find().sort({ date: -1 });
    res.status(200).json(transactions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST a transaction
const addTransaction = async (req, res) => {
  try {
    const { date, description, amount, type, category } = req.body;

    // Check for duplicate transaction
    const existing = await Transaction.findOne({ date, description, amount, type, category });
    if (existing) {
      return res.status(409).json({ error: 'Duplicate transaction detected' });
    }

    const transaction = new Transaction({ date, description, amount, type, category });
    const saved = await transaction.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};


// DELETE a transaction
const deleteTransaction = async (req, res) => {
  try {
    const deleted = await Transaction.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Transaction not found' });
    res.status(200).json({ message: 'Transaction deleted', id: req.params.id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// UPDATE a transaction
const updateTransaction = async (req, res) => {
  try {
    const updated = await Transaction.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updated) return res.status(404).json({ error: 'Transaction not found' });
    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getAllTransactions,
  addTransaction,
  deleteTransaction,
  updateTransaction
};
