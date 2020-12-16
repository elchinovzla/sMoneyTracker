import { environment } from 'src/environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Report } from './report.model';

const REPORT_BACK_END_URL = environment.apiUrl + '/report/';

@Injectable({ providedIn: 'root' })
export class ReportService {
  constructor(private http: HttpClient) {}

  getAllExpensesReport(
    createdById: string,
    startDate: Date,
    endDate: Date,
    keyword: string
  ) {
    // const queryParams =
    //   `?startDate=${startDate}` +
    //   `&endDate=${endDate}` +
    //   `&keyword=${keyword}` +
    //   `&createdById=${createdById}`;
    // this.http.get<{ message: string; reportData: Report }>(
    //   REPORT_BACK_END_URL + 'allExpenses' + queryParams
    // );
  }

  getAllIncomesReport(
    createdById: string,
    startDate: Date,
    endDate: Date,
    keyword: string
  ) {
    // const queryParams =
    //   `?startDate=${startDate}` +
    //   `&endDate=${endDate}` +
    //   `&keyword=${keyword}` +
    //   `&createdById=${createdById}`;
    // this.http.get<{ message: string; reportData: Report }>(
    //   REPORT_BACK_END_URL + 'allIncomes' + queryParams
    // );
  }

  getAllSummaryReport(createdById: string, startDate: Date, endDate: Date) {
    // const queryParams =
    //   `?startDate=${startDate}` +
    //   `&endDate=${endDate}` +
    //   `&createdById=${createdById}`;
    // this.http.get<{ message: string; reportData: Report }>(
    //   REPORT_BACK_END_URL + 'summary' + queryParams
    // );
  }

  getTestingData(): Report {
    return {
      totalIncome: 150000,
      totalOutcome: 155000,
      activities: [
        {
          date: new Date(),
          transactions: [
            {
              id: 1,
              transactionDescription: 'testing',
              transactionAmount: 150000,
              transactionType: 'INCOME',
            },
            {
              id: 2,
              transactionDescription: 'testing outcome',
              transactionAmount: 155000,
              transactionType: 'OUTCOME',
            },
          ],
        },
      ],
    };
  }
}
