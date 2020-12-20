import { environment } from 'src/environments/environment';
import { ElementRef, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Report } from './report.model';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import * as jspdf from 'jspdf';

const EXCEL_EXTENSION = '.xlsx';
const REPORT_BACK_END_URL = environment.apiUrl + '/report/';

@Injectable({ providedIn: 'root' })
export class ReportService {
  constructor(private http: HttpClient) {}

  getAllExpensesReport(createdById: string, startDate: Date, endDate: Date) {
    let queryParams =
      `?startDate=${startDate.toDateString()}` +
      `&endDate=${endDate.toDateString()}` +
      `&createdById=${createdById}`;

    console.log(REPORT_BACK_END_URL + 'only-expense' + queryParams);

    return this.http.get<{ message: string; reportData: Report }>(
      REPORT_BACK_END_URL + 'only-expense' + queryParams
    );
  }

  getAllExpensesReportWithKeyword(
    createdById: string,
    startDate: Date,
    endDate: Date,
    keyword: string
  ) {
    let queryParams =
      `?startDate=${startDate.toDateString()}` +
      `&endDate=${endDate.toDateString()}` +
      `&keyword=${keyword}` +
      `&createdById=${createdById}`;

    console.log(REPORT_BACK_END_URL + 'only-expense' + queryParams);

    return this.http.get<{ message: string; reportData: Report }>(
      REPORT_BACK_END_URL + 'only-expense' + queryParams
    );
  }

  getAllIncomesReport(createdById: string, startDate: Date, endDate: Date) {
    const queryParams =
      `?startDate=${startDate.toDateString()}` +
      `&endDate=${endDate.toDateString()}` +
      `&createdById=${createdById}`;

    return this.http.get<{ message: string; reportData: Report }>(
      REPORT_BACK_END_URL + 'only-income' + queryParams
    );
  }

  getAllIncomesReportWithKeyword(
    createdById: string,
    startDate: Date,
    endDate: Date,
    keyword: string
  ) {
    const queryParams =
      `?startDate=${startDate.toDateString()}` +
      `&endDate=${endDate.toDateString()}` +
      `&keyword=${keyword}` +
      `&createdById=${createdById}`;

    return this.http.get<{ message: string; reportData: Report }>(
      REPORT_BACK_END_URL + 'only-income' + queryParams
    );
  }

  getSummaryReport(createdById: string, startDate: Date, endDate: Date) {
    const queryParams =
      `?startDate=${startDate.toDateString()}` +
      `&endDate=${endDate.toDateString()}` +
      `&createdById=${createdById}`;
    return this.http.get<{ message: string; reportData: Report }>(
      REPORT_BACK_END_URL + 'summary' + queryParams
    );
  }

  exportTableElmToExcel(element: ElementRef, fileName: string): void {
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element.nativeElement);
    // generate workbook and add the worksheet
    const workbook: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, ws, 'Sheet1');
    // save to file
    XLSX.writeFile(workbook, `${fileName}${EXCEL_EXTENSION}`);
  }

  createPDF(
    reportSummary: ElementRef,
    reportData: ElementRef,
    fileName: string
  ): void {
    const SUMMARY_DATA = reportSummary.nativeElement;
    const REPORT_DATA = reportData.nativeElement;

    const handleElement = {
      '#editor': function () {
        return true;
      },
    };

    const LOGO = new Image();
    LOGO.src = 'assets/logo/main-logo.png';
    const pdf = new jspdf('p', 'mm', 'letter');

    pdf.addImage(LOGO, 'png', 150, 15, 50, 20);
    pdf.fromHTML(SUMMARY_DATA.innerHTML, 15, 15, {
      width: 200,
      elementHandlers: handleElement,
    });
    pdf.addPage();
    pdf.fromHTML(REPORT_DATA.innerHTML, 15, 15, {
      width: 300,
      elementHandlers: handleElement,
    });
    pdf.save(fileName + '.pdf');
  }
}
