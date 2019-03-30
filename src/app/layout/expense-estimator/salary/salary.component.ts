import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { Salary } from '../salary.model';
import { ExpenseEstimatorService } from '../expense-estimator.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { SalaryType } from '../salary-type';

@Component({
  selector: 'app-salary',
  templateUrl: './salary.component.html',
  styleUrls: ['./salary.component.scss']
})
export class SalaryComponent implements OnInit, OnDestroy {
  public salaryId: string;
  enteredSalaryType = '';
  enteredAmount = '';
  salary: Salary;
  form: FormGroup;
  salaryTypes = SalaryType;
  keys = [];

  private mode = 'create';
  private moneyPattern = '^[0-9]+(.[0-9]{1,2})?$';
  private authStatusSub: Subscription;

  constructor(
    private activeModal: NgbActiveModal,
    private expenseEstimatorService: ExpenseEstimatorService,
    private authService: AuthService
  ) {
    this.keys = Object.keys(this.salaryTypes).filter(Number);
  }

  ngOnInit() {
    this.authStatusSub = this.authService.getAuthStatusListener().subscribe();
    this.form = new FormGroup({
      salaryType: new FormControl(null, { validators: [Validators.required] }),
      amount: new FormControl(null, {
        validators: [Validators.required, Validators.pattern(this.moneyPattern)]
      })
    });
    if (this.salaryId) {
      this.expenseEstimatorService
        .getSalary(this.salaryId)
        .subscribe(salaryData => {
          this.form.setValue({
            salaryType: SalaryType[salaryData.salaryType],
            amount: salaryData.amount
          });
          this.mode = 'edit';
        });
    }
  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }

  onSaveSalary() {
    if (this.form.invalid) {
      return;
    }
    if (this.mode === 'create') {
      this.expenseEstimatorService.createSalary(
        SalaryType[this.form.value.salaryType],
        this.form.value.amount,
        this.authService.getUserId()
      );
    } else {
      this.expenseEstimatorService.updateSalary(
        this.salaryId,
        SalaryType[this.form.value.salaryType],
        this.form.value.amount
      );
    }

    this.onClose();
  }

  onClose() {
    this.form.reset();
    this.activeModal.close();
  }

  onDismiss() {
    this.form.reset();
    this.activeModal.dismiss();
  }

  makeEnumPretty(value:string): string {
    return value
      .toLowerCase()
      .split('_')
      .map(function(word) {
        return word.replace(word[0], word[0].toUpperCase());
      })
      .join('-');
  }
}
