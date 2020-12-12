import { environment } from 'src/environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

const DASHBOARD_BACK_END_URL = environment.apiUrl + '/dashboard/';

@Injectable({ providedIn: 'root' })
export class DashboardService {
  constructor(private http: HttpClient) {}

  getSummaryBalancesByOwner(selectedDate: Date, createdById: string) {
    const queryParams = `?date=${selectedDate}` + `&createdById=${createdById}`;

    return this.http.get<{
      annualIncome: number;
      annualExpense: number;
      currentBalance: number;
      availableMoney: number;
      delta: number;
    }>(DASHBOARD_BACK_END_URL + 'summaryBalancesByOwner' + queryParams);
  }

  getMonthSummaryBalancesByOwner(selectedDate: Date, createdById: string) {
    const queryParams = `?date=${selectedDate}` + `&createdById=${createdById}`;

    return this.http.get<{
      monthIncome: number;
      monthExpense: number;
    }>(DASHBOARD_BACK_END_URL + 'monthSummaryBalancesByOwner' + queryParams);
  }

  getDashboardDetailedInfo(date: Date, createdById: string) {
    const queryParams =
      `?createdById=${createdById}` + `&date=${date.toDateString()}`;
    return this.http
      .get<{ message: string; dashboardData: any }>(
        DASHBOARD_BACK_END_URL + 'detailed-monthly-info' + queryParams
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
}
