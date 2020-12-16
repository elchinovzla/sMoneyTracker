import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { routerTransition } from 'src/app/router.animations';
import { AuthService } from 'src/app/auth/auth.service';
import { ReportService } from './report.service';
import * as jsPDF from 'jspdf';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss'],
  animations: [routerTransition()],
})
export class ReportComponent implements OnInit {
  @ViewChild('htmlData') htmlData: ElementRef;

  constructor(
    public reportService: ReportService,
    public authService: AuthService
  ) {}

  ngOnInit() {}

  openCreateTestReport() {
    let DATA = this.htmlData.nativeElement;
    let doc = new jsPDF('p', 'pt', 'letter');

    let handleElement = {
      '#editor': function (element, renderer) {
        return true;
      },
    };
    doc.fromHTML(DATA.innerHTML, 15, 15, {
      width: 200,
      elementHandlers: handleElement,
    });

    doc.save('angular-demo.pdf');
  }
}
