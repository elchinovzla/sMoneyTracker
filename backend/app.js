import express from 'express';
import { json } from 'body-parser';
import { connect } from 'mongoose';

import userRoutes from './routes/user';
import expenseEstimatorRoutes from './routes/expense-estimator';
import incomeRoutes from './routes/income';
import moneyRoutes from './routes/money';
import savingsRoutes from './routes/savings';
import expenseRoutes from './routes/expense';
import { USER_NAME, PASSWORD } from './middleware/db-credentials';

const app = express();

connect(
    'mongodb+srv://' +
    USER_NAME +
    ':' +
    PASSWORD +
    '@cluster0-fkcx5.mongodb.net/smoney-tracker',
    {
      useNewUrlParser: true
    }
  )
  .then(() => {
    console.log('Connected to database!');
  })
  .catch(() => {
    console.log('Connection failed!');
  });

app.use(json());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PATCH, PUT, DELETE, OPTIONS'
  );
  next();
});

app.use('/api/user', userRoutes);
app.use('/api/expense-estimator', expenseEstimatorRoutes);
app.use('/api/income', incomeRoutes);
app.use('/api/money', moneyRoutes);
app.use('/api/savings', savingsRoutes);
app.use('/api/expense', expenseRoutes);

export default app;
