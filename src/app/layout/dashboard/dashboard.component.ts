import { Component, OnInit } from '@angular/core';
import { routerTransition } from '../../router.animations';
import { ExpenseService } from '../expense/expense.service';
import { AuthService } from 'src/app/auth/auth.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  animations: [routerTransition()]
})
export class DashboardComponent implements OnInit {
  form: FormGroup;
  selectedDate: String;
  monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];

  barChartOptions: any = {
    scaleShowVerticalLines: false,
    responsive: true
  };
  barChartLabels: string[];
  barChartType = 'bar';
  barChartLegend = true;
  barChartData: Array<{ data: number[], label: string }>;

  pieChartLabels: string[];
  pieChartData: number[];
  pieChartType = 'pie';

  dashboardData: Array<{
    expenseType: string,
    actualAmount: number,
    budgetAmount: number,
    difference: number
  }>;

  public chartColors: any[] = [{
    backgroundColor: [
      '#7B241C',
      '#884EA0',
      '#1F618D',
      '#48C9B0',
      '#D4AC0D',
      '#717D7E',
      '#2E4053',
      '#145A32']
  }];

  private expenseTypes: string[];
  private actualExpenses: number[];
  private budgetExpenses: number[];

  constructor(private expenseService: ExpenseService, private authService: AuthService) { }

  ngOnInit() {
    this.initializeGraphData();
    this.form = new FormGroup({
      date: new FormControl(null, { validators: [Validators.required] })
    });
    this.form.setValue({
      date: this.getCurrentDate()
    });
    this.form.valueChanges.subscribe(() => {
      this.retrieveDashboardData();
    });
    this.retrieveDashboardData();
  };

  getCurrentDate() {
    let date = new Date();
    return {
      day: date.getUTCDate(),
      month: date.getUTCMonth() + 1,
      year: date.getUTCFullYear()
    };
  };

  formatDate(date: Date) {
    return this.monthNames[date.getMonth()] + ' ' + date.getFullYear();
  };

  retrieveDashboardData() {
    let dateValue = this.form.value.date;
    let date = new Date(dateValue.year, dateValue.month - 1, dateValue.day);
    this.selectedDate = this.formatDate(date);
    this.expenseService
      .getDashboardInfo(date, this.authService.getUserId())
      .subscribe(dashboardInfo => {
        this.dashboardData = dashboardInfo.dashboardInfo;
        this.loadExpenseData();
      });
  };

  loadExpenseData() {
    this.expenseTypes = [];
    this.actualExpenses = [];
    this.budgetExpenses = [];
    for (let expenseData of this.dashboardData) {
      this.expenseTypes.push(this.makeEnumPretty(expenseData.expenseType));
      this.actualExpenses.push(expenseData.actualAmount);
      this.budgetExpenses.push(expenseData.budgetAmount);
    }
    this.loadGraphData();
  };

  initializeGraphData() {
    this.barChartLabels = [''];
    this.barChartData = [{ data: [0], label: '' }];
    this.pieChartLabels = [''];
    this.pieChartData = [0];
    this.dashboardData = [];
  }

  loadGraphData() {
    this.pieChartLabels = this.expenseTypes;
    this.pieChartData = this.actualExpenses;

    this.barChartLabels = this.expenseTypes;
    this.barChartData = [];
    this.barChartData.push({ data: this.actualExpenses, label: 'Actual' });
    this.barChartData.push({ data: this.budgetExpenses, label: 'Budget' })
  };

  convertToMoney(amount: Number) {
    return '$' + amount.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
  };

  makeEnumPretty(value: string): string {
    return value
      .toLowerCase()
      .split('_')
      .map(function (word) {
        return word.replace(word[0], word[0].toUpperCase());
      })
      .join('-');
  };
}
