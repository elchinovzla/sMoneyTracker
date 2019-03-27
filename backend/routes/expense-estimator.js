const express = require('express');
const expenseEstimatorController = require('../controllers/expense-estimator');

const router = express.Router();

router.post(
  '/expense-estimator',
  expenseEstimatorController.createEstimatedExpense
);

router.get(
  '/expense-estimator',
  expenseEstimatorController.getEstimatedExpenses
);

router.get(
  '/expense-estimator/:id',
  expenseEstimatorController.getEstimatedExpense
);

router.patch(
  '/update-expense-estimator/:id',
  expenseEstimatorController.updateEstimatedExpense
);

router.delete(
  '/expense-estimator',
  expenseEstimatorController.deleteEstimatedExpense
);

router.post('/salary', expenseEstimatorController.createSalary);

router.get('/salary/:id', expenseEstimatorController.getSalary);

router.get('/salaryByOwner/:id', expenseEstimatorController.getSalaryByOwner);

router.patch('/salary/:id', expenseEstimatorController.updateSalary);

module.exports = router;
