import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from 'src/app/auth/auth.service';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { Income } from '../income.model';
import { IncomeService } from '../income.service';

@Component({
  selector: 'app-income-create',
  templateUrl: './income-create.component.html',
  styleUrls: ['./income-create.component.scss']
})
export class IncomeCreateComponent implements OnInit, OnDestroy {
  public incomeId: string;
  enteredName = '';
  enteredAmount = '';
  enteredDate = '';
  enteredNote = '';
  income: Income;
  form: FormGroup;

  private mode = 'create';
  private moneyPattern = '^[0-9]+(.[0-9]{1,2})?$';
  private authStatusSub: Subscription;

  constructor(
    private activeModal: NgbActiveModal,
    private authService: AuthService,
    private incomeService: IncomeService
  ) { }

  ngOnInit() {
    this.authStatusSub = this.authService.getAuthStatusListener().subscribe();
    this.form = new FormGroup({
      name: new FormControl(null, { validators: [Validators.required] }),
      amount: new FormControl(null, {
        validators: [Validators.required, Validators.pattern(this.moneyPattern)]
      }),
      date: new FormControl(null, { validators: [Validators.required] }),
      note: new FormControl(null)
    });
    if (this.incomeId) {
      this.incomeService.getIncome(this.incomeId)
        .subscribe(incomeData => {
          let date = new Date(incomeData.date);
          var ngbDateStruct = {
            day: date.getUTCDate(),
            month: date.getUTCMonth() + 1,
            year: date.getUTCFullYear()
          };
          this.form.setValue({
            name: incomeData.name,
            amount: incomeData.amount,
            date: ngbDateStruct,
            note: incomeData.note
          });
        });
      this.mode = 'edit';
    }
  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }

  onSaveIncome() {
    if (this.form.invalid) {
      return;
    }
    let date = this.form.value.date;
    let dateString = date.year + '-' + date.month + '-' + date.day + 'T00:00:00';
    if (this.mode === 'create') {
      this.incomeService.createIncome(
        this.form.value.name,
        this.form.value.amount,
        new Date(dateString),
        this.form.value.note,
        this.authService.getUserId()
      );
    } else {
      this.incomeService.updateIncome(
        this.incomeId,
        this.form.value.name,
        this.form.value.amount,
        new Date(dateString),
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
}
