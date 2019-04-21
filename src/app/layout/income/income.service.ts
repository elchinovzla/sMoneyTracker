import { environment } from 'src/environments/environment';
import { Injectable } from '@angular/core';
import { Income } from './income.model';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';

const INCOME_BACK_END_URL = environment.apiUrl + '/income/';

@Injectable({ providedIn: 'root' })
export class IncomeService {
  private incomes: Income[] = [];
  private incomeUpdated = new Subject<{
    incomes: Income[];
  }>();
  private incomeStatusListener = new Subject<boolean>();

  constructor(private http: HttpClient, private router: Router) { }

  getIncomeUpdateListener() {
    return this.incomeUpdated.asObservable();
  }

  getIncomeStatusListener() {
    return this.incomeStatusListener.asObservable();
  }

  createIncome(
    name: string,
    amount: number,
    date: Date,
    note: string,
    createdById: string
  ) {
    const incomeData: Income = {
      id: '',
      name: name,
      amount: amount,
      date: date,
      note: note,
      createdById: createdById
    };
    this.http
      .post<{ message: string }>(INCOME_BACK_END_URL + 'income',
        incomeData)
      .subscribe(
        () => {
          this.router.navigate(['/income']);
        },
        error => {
          console.log(error);
          this.incomeStatusListener.next(true);
        }
      );
  }

  getIncomes(incomesPerPage: number, currentPage: number, createdById: string, date: Date) {
    const queryParams = `?pagesize=${incomesPerPage}&page=${currentPage}&createdById=${createdById}&date=${date.toDateString()}`;
    this.http
      .get<{ message: string; incomes: any }>(
        INCOME_BACK_END_URL + 'income' + queryParams
      )
      .pipe(
        map(incomeData => {
          return {
            incomes: incomeData.incomes.map(
              income => {
                return {
                  id: income._id,
                  name: income.name,
                  amount: income.amount,
                  date: income.date,
                  note: income.note,
                  createdById: income.createdById
                };
              })
          };
        })
      )
      .subscribe(transformedIncomeData => {
        this.incomes = transformedIncomeData.incomes;
        this.incomeUpdated.next({
          incomes: [...this.incomes]
        });
      });
  }

  getIncomeTotalCount(createdById: string, date: Date) {
    const queryParams = `?createdById=${createdById}&date=${date.toDateString()}`;
    return this.http.get<{ maxIncomes: number }>(
      INCOME_BACK_END_URL + 'income-count' + queryParams
    );
  }

  getIncome(id: string) {
    return this.http.get<{
      _id: string;
      name: string;
      amount: number;
      date: Date;
      note: string;
      createdById: string;
    }>(INCOME_BACK_END_URL + 'income/' + id);
  }

  updateIncome(
    id: string,
    name: string,
    amount: number,
    date: Date,
    note: string
  ) {
    const incomeData: Income = {
      id: id,
      name: name,
      amount: amount,
      date: date,
      note: note,
      createdById: ''
    };
    this.http
      .patch<{ message: string }>(
        INCOME_BACK_END_URL + 'income/' + id,
        incomeData
      )
      .subscribe(
        () => {
          this.router.navigate(['/income']);
        },
        error => {
          console.log(error);
          this.incomeStatusListener.next(true);
        }
      );
  }

  deleteIncome(id: string) {
    this.http.delete<{ message: string }>(INCOME_BACK_END_URL + 'income/' + id)
      .subscribe(
        () => {
          this.router.navigate(['/income']);
        },
        error => {
          console.log(error);
          this.incomeStatusListener.next(true);
        }
      );
  }

  getMonthlyTotalIncome(date: Date, createdById: string) {
    const queryParams = `?createdById=${createdById}&date=${date.toDateString()}`;
    return this.http.get<{ monthlyIncome: number }>(
      INCOME_BACK_END_URL + 'monthly-total' + queryParams
    )
  }

  getAnnualTotalIncome(date: Date, createdById: string) {
    const queryParams = `?createdById=${createdById}&date=${date.toDateString()}`;
    return this.http.get<{ annualIncome: number }>(
      INCOME_BACK_END_URL + 'annual-total' + queryParams
    )
  }
}
