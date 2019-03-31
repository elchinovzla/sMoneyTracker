const EstimatedExpense = require('../models/estimated-expense');
const Salary = require('../models/salary');
const Dinero = require('dinero.js');
Dinero.defaultCurrency = 'CAD';

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
  const estimatedExpenseQuery = EstimatedExpense.find({
    createdById: req.query.createdById
  }).sort([['description', 1]]);
  if (pageSize && currentPage) {
    estimatedExpenseQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
  }
  estimatedExpenseQuery
    .then(estimatedExpenses => {
      res.status(200).json({
        message: 'Estimated expense fetched successfully',
        estimatedExpenses: estimatedExpenses
      });
    })
    .catch(error => {
      res.status(500).json({
        message: 'Failed to get estimated expenses: ' + error
      });
    });
};

exports.getTotalCountEstimatedExpenses = (req, res, next) => {
  EstimatedExpense.find({ createdById: req.params.createdById }).then(
    estimatedExpenses => {
      if (estimatedExpenses) {
        res.status(200).json({
          maxEstimatedExpenses: getTotal(estimatedExpenses)
        });
      } else {
        res.status(200).json({
          maxEstimatedExpenses: 0
        });
      }
    }
  );
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
  EstimatedExpense.deleteOne({ _id: req.params.id })
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

exports.getSalaryByOwner = (req, res, next) => {
  Salary.findOne({ createdById: req.params.id })
    .then(salary => {
      if (salary) {
        res.status(200).json({
          salaryId: salary._id,
          monthlySalaryAmount: getMonthlySalary(salary)
        });
      } else {
        res.status(200).json({
          message: 'Could not find any salary',
          salaryId: '',
          monthlySalaryAmount: 0
        });
      }
    })
    .catch(error => {
      res.status(500).json({
        message: 'Failed to get a salary: ' + error
      });
    });
};

exports.getMonthlyExpensesByOwner = (req, res, next) => {
  EstimatedExpense.find({ createdById: req.params.id })
    .then(estimatedExpenses => {
      if (estimatedExpenses) {
        res.status(200).json({
          monthlyTotalExpectedExpenseAmount: getTotalEstimatedExpenses(
            estimatedExpenses,
            null
          )
        });
      } else {
        res.status(200).json({
          message: 'Could not find any estimated expense',
          monthlyTotalExpectedExpenseAmount: 0
        });
      }
    })
    .catch(error => {
      res.status(500).json({
        message: 'Failed to get an estimated expense: ' + error
      });
    });
};

exports.getDetailedMonthlyExpensesByOwner = (req, res, next) => {
  EstimatedExpense.find({ createdById: req.params.id })
    .then(estimatedExpenses => {
      if (estimatedExpenses) {
        res.status(200).json({
          monthlyTotalExpectedExpense: getTotalEstimatedExpenses(
            estimatedExpenses,
            null
          ),
          monthlyDineOutExpectedExpense: getTotalEstimatedExpenses(
            estimatedExpenses,
            'DINE_OUT'
          ),
          monthlyGiftExpectedExpense: getTotalEstimatedExpenses(
            estimatedExpenses,
            'GIFT'
          ),
          monthlyGroceryExpectedExpense: getTotalEstimatedExpenses(
            estimatedExpenses,
            'GROCERY'
          ),
          monthlyHouseExpectedExpense: getTotalEstimatedExpenses(
            estimatedExpenses,
            'HOUSE'
          ),
          monthlyMembershipExpectedExpense: getTotalEstimatedExpenses(
            estimatedExpenses,
            'MEMBERSHIP'
          ),
          monthlyOtherExpectedExpense: getTotalEstimatedExpenses(
            estimatedExpenses,
            'OTHER'
          ),
          monthlyTransportationExpectedExpense: getTotalEstimatedExpenses(
            estimatedExpenses,
            'TRANSPORTATION'
          ),
          monthlyTravelExpectedExpense: getTotalEstimatedExpenses(
            estimatedExpenses,
            'TRAVEL'
          )
        });
      } else {
        res.status(200).json({
          message: 'Could not find any estimated expense',
          monthlyTotalExpectedExpense: 0,
          monthlyDineOutExpectedExpense: 0,
          monthlyGiftExpectedExpense: 0,
          monthlyGroceryExpectedExpense: 0,
          monthlyHouseExpectedExpense: 0,
          monthlyMembershipExpectedExpense: 0,
          monthlyOtherExpectedExpense: 0,
          monthlyTransportationExpectedExpense: 0,
          monthlyTravelExpectedExpense: 0
        });
      }
    })
    .catch(error => {
      res.status(500).json({
        message: 'Failed to get an estimated expense: ' + error
      });
    });
};

function getMonthlySalary(salaryData) {
  if (salaryData) {
    let salaryAmount = Dinero({ amount: Math.round(salaryData.amount * 100) });
    switch (salaryData.salaryType) {
      case 'WEEKLY': {
        salaryAmount = salaryAmount.multiply(52).divide(12);
        break;
      }
      case 'BI_WEEKLY': {
        salaryAmount = salaryAmount.multiply(13).divide(6);
        break;
      }
      case 'SEMI_MONTHLY': {
        salaryAmount = salaryAmount.multiply(2);
        break;
      }
    }
    return salaryAmount.getAmount() / 100;
  }
}

function getTotalEstimatedExpenses(estimatedExpenses, expenseType) {
  let totalAmount = Dinero({ amount: 0 });
  if (expenseType) {
    estimatedExpenses.forEach(function(estimatedExpense) {
      if (expenseType === estimatedExpense.expenseType) {
        totalAmount = totalAmount.add(
          Dinero({ amount: Math.round(estimatedExpense.amount * 100) })
        );
      }
    });
  } else {
    estimatedExpenses.forEach(function(estimatedExpense) {
      totalAmount = totalAmount.add(
        Dinero({ amount: Math.round(estimatedExpense.amount * 100) })
      );
    });
  }
  return totalAmount.getAmount() / 100;
}

function getTotal(estimatedExpenses) {
  let totalCount = 0;
  estimatedExpenses.forEach(function() {
    totalCount++;
  });
  return totalCount;
}
