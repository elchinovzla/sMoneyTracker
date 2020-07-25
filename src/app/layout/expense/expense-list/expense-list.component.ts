import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Subscription } from 'rxjs';
import { NgbModal, NgbTabChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from 'src/app/auth/auth.service';
import { PageEvent } from '@angular/material/paginator';
import { Expense } from '../expense.model';
import { ExpenseService } from '../expense.service';
import { ExpenseCreateComponent } from '../expense-create/expense-create.component';
import { ExpenseType } from '../../expense-estimator/expense-type';

@Component({
  selector: 'app-expense-list',
  templateUrl: './expense-list.component.html',
  styleUrls: ['./expense-list.component.scss']
})
export class ExpenseListComponent implements OnInit, OnDestroy {
  private date: Date;
  private expenseType: ExpenseType;
  expenses: Expense[] = [];
  expenseTotalCount = 0;
  expensesPerPage = 10;
  currentPage = 1;
  private expenseSub: Subscription;
  categories = [];

  constructor(
    private modalService: NgbModal,
    private expenseService: ExpenseService,
    private authService: AuthService
  ) {
    this.categories = [
      { expenseType: null, name: 'All' },
      { expenseType: ExpenseType.DINE_OUT, name: 'Dine Out' },
      { expenseType: ExpenseType.GIFT, name: 'Gift' },
      { expenseType: ExpenseType.GROCERY, name: 'Grocery' },
      { expenseType: ExpenseType.HOUSE, name: 'House' },
      { expenseType: ExpenseType.MEMBERSHIP, name: 'Membership' },
      { expenseType: ExpenseType.OTHER, name: 'Other' },
      { expenseType: ExpenseType.TRANSPORTATION, name: 'Transportation' },
      { expenseType: ExpenseType.TRAVEL, name: 'Travel' }
    ]
  }

  ngOnInit() { }

  ngOnDestroy() {
    this.expenseSub.unsubscribe();
  }

  edit(expense: Expense) {
    const activeModal = this.modalService.open(ExpenseCreateComponent, {
      centered: true
    });
    activeModal.componentInstance.expenseId = expense.id;
  }

  delete(expense: Expense) {
    this.expenseService.deleteExpense(expense.id);
  }

  onChangedPage(pageData: PageEvent) {
    this.currentPage = pageData.pageIndex + 1;
    this.expensesPerPage = pageData.pageSize;
    this.expenseService.getExpenses(
      this.expensesPerPage,
      this.currentPage,
      this.authService.getUserId(),
      this.expenseType ? ExpenseType[this.expenseType] : '',
      this.date
    );
  }

  convertToMoney(amount: Number) {
    return '$' + amount.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
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

  setExpenseList(date: Date, expenseType: ExpenseType) {
    this.date = date;
    this.expenseType = expenseType;
    this.expenseService
      .getExpenseTotalCount(this.authService.getUserId(),
        expenseType ? ExpenseType[expenseType] : '',
        date)
      .subscribe(totalData => {
        this.expenseTotalCount = totalData.totalCount;
      });
    this.expenseService.getExpenses(
      this.expensesPerPage,
      this.currentPage,
      this.authService.getUserId(),
      expenseType ? ExpenseType[expenseType] : '',
      date
    );
    this.expenseSub = this.expenseService
      .getExpenseUpdateListener()
      .subscribe((expenseData: {
        expenses: Expense[]
      }) => {
        this.expenses = expenseData.expenses;
      });
  }

  selectedTab(expenseType: ExpenseType) {
    this.currentPage = 1;
    this.setExpenseList(this.date, expenseType)
  }
}
