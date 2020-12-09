import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from 'src/app/auth/auth.service';
import { ExpenseType } from '../../expense-estimator/expense-type';
import { Savings } from '../savings.model';
import { SavingsService } from '../savings.service';

@Component({
  selector: 'app-savings-create',
  templateUrl: './savings-create.component.html',
  styleUrls: ['./savings-create.component.scss'],
})
export class SavingsCreateComponent implements OnInit, OnDestroy {
  public savingsId: string;
  savings: Savings;
  form: FormGroup;
  expenseTypes = ExpenseType;
  keys = [];

  private mode = 'create';
  private moneyPattern = '^[0-9]+(.[0-9]{1,2})?$';
  private authStatusSub: Subscription;

  constructor(
    private activeModal: NgbActiveModal,
    private authService: AuthService,
    private savingsService: SavingsService
  ) {
    this.keys = Object.keys(this.expenseTypes).filter(Number);
  }

  ngOnInit() {
    this.authStatusSub = this.authService.getAuthStatusListener().subscribe();
    this.form = new FormGroup({
      description: new FormControl(null, { validators: [Validators.required] }),
      expenseType: new FormControl(null, { validators: [Validators.required] }),
      amount: new FormControl(null, {
        validators: [
          Validators.required,
          Validators.pattern(this.moneyPattern),
        ],
      }),
      amountPerMonth: new FormControl(null, {
        validators: [
          Validators.required,
          Validators.pattern(this.moneyPattern),
        ],
      }),
      note: new FormControl(null),
    });
    if (this.savingsId) {
      this.savingsService
        .getSavingsById(this.savingsId)
        .subscribe((savingsData) => {
          this.form.setValue({
            description: savingsData.description,
            expenseType: ExpenseType[savingsData.expenseType],
            amount: savingsData.amount,
            amountPerMonth: savingsData.amountPerMonth,
            note: savingsData.note,
          });
        });
      this.mode = 'edit';
    }
  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }

  onSaveSavings() {
    if (this.form.invalid) {
      return;
    }
    if (this.mode === 'create') {
      this.savingsService.createSavings(
        this.form.value.description,
        ExpenseType[this.form.value.expenseType],
        this.form.value.amount,
        this.form.value.amountPerMonth,
        this.form.value.note,
        this.authService.getUserId()
      );
    } else {
      this.savingsService.updateSavings(
        this.savingsId,
        this.form.value.description,
        ExpenseType[this.form.value.expenseType],
        this.form.value.amount,
        this.form.value.amountPerMonth,
        this.form.value.note
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
      .map(function (word) {
        return word.replace(word[0], word[0].toUpperCase());
      })
      .join('-');
  }
}
