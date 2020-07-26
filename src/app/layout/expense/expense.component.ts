import { Component, OnInit, ViewChild } from '@angular/core';
import { routerTransition } from 'src/app/router.animations';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from 'src/app/auth/auth.service';
import { ExpenseService } from './expense.service';
import { ExpenseCreateComponent } from './expense-create/expense-create.component';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ExpenseListComponent } from './expense-list/expense-list.component';

@Component({
  selector: 'app-expense',
  templateUrl: './expense.component.html',
  styleUrls: ['./expense.component.scss'],
  animations: [routerTransition()]
})
export class ExpenseComponent implements OnInit {
  @ViewChild('expenseList', {static: true, read:ExpenseListComponent}) expenseList: ExpenseListComponent;
  selectedDate: String;
  form: FormGroup;
  monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];
  totalMonthlyExpense: string;
  monthlyExpenseDineOut: string;
  monthlyExpenseGift: string;
  monthlyExpenseGrocery: string;
  monthlyExpenseHouse: string;
  monthlyExpenseMembership: string;
  monthlyExpenseOther: string;
  monthlyExpenseTransportation: string;
  monthlyExpenseTravel: string;
  displayMonthlyExpenseDetails: boolean;
  totalAnnualExpense: string;
  annualExpenseDineOut: string;
  annualExpenseGift: string;
  annualExpenseGrocery: string;
  annualExpenseHouse: string;
  annualExpenseMembership: string;
  annualExpenseOther: string;
  annualExpenseTransportation: string;
  annualExpenseTravel: string;
  displayAnnualExpenseDetails: boolean;

  constructor(
    private modalService: NgbModal,
    private expenseService: ExpenseService,
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
      this.updateExpenseInfo();
    });
    this.updateExpenseInfo();
  }

  openCreateExpense() {
    this.modalService.open(ExpenseCreateComponent, { centered: true });
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

  isValueAvailable(amount: String): boolean {
    return amount !== this.convertToMoney(0);
  }

  updateExpenseInfo() {
    let dateValue = this.form.value.date;
    let date = new Date(dateValue.year, dateValue.month - 1, dateValue.day);
    this.selectedDate = this.formatDate(date);
    this.expenseService
      .getMonthlyExpenseInfo(date, this.authService.getUserId())
      .subscribe(monthlyExpense => {
        this.totalMonthlyExpense = this.convertToMoney(monthlyExpense.totalExpenseAmount);
        this.monthlyExpenseDineOut = this.convertToMoney(monthlyExpense.totalExpenseDineOutAmount);
        this.monthlyExpenseGift = this.convertToMoney(monthlyExpense.totalExpenseGiftAmount);
        this.monthlyExpenseGrocery = this.convertToMoney(monthlyExpense.totalExpenseGroceryAmount);
        this.monthlyExpenseHouse = this.convertToMoney(monthlyExpense.totalExpenseHouseAmount);
        this.monthlyExpenseMembership = this.convertToMoney(monthlyExpense.totalExpenseMembershipAmount);
        this.monthlyExpenseOther = this.convertToMoney(monthlyExpense.totalExpenseOtherAmount);
        this.monthlyExpenseTransportation = this.convertToMoney(monthlyExpense.totalExpenseTransportationAmount);
        this.monthlyExpenseTravel = this.convertToMoney(monthlyExpense.totalExpenseTravelAmount);
        this.displayMonthlyExpenseDetails = monthlyExpense.totalExpenseAmount > 0;
      });
    this.expenseService
      .getAnnualExpenseInfo(date, this.authService.getUserId())
      .subscribe(annualExpense => {
        this.totalAnnualExpense = this.convertToMoney(annualExpense.totalExpenseAmount);
        this.annualExpenseDineOut = this.convertToMoney(annualExpense.totalExpenseDineOutAmount);
        this.annualExpenseGift = this.convertToMoney(annualExpense.totalExpenseGiftAmount);
        this.annualExpenseGrocery = this.convertToMoney(annualExpense.totalExpenseGroceryAmount);
        this.annualExpenseHouse = this.convertToMoney(annualExpense.totalExpenseHouseAmount);
        this.annualExpenseMembership = this.convertToMoney(annualExpense.totalExpenseMembershipAmount);
        this.annualExpenseOther = this.convertToMoney(annualExpense.totalExpenseOtherAmount);
        this.annualExpenseTransportation = this.convertToMoney(annualExpense.totalExpenseTransportationAmount);
        this.annualExpenseTravel = this.convertToMoney(annualExpense.totalExpenseTravelAmount);
        this.displayAnnualExpenseDetails = annualExpense.totalExpenseAmount > 0;
      });

    this.expenseList.setExpenseList(date, null);
  }
}
