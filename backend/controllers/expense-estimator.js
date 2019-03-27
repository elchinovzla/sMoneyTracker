const EstimatedExpense = require('../models/estimated-expense');
const Salary = require('../models/salary');

exports.createEstimatedExpense = (req, res, next) => {
  const expense = new EstimatedExpense({
    description: req.body.description,
    expenseType: req.body.expenseType,
    amount: req.body.amount,
    createdById: req.body.createdById
  });
  expense
    .save()
    .then(result => {
      res.status(201).json({
        message: 'Estimated expense created',
        result: result
      });
    })
    .catch(error => {
      res.status(500).json({
        message: 'Error creating estimated expense: ' + error
      });
    });
};

exports.getEstimatedExpense = (req, res, next) => {
  EstimatedExpense.findById(req.params.id)
    .then(estimatedExpense => {
      if (estimatedExpense) {
        res.status(200).json(estimatedExpense);
      } else {
        res.status(400).json({ message: 'Estimated expense not found' });
      }
    })
    .catch(error => {
      res.status(500).json({
        message: 'Failed to get estimated expense: ' + error
      });
    });
};

exports.getEstimatedExpenses = (req, res, next) => {
  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;
  const estimatedExpenseQuery = EstimatedExpense.find({}).sort([
    ['description', 1]
  ]);
  let fetchedEstimatedExpenses;
  if (pageSize && currentPage) {
    estimatedExpenseQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
  }
  estimatedExpenseQuery
    .then(documents => {
      fetchedEstimatedExpenses = documents;
      return EstimatedExpense.count();
    })
    .then(count => {
      res.status(200).json({
        message: 'Estimated expense fetched successfully',
        estimatedExpenses: fetchedEstimatedExpenses,
        maxExpenses: count
      });
    })
    .catch(error => {
      res.status(500).json({
        message: 'Failed to get estimated expenses: ' + error
      });
    });
};

exports.updateEstimatedExpense = (req, res, next) => {
  EstimatedExpense.findOneAndUpdate(
    { _id: req.body.id },
    {
      description: req.body.description,
      expenseType: req.body.expenseType,
      amount: req.body.amount
    }
  )
    .then(() => {
      res.status(201).json({
        message: 'Estimated expense updated'
      });
    })
    .catch(error => {
      res.status(500).json({
        message: 'Failed to update estimated expense: ' + error
      });
    });
};

exports.deleteEstimatedExpense = (req, res, next) => {
  EstimatedExpense.deleteOne({ _id: req.body.id })
    .then(() => {
      res.status(201).json({
        message: 'Estimated expense deleted'
      });
    })
    .catch(error => {
      res.status(500).json({
        message: 'Failed to delete estimated expense: ' + error
      });
    });
};

exports.createSalary = (req, res, next) => {
  const salary = new Salary({
    salaryType: req.body.salaryType,
    amount: req.body.amount,
    createdById: req.body.createdById
  });
  salary
    .save()
    .then(result => {
      res.status(201).json({
        message: 'Salary created',
        result: result
      });
    })
    .catch(error => {
      res.status(500).json({
        message: 'Error creating salary: ' + error
      });
    });
};

exports.getSalary = (req, res, next) => {
  Salary.findById(req.params.id)
    .then(salary => {
      if (salary) {
        res.status(200).json(salary);
      } else {
        res.status(400).json({ message: 'Salary not found' });
      }
    })
    .catch(error => {
      res.status(500).json({
        message: 'Failed to get salary: ' + error
      });
    });
};

exports.getSalaryByOwner = (req, res, next) => {
  Salary.findOne({ createdById: req.params.id })
    .then(salary => {
      if (salary) {
        res.status(200).json({
          salaryId: salary._id,
          monthlySalaryAmount: getMonthlySalary(salary)
        });
      } else {
        res.status(400).json({ message: 'Salary not found' });
      }
    })
    .catch(error => {
      res.status(400).json(null);
    });
};

exports.updateSalary = (req, res, next) => {
  Salary.findOneAndUpdate(
    { _id: req.body.id },
    {
      salaryType: req.body.salaryType,
      amount: req.body.amount
    }
  )
    .then(() => {
      res.status(201).json({
        message: 'Salary updated'
      });
    })
    .catch(error => {
      res.status(500).json({
        message: 'Failed to update salary: ' + error
      });
    });
};

function getMonthlySalary(salaryData) {
  if (salaryData) {
    let salaryAmount = salaryData.amount;
    switch (salaryData.salaryType) {
      case 'WEEKLY': {
        salaryAmount *= 52 / 12;
        break;
      }
      case 'BI_WEEKLY': {
        salaryAmount *= 13 / 6;
        break;
      }
      case 'SEMI_MONTHLY': {
        salaryAmount *= 2;
        break;
      }
      case 'MONTHLY': {
        salaryAmount *= 1;
        break;
      }
    }
    return convertToMoney(salaryAmount);
  }
}

function convertToMoney(amount) {
  return '$' + amount.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
}
