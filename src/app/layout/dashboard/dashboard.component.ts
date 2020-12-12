import { Component, OnInit } from '@angular/core';
import { routerTransition } from '../../router.animations';
import { AuthService } from 'src/app/auth/auth.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DashboardService } from './dashboard.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  animations: [routerTransition()],
})
export class DashboardComponent implements OnInit {
  form: FormGroup;
  selectedDate: String;
  monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  dashboardData: Array<{
    expenseType: string;
    actualAmount: number;
    budgetAmount: number;
    difference: number;
  }>;

  monthIncome: number;
  monthExpense: number;
  annualIncome: number;
  annualExpense: number;
  currentBalance: number;
  availableMoney: number;
  delta: number;

  private expenseTypes: string[];
  private actualExpenses: number[];
  private budgetExpenses: number[];

  constructor(
    private dashboardService: DashboardService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.form = new FormGroup({
      date: new FormControl(null, { validators: [Validators.required] }),
    });
    this.form.setValue({
      date: this.getCurrentDate(),
    });
    this.form.valueChanges.subscribe(() => {
      this.retrieveData();
    });
    this.retrieveData();
  }

  retrieveData() {
    this.retrieveMonthSummaryBalances();
    this.retrieveSummaryBalances();
    this.retrieveDetailedMonthlyData();
  }

  getCurrentDate() {
    let date = new Date();
    return {
      day: date.getUTCDate(),
      month: date.getUTCMonth() + 1,
      year: date.getUTCFullYear(),
    };
  }

  formatDate(date: Date) {
    return this.monthNames[date.getMonth()] + ' ' + date.getFullYear();
  }

  retrieveSummaryBalances() {
    this.dashboardService
      .getSummaryBalancesByOwner(
        this.getSelectedDate(),
        this.authService.getUserId()
      )
      .subscribe((summary) => {
        this.annualIncome = summary.annualIncome;
        this.annualExpense = summary.annualExpense;
        this.currentBalance = summary.currentBalance;
        this.availableMoney = summary.availableMoney;
        this.delta = summary.delta;
      });
  }

  retrieveMonthSummaryBalances() {
    this.dashboardService
      .getMonthSummaryBalancesByOwner(
        this.getSelectedDate(),
        this.authService.getUserId()
      )
      .subscribe((summary) => {
        this.monthIncome = summary.monthIncome;
        this.monthExpense = summary.monthExpense;
      });
  }

  retrieveDetailedMonthlyData() {
    const date = this.getSelectedDate();
    this.selectedDate = this.formatDate(date);
    this.dashboardService
      .getDashboardDetailedInfo(date, this.authService.getUserId())
      .subscribe((dashboardInfo) => {
        this.dashboardData = dashboardInfo.dashboardInfo;
        this.loadExpenseData();
      });
  }

  loadExpenseData() {
    this.expenseTypes = [];
    this.actualExpenses = [];
    this.budgetExpenses = [];
    for (let expenseData of this.dashboardData) {
      this.expenseTypes.push(this.makeEnumPretty(expenseData.expenseType));
      this.actualExpenses.push(expenseData.actualAmount);
      this.budgetExpenses.push(expenseData.budgetAmount);
    }
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

  makeEnumPretty(value: string): string {
    return value
      .toLowerCase()
      .split('_')
      .map(function (word) {
        return word.replace(word[0], word[0].toUpperCase());
      })
      .join('-');
  }

  getSelectedDate() {
    let dateValue = this.form.value.date;
    return new Date(dateValue.year, dateValue.month - 1, dateValue.day);
  }
}
