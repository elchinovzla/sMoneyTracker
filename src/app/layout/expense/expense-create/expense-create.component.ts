import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from 'src/app/auth/auth.service';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { Expense } from '../expense.model';
import { ExpenseService } from '../expense.service';
import { ExpenseType } from '../../expense-estimator/expense-type';
import { SavingsService } from '../../savings/savings.service';

@Component({
  selector: 'app-expense-create',
  templateUrl: './expense-create.component.html',
  styleUrls: ['./expense-create.component.scss']
})
export class ExpenseCreateComponent implements OnInit, OnDestroy {
  public expenseId: string;
  expense: Expense;
  form: FormGroup;
  expenseTypes = ExpenseType;
  keys = [];
  availableSavings: Array<{ id: string, description: string }> = [{ id: '', description: 'None' }];

  private mode = 'create';
  private moneyPattern = '^[0-9]+(.[0-9]{1,2})?$';
  private authStatusSub: Subscription;

  constructor(
    private activeModal: NgbActiveModal,
    private authService: AuthService,
    private expenseService: ExpenseService,
    private savingsService: SavingsService
  ) { this.keys = Object.keys(this.expenseTypes).filter(Number); }

  ngOnInit() {
    this.authStatusSub = this.authService.getAuthStatusListener().subscribe();
    this.savingsService.getSavingsEntriesForDropDown(this.authService.getUserId())
      .subscribe(savingsData => {
        for (let savings of savingsData.savingsEntries) {
          this.availableSavings.push({
            id: savings.id,
            description: savings.description
          });
        }
      });
    this.form = new FormGroup({
      description: new FormControl(null, { validators: [Validators.required] }),
      expenseType: new FormControl(null, { validators: [Validators.required] }),
      amount: new FormControl(null, {
        validators: [Validators.required, Validators.pattern(this.moneyPattern)]
      }),
      date: new FormControl(null, { validators: [Validators.required] }),
      savingsId: new FormControl(null),
      note: new FormControl(null)
    });
    if (this.expenseId) {
      this.expenseService.getExpenseById(this.expenseId)
        .subscribe(expenseData => {
          let date = new Date(expenseData.date);
          var ngbDateStruct = {
            day: date.getUTCDate(),
            month: date.getUTCMonth() + 1,
            year: date.getUTCFullYear()
          };
          this.form.setValue({
            description: expenseData.description,
            expenseType: ExpenseType[expenseData.expenseType],
            amount: expenseData.amount,
            date: ngbDateStruct,
            savingsId: expenseData.savingsId,
            note: expenseData.note
          });
        });
      this.mode = 'edit';
    }
  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }

  onSaveExpense() {
    if (this.form.invalid) {
      return;
    }
    let date = this.form.value.date;
    if (this.mode === 'create') {
      this.expenseService.createExpense(
        this.form.value.description,
        ExpenseType[this.form.value.expenseType],
        this.form.value.amount,
        new Date(date.year, date.month - 1, date.day),
        this.form.value.savingsId,
        this.form.value.note,
        this.authService.getUserId()
      );
    } else {
      this.expenseService.updateExpense(
        this.expenseId,
        this.form.value.description,
        ExpenseType[this.form.value.expenseType],
        this.form.value.amount,
        new Date(date.year, date.month - 1, date.day),
        this.form.value.savingsId,
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
