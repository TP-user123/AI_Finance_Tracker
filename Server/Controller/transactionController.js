const Transaction = require('../Model/Transaction');

// GET all transactions for the logged-in user
const getAllTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({ userId: req.userId }).sort({ date: -1 });
    res.status(200).json(transactions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST a new transaction for the logged-in user
const addTransaction = async (req, res) => {
  try {
    const { date, description, amount, type, category } = req.body;

    // Check for duplicate transaction (optional)
    const existing = await Transaction.findOne({
      date,
      description,
      amount,
      type,
      category,
      userId: req.userId,
    });

    if (existing) {
      return res.status(409).json({ error: 'Duplicate transaction detected' });
    }

    const transaction = new Transaction({
      date,
      description,
      amount,
      type,
      category,
      userId: req.userId, // attach logged-in user ID
    });

    const saved = await transaction.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// DELETE a transaction (only if it belongs to the logged-in user)
const deleteTransaction = async (req, res) => {
  try {
    const deleted = await Transaction.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId,
    });

    if (!deleted) return res.status(404).json({ error: 'Transaction not found' });

    res.status(200).json({ message: 'Transaction deleted', id: req.params.id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// UPDATE a transaction (only if it belongs to the logged-in user)
const updateTransaction = async (req, res) => {
  try {
    const updated = await Transaction.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      req.body,
      { new: true }
    );

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
  updateTransaction,
};
