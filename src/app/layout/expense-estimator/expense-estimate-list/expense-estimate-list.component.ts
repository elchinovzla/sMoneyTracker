import { Component, OnInit, OnDestroy } from '@angular/core';
import { ExpenseEstimate } from '../expense-estimate.model';
import { Subscription } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ExpenseEstimatorService } from '../expense-estimator.service';
import { AuthService } from 'src/app/auth/auth.service';
import { ExpenseEstimateCreateComponent } from '../expense-estimate-create/expense-estimate-create.component';
import { PageEvent } from '@angular/material/paginator';
import { ExpenseType } from '../expense-type';

@Component({
  selector: 'app-expense-estimate-list',
  templateUrl: './expense-estimate-list.component.html',
  styleUrls: ['./expense-estimate-list.component.scss'],
})
export class ExpenseEstimateListComponent implements OnInit, OnDestroy {
  private expenseEstimatorSub: Subscription;
  private expenseType: ExpenseType;
  estimatedExpenses: ExpenseEstimate[] = [];
  categories = [];
  estimatedExpensesTotalCount = 0;
  estimatedExpensesPerPage = 10;
  currentPage = 1;

  constructor(
    private modalService: NgbModal,
    private expenseEstimatorService: ExpenseEstimatorService,
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
      { expenseType: ExpenseType.TRAVEL, name: 'Travel' },
    ];
  }

  ngOnInit() {}

  ngOnDestroy() {
    this.expenseEstimatorSub.unsubscribe();
  }

  open(estimatedExpense: ExpenseEstimate) {
    const activeModal = this.modalService.open(ExpenseEstimateCreateComponent, {
      centered: true,
    });
    activeModal.componentInstance.estimatedExpeseId = estimatedExpense.id;
  }

  delete(estimatedExpense: ExpenseEstimate) {
    this.expenseEstimatorService.deleteExpenseEstimate(estimatedExpense.id);
  }

  onChangedPage(pageData: PageEvent) {
    this.currentPage = pageData.pageIndex + 1;
    this.estimatedExpensesPerPage = pageData.pageSize;
    this.expenseEstimatorService.getEstimatedExpenses(
      this.estimatedExpensesPerPage,
      this.currentPage,
      this.authService.getUserId(),
      this.expenseType ? ExpenseType[this.expenseType] : ''
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

  setExpenseList(expenseType: ExpenseType) {
    this.expenseType = expenseType;
    this.expenseEstimatorService
      .getExpenseEstimatorTotalCount(
        this.authService.getUserId(),
        expenseType ? ExpenseType[expenseType] : ''
      )
      .subscribe((totalData) => {
        this.estimatedExpensesTotalCount = totalData.totalCount;
      });
    this.expenseEstimatorService.getEstimatedExpenses(
      this.estimatedExpensesPerPage,
      this.currentPage,
      this.authService.getUserId(),
      expenseType ? ExpenseType[expenseType] : ''
    );
    this.expenseEstimatorSub = this.expenseEstimatorService
      .getExpenseEstimatorUpdateListener()
      .subscribe(
        (expenseEstimateData: { expenseEstimates: ExpenseEstimate[] }) => {
          this.estimatedExpenses = expenseEstimateData.expenseEstimates;
        }
      );
  }

  selectedTab(expenseType: ExpenseType) {
    this.currentPage = 1;
    this.setExpenseList(expenseType);
  }
}
