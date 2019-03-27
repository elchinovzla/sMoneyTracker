import { Component, OnInit, OnDestroy } from '@angular/core';
import { ExpenseEstimate } from '../expense-estimate.model';
import { Subscription } from 'rxjs';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ExpenseEstimatorService } from '../expense-estimator.service';
import { AuthService } from 'src/app/auth/auth.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-expense-estimate-modify',
  templateUrl: './expense-estimate-modify.component.html',
  styleUrls: ['./expense-estimate-modify.component.scss']
})
export class ExpenseEstimateModifyComponent implements OnInit, OnDestroy {
  public expenseEstimate: ExpenseEstimate;
  private authStatusSub: Subscription;

  constructor(
    private activeModal: NgbActiveModal,
    private expenseEstimatorService: ExpenseEstimatorService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.authStatusSub = this.authService
      .getAuthStatusListener()
      .subscribe(() => {});
  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }

  onModifyExpenseEstimate(form: NgForm) {
    if (form.invalid) {
      return;
    }

    this.expenseEstimatorService.updateExpenseEstimate(
      this.expenseEstimate.id,
      form.value.description,
      form.value.expenseType,
      form.value.amount
    );

    this.activeModal.dismiss();
  }

  onClose() {
    this.activeModal.close();
  }

  onDismiss() {
    this.activeModal.dismiss();
  }
}
