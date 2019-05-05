import { Component, OnInit, ViewChild } from '@angular/core';
import { routerTransition } from 'src/app/router.animations';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from 'src/app/auth/auth.service';
import { IncomeService } from './income.service';
import { IncomeCreateComponent } from './income-create/income-create.component';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { IncomeListComponent } from './income-list/income-list.component';

@Component({
  selector: 'app-income',
  templateUrl: './income.component.html',
  styleUrls: ['./income.component.scss'],
  animations: [routerTransition()]
})
export class IncomeComponent implements OnInit {
  @ViewChild(IncomeListComponent) private incomeList: IncomeListComponent;
  monthlyIncome: String;
  annualIncome: String;
  selectedDate: String;
  form: FormGroup;
  monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];

  constructor(
    private modalService: NgbModal,
    private incomeService: IncomeService,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.form = new FormGroup({
      date: new FormControl(null, { validators: [Validators.required] })
    });
    this.form.setValue({
      date: this.getCurrentDate()
    });
    this.form.valueChanges.subscribe(() => {
      this.updateEarningsInfo();
    });
    this.updateEarningsInfo();
  }

  openCreateIncome() {
    this.modalService.open(IncomeCreateComponent, { centered: true });
  }

  convertToMoney(amount: Number): string {
    return '$' + amount.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
  }

  getCurrentDate() {
    let date = new Date();
    return {
      day: date.getUTCDate(),
      month: date.getUTCMonth() + 1,
      year: date.getUTCFullYear()
    };
  }

  formatDate(date: Date) {
    return this.monthNames[date.getMonth()] + ' ' + date.getFullYear();
  }

  updateEarningsInfo() {
    let dateValue = this.form.value.date;
    let date = new Date(dateValue.year, dateValue.month - 1, dateValue.day);
    this.selectedDate = this.formatDate(date);
    this.incomeService
      .getMonthlyTotalIncome(date, this.authService.getUserId())
      .subscribe(total => {
        this.monthlyIncome = this.convertToMoney(total.monthlyIncome);
      });
    this.incomeService
      .getAnnualTotalIncome(date, this.authService.getUserId())
      .subscribe(total => {
        this.annualIncome = this.convertToMoney(total.annualIncome);
      });
    this.incomeList.loadIncomeList(date);
  }
}
