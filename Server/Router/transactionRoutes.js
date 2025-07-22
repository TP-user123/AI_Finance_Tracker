const express = require('express');
const router = express.Router();
const Category = require('../Model/Category');
const Transaction = require('../Model/Transaction');
const {
  getAllTransactions,
  addTransaction,
  deleteTransaction,
  updateTransaction,
  addCustomCategory, 
} = require('../Controller/transactionController');
const authMiddleware = require('../Middleware/authMiddleware');

// 🔐 Protect all routes
router.use(authMiddleware);

// -------------------- Transactions --------------------

// GET all transactions
router.get('/', getAllTransactions);

// POST a new transaction
router.post('/', addTransaction);

// DELETE a transaction
router.delete('/:id', deleteTransaction);

// UPDATE a transaction
router.put('/:id', updateTransaction);

// ✅ GET total debit for current month
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

// -------------------- Categories --------------------


// POST a new category
router.post('/categories', authMiddleware, async (req, res) => {
  try {
    const { name, type } = req.body;

    if (!["credit", "debit"].includes(type)) {
      return res.status(400).json({ error: "Invalid category type" });
    }

    const existing = await Category.findOne({
      name,
      type,
      $or: [
        { isDefault: true },
        { userId: req.userId }
      ]
    });

    if (existing) {
      return res.status(400).json({ error: "Category already exists" });
    }

    const newCategory = new Category({
      userId: req.userId,
      name,
      type,
      isDefault: false,
    });

    await newCategory.save();

    // ✅ Send back the new category
    res.status(201).json(newCategory);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// GET all categories (default + user-defined)
// GET all categories (default + custom)
router.get('/categories', authMiddleware, async (req, res) => {
  try {
    const userId = req.userId;

    const categories = await Category.find({
      $or: [
        { isDefault: true },
        { userId }
      ]
    });

    // Extract just the names per type
    const credit = categories
      .filter(c => c.type === 'credit')
      .map(c => c.name);

    const debit = categories
      .filter(c => c.type === 'debit')
      .map(c => c.name);

    res.json({ credit, debit });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/transactions/categories/custom
router.delete('/categories/custom', authMiddleware, async (req, res) => {
  try {
    const { name, type } = req.body; // ✅ Fixed: read from body instead of query

    if (!name?.trim() || !type?.trim()) {
      return res.status(400).json({ error: "Missing name or type parameter" });
    }

    const category = await Category.findOne({
      name,
      type,
      userId: req.userId,
    });

    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }

    if (category.isDefault) {
      return res.status(403).json({ error: "Cannot delete default categories" });
    }

    await Category.deleteOne({ _id: category._id });

    res.json({ message: "Category deleted successfully" });
  } catch (err) {
    console.error("Error deleting category:", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
