import { Component, OnInit, OnDestroy } from '@angular/core';
import { ExpenseEstimate } from '../expense-estimate.model';
import { Subscription } from 'rxjs';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from 'src/app/auth/auth.service';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { ExpenseEstimatorService } from '../expense-estimator.service';
import { ExpenseType } from '../expense-type';

@Component({
  selector: 'app-expense-estimate-create',
  templateUrl: './expense-estimate-create.component.html',
  styleUrls: ['./expense-estimate-create.component.scss']
})
export class ExpenseEstimateCreateComponent implements OnInit, OnDestroy {
  public estimatedExpeseId: string;
  enteredDescription = '';
  enteredExpenseType = '';
  enteredAmount = '';
  expenseEstimate: ExpenseEstimate;
  form: FormGroup;
  expenseTypes = ExpenseType;
  keys = [];

  private mode = 'create';
  private moneyPattern = '^[0-9]+(.[0-9]{1,2})?$';
  private authStatusSub: Subscription;

  constructor(
    private activeModal: NgbActiveModal,
    private authService: AuthService,
    private expenseEstimatorService: ExpenseEstimatorService
  ) {
    this.keys = Object.keys(this.expenseTypes).filter(Number);
  }

  ngOnInit() {
    this.authStatusSub = this.authService.getAuthStatusListener().subscribe();
    this.form = new FormGroup({
      description: new FormControl(null, { validators: [Validators.required] }),
      expenseType: new FormControl(null, { validators: [Validators.required] }),
      amount: new FormControl(null, {
        validators: [Validators.required, Validators.pattern(this.moneyPattern)]
      })
    });
    if (this.estimatedExpeseId) {
      this.expenseEstimatorService
        .getExpenseEstimate(this.estimatedExpeseId)
        .subscribe(estimatedExpenseData => {
          this.form.setValue({
            description: estimatedExpenseData.description,
            expenseType: ExpenseType[estimatedExpenseData.expenseType],
            amount: estimatedExpenseData.amount
          });
        });
      this.mode = 'edit';
    }
  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }

  onSaveEstimatedExpense() {
    if (this.form.invalid) {
      return;
    }
    if (this.mode === 'create') {
      this.expenseEstimatorService.createExpenseEstimate(
        this.form.value.description,
        ExpenseType[this.form.value.expenseType],
        this.form.value.amount,
        this.authService.getUserId()
      );
    } else {
      this.expenseEstimatorService.updateExpenseEstimate(
        this.estimatedExpeseId,
        this.form.value.description,
        ExpenseType[this.form.value.expenseType],
        this.form.value.amount
      );
    }

    this.activeModal.close();
  }

  onClose() {
    this.activeModal.close();
  }

  onDismiss() {
    this.activeModal.dismiss();
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
