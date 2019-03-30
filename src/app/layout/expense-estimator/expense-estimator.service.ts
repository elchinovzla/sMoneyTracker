import { environment } from 'src/environments/environment';
import { Injectable } from '@angular/core';
import { ExpenseEstimate } from './expense-estimate.model';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Salary } from './salary.model';
import { map } from 'rxjs/operators';

const EXPENSE_BACK_END_URL = environment.apiUrl + '/expense-estimator/';

@Injectable({ providedIn: 'root' })
export class ExpenseEstimatorService {
  private expenseEstimates: ExpenseEstimate[] = [];
  private expenseEstimatorUpdated = new Subject<{
    expenseEstimates: ExpenseEstimate[];
    expenseEstimateCount: number;
  }>();
  private expenseEstimatorStatusListener = new Subject<boolean>();

  constructor(private http: HttpClient, private router: Router) {}

  getExpenseEstimatorUpdateListener() {
    return this.expenseEstimatorUpdated.asObservable();
  }

  getExpenseEstimatorStatusListener() {
    return this.expenseEstimatorStatusListener.asObservable();
  }

  createExpenseEstimate(
    description: string,
    expenseType: string,
    amount: number,
    createdById: string
  ) {
    const expenseEstimateData: ExpenseEstimate = {
      id: '',
      description: description,
      expenseType: expenseType,
      amount: amount,
      createdById: createdById
    };
    this.http
      .post<{ message: string }>(
        EXPENSE_BACK_END_URL + 'expense-estimator',
        expenseEstimateData
      )
      .subscribe(
        () => {
          this.router.navigate(['/expense-estimator']);
        },
        error => {
          console.log(error);
          this.expenseEstimatorStatusListener.next(true);
        }
      );
  }

  getExpenseEstimates(
    expenseEstimatesPerPage: number,
    currentPage: number,
    createdById: string
  ) {
    const queryParams = `?pagesize=${expenseEstimatesPerPage}&page=${currentPage}&createdById=${createdById}`;
    this.http
      .get<{ message: string; estimatedExpenses: any; maxExpenses: number }>(
        EXPENSE_BACK_END_URL + 'expense-estimator' + queryParams
      )
      .pipe(
        map(expenseEstimateData => {
          return {
            expenseEstimates: expenseEstimateData.estimatedExpenses.map(
              expenseEstimate => {
                return {
                  id: expenseEstimate._id,
                  description: expenseEstimate.description,
                  expenseType: expenseEstimate.expenseType,
                  amount: expenseEstimate.amount,
                  createdById: expenseEstimate.createdById
                };
              }
            ),
            maxExpenses: expenseEstimateData.maxExpenses
          };
        })
      )
      .subscribe(transformedExpenseData => {
        this.expenseEstimates = transformedExpenseData.expenseEstimates;
        this.expenseEstimatorUpdated.next({
          expenseEstimates: [...this.expenseEstimates],
          expenseEstimateCount: transformedExpenseData.maxExpenses
        });
      });
  }

  getExpenseEstimate(id: string) {
    return this.http.get<{
      _id: string;
      description: string;
      expenseType: string;
      amount: number;
      createdBy: string;
    }>(EXPENSE_BACK_END_URL + 'expense-estimator/' + id);
  }

  updateExpenseEstimate(
    id: string,
    description: string,
    expenseType: string,
    amount: number
  ) {
    const expenseEstimateData: ExpenseEstimate = {
      id: id,
      description: description,
      expenseType: expenseType,
      amount: amount,
      createdById: ''
    };
    this.http
      .patch<{ message: string }>(
        EXPENSE_BACK_END_URL + 'update-expense-estimator/' + id,
        expenseEstimateData
      )
      .subscribe(
        () => {
          this.router.navigate(['/expense-estimator']);
        },
        error => {
          console.log(error);
          this.expenseEstimatorStatusListener.next(true);
        }
      );
  }

  deleteExpenseEstimate(id: string) {
    this.http
      .delete<{ message: string }>(
        EXPENSE_BACK_END_URL + 'expense-estimator/' + id
      )
      .subscribe(
        () => {
          this.router.navigate(['/expense-estimator']);
        },
        error => {
          console.log(error);
          this.expenseEstimatorStatusListener.next(true);
        }
      );
  }

  createSalary(salaryType: string, amount: number, createdById: string) {
    const salaryData: Salary = {
      id: '',
      salaryType: salaryType,
      amount: amount,
      createdById: createdById
    };
    this.http
      .post<{ message: string }>(EXPENSE_BACK_END_URL + 'salary', salaryData)
      .subscribe(
        () => {
          this.router.navigate(['/expense-estimator']);
        },
        error => {
          console.log(error);
          this.expenseEstimatorStatusListener.next(true);
        }
      );
  }

  getSalary(id: string) {
    return this.http.get<{
      _id: string;
      salaryType: string;
      amount: number;
      createdBy: string;
    }>(EXPENSE_BACK_END_URL + 'salary/' + id);
  }

  getSalaryByOwner(createdById: string) {
    return this.http.get<{
      salaryId: string;
      monthlySalaryAmount: string;
    }>(EXPENSE_BACK_END_URL + 'salaryByOwner/' + createdById);
  }

  updateSalary(id: string, salaryType: string, amount: number) {
    const expenseData: Salary = {
      id: id,
      salaryType: salaryType,
      amount: amount,
      createdById: ''
    };
    this.http
      .patch<{ message: string }>(
        EXPENSE_BACK_END_URL + 'salary/' + id,
        expenseData
      )
      .subscribe(
        () => {
          this.router.navigate(['/expense-estimator']);
        },
        error => {
          console.log(error);
          this.expenseEstimatorStatusListener.next(true);
        }
      );
  }
}
