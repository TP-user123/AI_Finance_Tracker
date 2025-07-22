const Transaction = require('../Model/Transaction');

const getAllTransactions = async (req, res) => {
  try {
    console.log("Fetching transactions for:", req.userId); // ✅ debug log
    const transactions = await Transaction.find({ userId: req.userId }).sort({ date: -1 });
    res.status(200).json(transactions);
  } catch (err) {
    console.error("Error in getAllTransactions:", err); // ✅ show full error
    res.status(500).json({ error: err.message });
  }
};


const addTransaction = async (req, res) => {
  try {
    const { date, description, amount, type, category, isCustomCategory, paymentMode } = req.body;

    // Validate transaction type
    if (!["credit", "debit"].includes(type)) {
      return res.status(400).json({ error: "Invalid transaction type. Must be 'credit' or 'debit'." });
    }

    // Validate amount
    if (!amount || amount <= 0) {
      return res.status(400).json({ error: "Amount must be greater than 0" });
    }

    // Validate date not in future
    const today = new Date().toISOString().split("T")[0];
    if (date > today) {
      return res.status(400).json({ error: "Future dates are not allowed" });
    }

    // Optional: prevent credit via card (custom logic)
    if (type === "credit" && paymentMode === "card") {
      return res.status(400).json({ error: "Card cannot be used for credit transactions" });
    }

    // Check for duplicate transaction (based on date, amount, type, category, user)
    const existing = await Transaction.findOne({
      date,
      amount,
      type,
      category,
      userId: req.userId,
      ...(description && { description }),
    });

    if (existing) {
      return res.status(409).json({ error: "Duplicate transaction detected" });
    }

    // Create new transaction
    const transaction = new Transaction({
      userId: req.userId,
      date,
      description: description || "",
      amount,
      type,
      category,
      isCustomCategory: !!isCustomCategory,
      paymentMode,
    });

    const saved = await transaction.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error("Error in addTransaction:", err);
    res.status(500).json({ error: err.message });
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
    const { date, amount, type, paymentMode, category } = req.body;

    // Validate type
    if (!["credit", "debit"].includes(type)) {
      return res.status(400).json({ error: "Invalid transaction type. Must be 'credit' or 'debit'" });
    }

    // Validate payment mode
    if (type === "credit" && paymentMode === "card") {
      return res.status(400).json({ error: "Card cannot be used for credit transactions" });
    }

    // Validate amount
    if (amount <= 0) {
      return res.status(400).json({ error: "Amount must be greater than 0" });
    }

    // Validate date
    const today = new Date().toISOString().split("T")[0];
    if (date > today) {
      return res.status(400).json({ error: "Future dates are not allowed" });
    }

    // Perform the update
    const updated = await Transaction.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      req.body,
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ error: "Transaction not found" });
    }

    res.status(200).json(updated);
  } catch (err) {
    console.error("Error in updateTransaction:", err);
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getAllTransactions,
  addTransaction,
  deleteTransaction,
  updateTransaction,
  
};

