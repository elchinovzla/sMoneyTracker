import { environment } from 'src/environments/environment';
import { Injectable } from '@angular/core';
import { ExpenseEstimate } from './expense-estimate.model';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';

const EXPENSE_ESTIMATOR_BACK_END_URL =
  environment.apiUrl + '/expense-estimator/';

@Injectable({ providedIn: 'root' })
export class ExpenseEstimatorService {
  private expenseEstimates: ExpenseEstimate[] = [];
  private expenseEstimatorUpdated = new Subject<{
    expenseEstimates: ExpenseEstimate[];
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
      createdById: createdById,
    };
    this.http
      .post<{ message: string }>(
        EXPENSE_ESTIMATOR_BACK_END_URL + 'expense-estimator',
        expenseEstimateData
      )
      .subscribe(
        () => {
          this.router.navigate(['/expense-estimator']);
        },
        (error) => {
          console.log(error);
          this.expenseEstimatorStatusListener.next(true);
        }
      );
  }

  getExpenseEstimate(id: string) {
    return this.http.get<{
      _id: string;
      description: string;
      expenseType: string;
      amount: number;
      createdBy: string;
    }>(EXPENSE_ESTIMATOR_BACK_END_URL + 'expense-estimator/' + id);
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
      createdById: '',
    };
    this.http
      .patch<{ message: string }>(
        EXPENSE_ESTIMATOR_BACK_END_URL + 'update-expense-estimator/' + id,
        expenseEstimateData
      )
      .subscribe(
        () => {
          this.router.navigate(['/expense-estimator']);
        },
        (error) => {
          console.log(error);
          this.expenseEstimatorStatusListener.next(true);
        }
      );
  }

  deleteExpenseEstimate(id: string) {
    this.http
      .delete<{ message: string }>(
        EXPENSE_ESTIMATOR_BACK_END_URL + 'expense-estimator/' + id
      )
      .subscribe(
        () => {
          this.router.navigate(['/expense-estimator']);
        },
        (error) => {
          console.log(error);
          this.expenseEstimatorStatusListener.next(true);
        }
      );
  }

  getExpectedExpenseAmountsByOwner(createdById: string) {
    return this.http.get<{
      salaryId: string;
      monthlySalaryAmount: number;
      monthlyTotalExpectedExpenseAmount: number;
      monthlyTotalEstimatedSpareAmount: number;
      budgetDineOutAmount: number;
      budgetGiftAmount: number;
      budgetGroceryAmount: number;
      budgetHouseAmount: number;
      budgetMembershipAmount: number;
      budgetOtherAmount: number;
      budgetTransportationAmount: number;
      budgetTravelAmount: number;
    }>(
      EXPENSE_ESTIMATOR_BACK_END_URL +
        'expense-estimator-detailedByOwner/' +
        createdById
    );
  }

  getExpenseEstimatorTotalCount(createdById: string, expenseType: string) {
    const queryParams =
      `?createdById=${createdById}` + `&expenseType=${expenseType}`;

    return this.http.get<{ totalCount: number }>(
      EXPENSE_ESTIMATOR_BACK_END_URL + 'expense-estimator-count' + queryParams
    );
  }

  getEstimatedExpenses(
    expensesPerPage: number,
    currentPage: number,
    createdById: string,
    expenseType: string
  ) {
    const queryParams =
      `?pageSize=${expensesPerPage}` +
      `&page=${currentPage}` +
      `&createdById=${createdById}` +
      `&expenseType=${expenseType}`;

    this.http
      .get<{ message: string; estimatedExpense: any }>(
        EXPENSE_ESTIMATOR_BACK_END_URL + 'expense-estimator' + queryParams
      )
      .pipe(
        map((expenseEstimatorData) => {
          return {
            estimatedExpense: expenseEstimatorData.estimatedExpense.map(
              (estimatedExpense) => {
                return {
                  id: estimatedExpense._id,
                  description: estimatedExpense.description,
                  expenseType: estimatedExpense.expenseType,
                  amount: estimatedExpense.amount,
                  createdById: estimatedExpense.createdById,
                };
              }
            ),
          };
        })
      )
      .subscribe((transformedExpenseEstimatorData) => {
        this.expenseEstimates =
          transformedExpenseEstimatorData.estimatedExpense;
        this.expenseEstimatorUpdated.next({
          expenseEstimates: [...this.expenseEstimates],
        });
      });
  }
}
