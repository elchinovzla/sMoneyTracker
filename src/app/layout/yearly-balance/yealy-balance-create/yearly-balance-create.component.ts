import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from 'src/app/auth/auth.service';
import { YearlyBalance } from '../yearly-balance.model';
import { YearlyBalanceService } from '../yearly-balance.service';

@Component({
  selector: 'app-savings-create',
  templateUrl: './yearly-balance-create.component.html',
  styleUrls: ['./yearly-balance-create.component.scss'],
})
export class YearlyBalanceCreateComponent implements OnInit, OnDestroy {
  public yearlyBalanceId: string;
  yealyBalance: YearlyBalance;
  form: FormGroup;

  private mode = 'create';
  private moneyPattern = '^[0-9]+(.[0-9]{1,2})?$';
  private yearPattern = '^20(1[1-9]|[2-9][0-9])$';
  private authStatusSub: Subscription;

  constructor(
    private activeModal: NgbActiveModal,
    private authService: AuthService,
    private yearlyBalanceService: YearlyBalanceService
  ) {}

  ngOnInit() {
    this.authStatusSub = this.authService.getAuthStatusListener().subscribe();
    this.form = new FormGroup({
      year: new FormControl(null, {
        validators: [Validators.required, Validators.pattern(this.yearPattern)],
      }),
      amount: new FormControl(null, {
        validators: [
          Validators.required,
          Validators.pattern(this.moneyPattern),
        ],
      }),
      note: new FormControl(null),
    });
    if (this.yearlyBalanceId) {
      this.yearlyBalanceService
        .getYearlyBalanceById(this.yearlyBalanceId)
        .subscribe((yearlyBalanceData) => {
          const date = new Date(yearlyBalanceData.startDate);
          this.form.setValue({
            year: date.getFullYear(),
            amount: yearlyBalanceData.amount,
            note: yearlyBalanceData.note,
          });
        });
      this.mode = 'edit';
    }
  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }

  onSaveYearlyBalance() {
    if (this.form.invalid) {
      return;
    }

    if (this.mode === 'create') {
      this.yearlyBalanceService.createYearlyBalance(
        this.form.value.year,
        this.form.value.amount,
        this.form.value.note,
        this.authService.getUserId()
      );
    } else {
      this.yearlyBalanceService.updateYearlyBalance(
        this.yearlyBalanceId,
        this.form.value.year,
        this.form.value.amount,
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
