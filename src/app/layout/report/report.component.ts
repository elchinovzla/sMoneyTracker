import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { routerTransition } from 'src/app/router.animations';
import { AuthService } from 'src/app/auth/auth.service';
import { ReportService } from './report.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ReportType } from './report-type';
import { Report } from './report.model';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss'],
  animations: [routerTransition()],
})
export class ReportComponent implements OnInit, OnDestroy {
  @ViewChild('reportSummary') reportSummary: ElementRef;
  @ViewChild('reportData') reportData: ElementRef;
  @ViewChild('transactionTable') transactionTable: ElementRef;

  form: FormGroup;
  reportTypes = ReportType;
  keys = [];
  report: Report;
  private authStatusSub: Subscription;
  userName: string;

  constructor(
    private reportService: ReportService,
    private authService: AuthService
  ) {
    this.keys = Object.keys(this.reportTypes).filter(Number);
  }

  ngOnInit() {
    this.authStatusSub = this.authService.getAuthStatusListener().subscribe();
    this.userName = this.authService.getUserName();
    this.validateInputs();
  }

  validateInputs() {
    this.form = new FormGroup({
      reportType: new FormControl(null, { validators: [Validators.required] }),
      fromDate: new FormControl(null, { validators: [Validators.required] }),
      toDate: new FormControl(null, {
        validators: [Validators.required],
      }),
      keyword: new FormControl(null),
    });
  }

  ngOnDestroy(): void {
    this.authStatusSub.unsubscribe();
  }

  createReport() {
    if (this.form.valid) {
      this.getReportData();
    }
  }

  async getReportData() {
    let response;
    switch (ReportType[this.form.value.reportType]) {
      case 'INCOME': {
        response = this.form.value.keyword
          ? await this.reportService
              .getAllIncomesReportWithKeyword(
                this.authService.getUserId(),
                getDate(this.form.value.fromDate),
                getDate(this.form.value.toDate),
                this.form.value.keyword
              )
              .toPromise()
          : await this.reportService
              .getAllIncomesReport(
                this.authService.getUserId(),
                getDate(this.form.value.fromDate),
                getDate(this.form.value.toDate)
              )
              .toPromise();
        break;
      }
      case 'EXPENSE': {
        response = this.form.value.keyword
          ? await this.reportService
              .getAllExpensesReportWithKeyword(
                this.authService.getUserId(),
                getDate(this.form.value.fromDate),
                getDate(this.form.value.toDate),
                this.form.value.keyword
              )
              .toPromise()
          : await this.reportService
              .getAllExpensesReport(
                this.authService.getUserId(),
                getDate(this.form.value.fromDate),
                getDate(this.form.value.toDate)
              )
              .toPromise();
        break;
      }
      case 'SUMMARY': {
        response = await this.reportService
          .getSummaryReport(
            this.authService.getUserId(),
            getDate(this.form.value.fromDate),
            getDate(this.form.value.toDate)
          )
          .toPromise();
        break;
      }
    }

    this.report = response.reportData;
    await this.waitForHtmlToBeReady();
    if (this.report.transactions.length > 0) {
      this.exportTransactionsToExcel();
    }
  }

  async waitForHtmlToBeReady() {
    if (!this.reportSummary || !this.reportData) {
      await delay(100); //wait until the html is updated
      this.waitForHtmlToBeReady();
    }
  }

  exportTransactionsToExcel() {
    const date = new Date();
    const formattedDate = '_' + date.toLocaleDateString().split('/').join('_');
    console.log(formattedDate);
    const fileName = ReportType[this.form.value.reportType] + formattedDate;
    this.reportService.exportTableElmToExcel(this.transactionTable, fileName);
  }

  makeEnumPretty(value: string): string {
    return value
      .toLowerCase()
      .split('_')
      .map(function (word) {
        return word.replace(word[0], word[0].toUpperCase());
      })
      .join('-');
  }

  convertToMoney(amount: number) {
    if (amount >= 0) {
      return '$' + amount.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
    }
    return (
      '($' +
      Math.abs(amount)
        .toFixed(2)
        .replace(/\d(?=(\d{3})+\.)/g, '$&,') +
      ')'
    );
  }
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function getDate(dateValue) {
  return new Date(dateValue.year, dateValue.month - 1, dateValue.day);
}
