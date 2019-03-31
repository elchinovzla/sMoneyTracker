import { Component, OnInit, OnDestroy } from '@angular/core';
import { ExpenseEstimate } from '../expense-estimate.model';
import { Subscription } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ExpenseEstimatorService } from '../expense-estimator.service';
import { AuthService } from 'src/app/auth/auth.service';
import { ExpenseEstimateCreateComponent } from '../expense-estimate-create/expense-estimate-create.component';
import { PageEvent } from '@angular/material';

@Component({
  selector: 'app-expense-estimate-list',
  templateUrl: './expense-estimate-list.component.html',
  styleUrls: ['./expense-estimate-list.component.scss']
})
export class ExpenseEstimateListComponent implements OnInit, OnDestroy {
  estimatedExpenses: ExpenseEstimate[] = [];
  totalEstimatedExpenses = 0;
  estimatedExpensesPerPage = 10;
  currentPage = 1;
  private expenseSub: Subscription;

  constructor(
    private modalService: NgbModal,
    private expenseEstimatorService: ExpenseEstimatorService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.expenseEstimatorService
      .getExpenseEstimateTotalCount(this.authService.getUserId())
      .subscribe(totalData => {
        this.totalEstimatedExpenses = totalData.maxEstimatedExpenses;
      });
    this.expenseEstimatorService.getExpenseEstimates(
      this.estimatedExpensesPerPage,
      this.currentPage,
      this.authService.getUserId()
    );
    this.expenseSub = this.expenseEstimatorService
      .getExpenseEstimatorUpdateListener()
      .subscribe(
        (expenseEstimateData: { expenseEstimates: ExpenseEstimate[] }) => {
          this.estimatedExpenses = expenseEstimateData.expenseEstimates;
        }
      );
  }

  ngOnDestroy() {
    this.expenseSub.unsubscribe();
  }

  open(estimatedExpense: ExpenseEstimate) {
    const activeModal = this.modalService.open(ExpenseEstimateCreateComponent, {
      centered: true
    });
    activeModal.componentInstance.estimatedExpeseId = estimatedExpense.id;
  }

  delete(estimatedExpense: ExpenseEstimate) {
    this.expenseEstimatorService.deleteExpenseEstimate(estimatedExpense.id);
  }

  onChangedPage(pageData: PageEvent) {
    this.currentPage = pageData.pageIndex + 1;
    this.estimatedExpensesPerPage = pageData.pageSize;
    this.expenseEstimatorService.getExpenseEstimates(
      this.estimatedExpensesPerPage,
      this.currentPage,
      this.authService.getUserId()
    );
  }

  convertToMoney(amount: Number) {
    return '$' + amount.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
  }

  makeEnumPretty(value: string): string {
    return value
      .toLowerCase()
      .split('_')
      .map(function(word) {
        return word.replace(word[0], word[0].toUpperCase());
      })
      .join('-');
  }
}
