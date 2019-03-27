import { Component, OnInit, OnDestroy } from '@angular/core';
import { ExpenseEstimate } from '../expense-estimate.model';
import { Subscription } from 'rxjs';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from 'src/app/auth/auth.service';
import { NgForm } from '@angular/forms';
import { ExpenseEstimatorService } from '../expense-estimator.service';

@Component({
  selector: 'app-expense-estimate-create',
  templateUrl: './expense-estimate-create.component.html',
  styleUrls: ['./expense-estimate-create.component.scss']
})
export class ExpenseEstimateCreateComponent implements OnInit, OnDestroy {
  expenseEstimate: ExpenseEstimate;

  private authStatusSub: Subscription;

  constructor(
    private activeModal: NgbActiveModal,
    private authService: AuthService,
    private expenseEstimatorService: ExpenseEstimatorService
  ) {}

  ngOnInit() {
    this.authStatusSub = this.authService.getAuthStatusListener().subscribe();
  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }

  onCreateExpenseEstimate(form: NgForm) {
    if (form.invalid) {
      return;
    }
    this.expenseEstimatorService.createExpenseEstimate(
      form.value.description,
      form.value.expenseType,
      form.value.amount,
      this.authService.getUserId()
    );

    this.activeModal.close();
  }

  onClose() {
    this.activeModal.close();
  }

  onDismiss() {
    this.activeModal.dismiss();
  }
}
