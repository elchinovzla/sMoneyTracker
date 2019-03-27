import { Component, OnInit, OnDestroy } from '@angular/core';
import { ExpenseEstimate } from '../expense-estimate.model';
import { Subscription } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ExpenseEstimatorService } from '../expense-estimator.service';
import { AuthService } from 'src/app/auth/auth.service';
import { ExpenseEstimateModifyComponent } from '../expense-estimate-modify/expense-estimate-modify.component';

@Component({
  selector: 'app-expense-estimate-list',
  templateUrl: './expense-estimate-list.component.html',
  styleUrls: ['./expense-estimate-list.component.scss']
})
export class ExpenseEstimateListComponent implements OnInit, OnDestroy {
  expenseEstimates: ExpenseEstimate[] = [];
  totalExpenseEstimates = 0;
  expenseEstimatesPerPage = 10;
  currentPage = 1;
  private expenseSub: Subscription;

  constructor(
    private modalService: NgbModal,
    private expenseEstimatorService: ExpenseEstimatorService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.expenseEstimatorService.getExpenseEstimates(
      this.expenseEstimatesPerPage,
      this.currentPage,
      this.authService.getUserId()
    );
    this.expenseSub = this.expenseEstimatorService
      .getExpenseEstimatorUpdateListener()
      .subscribe(
        (expenseEstimateData: {
          expenseEstimates: ExpenseEstimate[];
          expenseEstimateCount: number;
        }) => {
          this.expenseEstimates = expenseEstimateData.expenseEstimates;
          this.totalExpenseEstimates = expenseEstimateData.expenseEstimateCount;
        }
      );
  }

  ngOnDestroy() {
    this.expenseSub.unsubscribe();
  }

  open(expenseEstimate: ExpenseEstimate) {
    const activeModal = this.modalService.open(ExpenseEstimateModifyComponent, {
      centered: true
    });
    activeModal.componentInstance.expenseEstimate = expenseEstimate;
  }
}
