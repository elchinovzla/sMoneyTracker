import { environment } from 'src/environments/environment';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { YearlyBalance } from './yearly-balance.model';

const YEARLY_BALANCE_BACK_END_URL = environment.apiUrl + '/yearly-balance/';

@Injectable({ providedIn: 'root' })
export class YearlyBalanceService {
  private yearlyBalanceEntries: YearlyBalance[] = [];
  private yearlyBalanceUpdated = new Subject<{
    yearlyBalanceEntries: YearlyBalance[];
  }>();
  private yearlyBalanceStatusListener = new Subject<boolean>();

  constructor(private http: HttpClient, private router: Router) {}

  getYearlyBalanceUpdateListener() {
    return this.yearlyBalanceUpdated.asObservable();
  }

  getYearlyBalanceStatusListener() {
    return this.yearlyBalanceStatusListener.asObservable();
  }

  createYearlyBalance(
    year: number,
    amount: number,
    note: string,
    createdById: string
  ) {
    const startDate = new Date(year, 0, 1);
    const endDate = new Date(year, 11, 31);
    const selectedYear = startDate.getFullYear();

    const yearlyBalanceData: YearlyBalance = {
      id: '',
      description: this.getDescription(selectedYear),
      startDate,
      endDate,
      amount,
      note,
      createdById,
    };
    this.http
      .post<{ message: string }>(
        YEARLY_BALANCE_BACK_END_URL + 'yearly-balance',
        yearlyBalanceData
      )
      .subscribe(
        () => {
          this.router.navigate(['/yearly-balance']);
        },
        (error) => {
          console.log(error);
          this.yearlyBalanceStatusListener.next(true);
        }
      );
  }

  getYearlyBalanceEntries(
    yearlyBalanceEntriesPerPage: number,
    currentPage: number,
    createdById: string
  ) {
    const queryParams = `?pageSize=${yearlyBalanceEntriesPerPage}&page=${currentPage}&createdById=${createdById}`;
    this.http
      .get<{ message: string; yearlyBalanceEntries: any }>(
        YEARLY_BALANCE_BACK_END_URL + 'yearly-balance' + queryParams
      )
      .pipe(
        map((yearlyBalanceData) => {
          return {
            yearlyBalanceEntries: yearlyBalanceData.yearlyBalanceEntries.map(
              (yearlyBalance) => {
                return {
                  id: yearlyBalance._id,
                  description: yearlyBalance.description,
                  startDate: yearlyBalance.startDate,
                  endDate: yearlyBalance.endDate,
                  amount: yearlyBalance.amount,
                  note: yearlyBalance.note,
                  createdById: yearlyBalance.createdById,
                };
              }
            ),
          };
        })
      )
      .subscribe((transformedYearlyBalanceData) => {
        this.yearlyBalanceEntries =
          transformedYearlyBalanceData.yearlyBalanceEntries;
        this.yearlyBalanceUpdated.next({
          yearlyBalanceEntries: [...this.yearlyBalanceEntries],
        });
      });
  }

  getYearlyBalanceTotalCount(createdById: string) {
    return this.http.get<{ yearlyBalanceTotalCount: number }>(
      YEARLY_BALANCE_BACK_END_URL + 'yearly-balance-count/' + createdById
    );
  }

  getYearlyBalanceById(id: string) {
    return this.http.get<{
      _id: string;
      description: string;
      startDate: Date;
      endDate: Date;
      amount: number;
      note: string;
      createdBy: string;
    }>(YEARLY_BALANCE_BACK_END_URL + 'yearly-balance/' + id);
  }

  updateYearlyBalance(id: string, year: number, amount: number, note: string) {
    const startDate = new Date(year, 0, 1);
    const endDate = new Date(year, 11, 31);
    const selectedYear = startDate.getFullYear();

    const yearlyBalanceData: YearlyBalance = {
      id,
      description: this.getDescription(selectedYear),
      startDate,
      endDate,
      amount,
      note,
      createdById: '',
    };

    this.http
      .patch<{ message: string }>(
        YEARLY_BALANCE_BACK_END_URL + 'update-yearly-balance/' + id,
        yearlyBalanceData
      )
      .subscribe(
        () => {
          this.router.navigate(['/yearly-balance']);
        },
        (error) => {
          console.log(error);
          this.yearlyBalanceStatusListener.next(true);
        }
      );
  }

  deleteYearBalance(id: string) {
    this.http
      .delete<{ message: string }>(
        YEARLY_BALANCE_BACK_END_URL + 'yearly-balance/' + id
      )
      .subscribe(
        () => {
          this.router.navigate(['/yearly-balance']);
        },
        (error) => {
          console.log(error);
          this.yearlyBalanceStatusListener.next(true);
        }
      );
  }

  getDescription(selectedYear: number): string {
    return 'Balance for ' + selectedYear;
  }
}
