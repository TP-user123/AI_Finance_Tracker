const express = require('express');
const router = express.Router();
const {
  getAllTransactions,
  addTransaction,
  deleteTransaction,
  updateTransaction
} = require('../Controller/transactionController');

// GET all transactions
router.get('/', getAllTransactions);

// POST a new transaction
router.post('/', addTransaction);

// DELETE a transaction
router.delete('/:id', deleteTransaction);

// UPDATE a transaction
router.put('/:id', updateTransaction);

module.exports = router;

