const express = require('express');
const router = express.Router();

const {
  getAllTransactions,
  addTransaction,
  deleteTransaction,
  updateTransaction,
} = require('../Controller/transactionController');

const authMiddleware = require('../Middleware/authMiddleware');
const Transaction = require('../Model/Transaction');

// 🔐 Protect all routes
router.use(authMiddleware);

// GET all transactions
router.get('/', getAllTransactions);

// POST a new transaction
router.post('/', addTransaction);

// DELETE a transaction
router.delete('/:id', deleteTransaction);

// UPDATE a transaction
router.put('/:id', updateTransaction);

// ✅ NEW: GET total debit for current month
router.get('/monthly-total', async (req, res) => {
  try {
    const userId = req.userId;

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    const transactions = await Transaction.find({
      userId,
      type: 'debit',
      date: { $gte: startOfMonth, $lte: endOfMonth },
    });

    const debit = transactions.reduce((sum, t) => sum + t.amount, 0);

    res.json({ debit });
  } catch (err) {
    console.error('Error fetching monthly total:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
