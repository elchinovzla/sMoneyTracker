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
    const queryParams =
      `?startDate=${startDate}` +
      `&endDate=${endDate}` +
      `&keyword=${keyword}` +
      `&createdById=${createdById}`;
    return this.http.get<{ message: string; reportData: Report }>(
      REPORT_BACK_END_URL + 'only-expense' + queryParams
    );
  }

  getAllIncomesReport(
    createdById: string,
    startDate: Date,
    endDate: Date,
    keyword: string
  ) {
    const queryParams =
      `?startDate=${startDate}` +
      `&endDate=${endDate}` +
      `&keyword=${keyword}` +
      `&createdById=${createdById}`;
    return this.http.get<{ message: string; reportData: Report }>(
      REPORT_BACK_END_URL + 'only-income' + queryParams
    );
  }

  getAllSummaryReport(createdById: string, startDate: Date, endDate: Date) {
    const queryParams =
      `?startDate=${startDate}` +
      `&endDate=${endDate}` +
      `&createdById=${createdById}`;
    return this.http.get<{ message: string; reportData: Report }>(
      REPORT_BACK_END_URL + 'summary' + queryParams
    );
  }

  getTestingData(createdById: string, startDate: Date, endDate: Date) {
    const queryParams =
      `?startDate=${startDate}` +
      `&endDate=${endDate}` +
      `&createdById=${createdById}`;

    return this.http.get<{ message: string; reportData: Report }>(
      REPORT_BACK_END_URL + 'testing' + queryParams
    );
  }
}
