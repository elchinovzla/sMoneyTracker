const mongoose = require('mongoose');

const savingsSchema = mongoose.Schema({
  description: { type: String, required: true },
  expenseType: { type: String, required: true },
  amount: { type: Number, required: true },
  note: { type: String, required: false },
  createdById: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  }
});

module.exports = mongoose.model('Savings', savingsSchema);
