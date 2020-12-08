import { environment } from 'src/environments/environment';
import { Injectable } from '@angular/core';
import { Expense } from './expense.model';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';

const EXPENSE_BACK_END_URL = environment.apiUrl + '/expense/';

@Injectable({ providedIn: 'root' })
export class ExpenseService {
  private expenses: Expense[] = [];
  private expenseUpdated = new Subject<{
    expenses: Expense[];
  }>();
  private expenseStatusListener = new Subject<boolean>();

  constructor(private http: HttpClient, private router: Router) {}

  getExpenseUpdateListener() {
    return this.expenseUpdated.asObservable();
  }

  getExpenseStatusListener() {
    return this.expenseStatusListener.asObservable();
  }

  createExpense(
    description: string,
    expenseType: string,
    amount: number,
    date: Date,
    savingsId: string,
    note: string,
    createdById: string
  ) {
    const expenseData: Expense = {
      id: '',
      description: description,
      expenseType: expenseType,
      amount: amount,
      date: date,
      savingsId: savingsId,
      note: note,
      createdById: createdById,
    };
    this.http
      .post<{ message: string }>(EXPENSE_BACK_END_URL + 'expense', expenseData)
      .subscribe(
        () => {
          this.router.navigate(['/expense']);
        },
        (error) => {
          console.log(error);
          this.expenseStatusListener.next(true);
        }
      );
  }

  getExpenses(
    expensesPerPage: number,
    currentPage: number,
    createdById: string,
    expenseType: string,
    date: Date
  ) {
    const queryParams =
      `?pageSize=${expensesPerPage}` +
      `&page=${currentPage}` +
      `&createdById=${createdById}` +
      `&expenseType=${expenseType}` +
      `&date=${date.toDateString()}`;
    this.http
      .get<{ message: string; expenses: any }>(
        EXPENSE_BACK_END_URL + 'expense' + queryParams
      )
      .pipe(
        map((expenseData) => {
          return {
            expenses: expenseData.expenses.map((expense) => {
              return {
                id: expense._id,
                description: expense.description,
                expenseType: expense.expenseType,
                amount: expense.amount,
                date: expense.date,
                savingsId: expense.savingsId,
                note: expense.note,
                createdById: expense.createdById,
              };
            }),
          };
        })
      )
      .subscribe((transformedExpenseData) => {
        this.expenses = transformedExpenseData.expenses;
        this.expenseUpdated.next({
          expenses: [...this.expenses],
        });
      });
  }

  getExpenseById(id: string) {
    return this.http.get<{
      _id: string;
      description: string;
      expenseType: string;
      amount: number;
      date: Date;
      savingsId: string;
      note: string;
      createdById: string;
    }>(EXPENSE_BACK_END_URL + 'expense/' + id);
  }

  getExpenseTotalCount(createdById: string, expenseType: string, date: Date) {
    const queryParams =
      `?createdById=${createdById}` +
      `&expenseType=${expenseType}` +
      `&date=${date.toDateString()}`;
    return this.http.get<{ totalCount: number }>(
      EXPENSE_BACK_END_URL + 'expense-count' + queryParams
    );
  }

  getMonthlyExpenseInfo(date: Date, createdById: string) {
    const queryParams = `?createdById=${createdById}&date=${date.toDateString()}`;
    return this.http.get<{
      totalExpenseAmount: number;
      totalExpenseDineOutAmount: number;
      totalExpenseGiftAmount: number;
      totalExpenseGroceryAmount: number;
      totalExpenseHouseAmount: number;
      totalExpenseMembershipAmount: number;
      totalExpenseOtherAmount: number;
      totalExpenseTransportationAmount: number;
      totalExpenseTravelAmount: number;
    }>(EXPENSE_BACK_END_URL + 'monthly-infoByOwnerId' + queryParams);
  }

  getAnnualExpenseInfo(date: Date, createdById: string) {
    const queryParams = `?createdById=${createdById}&date=${date.toDateString()}`;
    return this.http.get<{
      totalExpenseAmount: number;
      totalExpenseDineOutAmount: number;
      totalExpenseGiftAmount: number;
      totalExpenseGroceryAmount: number;
      totalExpenseHouseAmount: number;
      totalExpenseMembershipAmount: number;
      totalExpenseOtherAmount: number;
      totalExpenseTransportationAmount: number;
      totalExpenseTravelAmount: number;
    }>(EXPENSE_BACK_END_URL + 'annual-infoByOwnerId' + queryParams);
  }

  getDashboardInfo(date: Date, createdById: string) {
    const queryParams =
      `?createdById=${createdById}` + `&date=${date.toDateString()}`;
    return this.http
      .get<{ message: string; dashboardData: any }>(
        EXPENSE_BACK_END_URL + 'expense-dashboard' + queryParams
      )
      .pipe(
        map((dashboardData) => {
          return {
            dashboardInfo: dashboardData.dashboardData.map((entry) => {
              return {
                expenseType: entry.expenseType,
                actualAmount: entry.actualAmount,
                budgetAmount: entry.budgetAmount,
                difference: entry.difference,
              };
            }),
          };
        })
      );
  }

  updateExpense(
    id: string,
    description: string,
    expenseType: string,
    amount: number,
    date: Date,
    savingsId: string,
    note: string
  ) {
    const expenseData: Expense = {
      id: id,
      description: description,
      expenseType: expenseType,
      amount: amount,
      date: date,
      savingsId: savingsId,
      note: note,
      createdById: '',
    };
    this.http
      .patch<{ message: string }>(EXPENSE_BACK_END_URL + 'expense', expenseData)
      .subscribe(
        () => {
          this.router.navigate(['/expense']);
        },
        (error) => {
          console.log(error);
          this.expenseStatusListener.next(true);
        }
      );
  }

  deleteExpense(id: string) {
    this.http
      .delete<{ message: string }>(EXPENSE_BACK_END_URL + 'expense/' + id)
      .subscribe(
        () => {
          this.router.navigate(['/expense']);
        },
        (error) => {
          console.log(error);
          this.expenseStatusListener.next(true);
        }
      );
  }
}
