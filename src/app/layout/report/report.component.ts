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
import * as jspdf from 'jspdf';
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

  form: FormGroup;
  reportTypes = ReportType;
  keys = [];
  report: Report;
  private authStatusSub: Subscription;
  userName: string;

  constructor(
    public reportService: ReportService,
    public authService: AuthService
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
    let response = await this.reportService
      .getTestingData(
        this.authService.getUserId(),
        this.form.value.fromDate,
        this.form.value.toDate
      )
      .toPromise();
    this.report = response.reportData;
    await this.waitForHtmlToBeReady();
    this.createPDF();
  }

  async waitForHtmlToBeReady() {
    if (!this.reportSummary || !this.reportData) {
      await delay(100); //wait until the html is updated
      this.waitForHtmlToBeReady();
    }
  }

  createPDF() {
    const SUMMARY_DATA = this.reportSummary.nativeElement;
    const REPORT_DATA = this.reportData.nativeElement;

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
      width: 200,
      elementHandlers: handleElement,
    });
    pdf.save('let.pdf');
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
