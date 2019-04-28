import { Component, OnInit, OnDestroy } from '@angular/core';
import { Money } from '../money.model';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { MoneyType } from '../money-type';
import { Subscription } from 'rxjs';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from 'src/app/auth/auth.service';
import { MoneyService } from '../money.service';

@Component({
  selector: 'app-money-create',
  templateUrl: './money-create.component.html',
  styleUrls: ['./money-create.component.scss']
})
export class MoneyCreateComponent implements OnInit, OnDestroy {
  public moneyId: string;
  money: Money;
  form: FormGroup;
  moneyTypes = MoneyType;
  keys = [];

  private mode = 'create';
  private moneyPattern = '^[0-9]+(.[0-9]{1,2})?$';
  private authStatusSub: Subscription;

  constructor(
    private activeModal: NgbActiveModal,
    private authService: AuthService,
    private moneyService: MoneyService
  ) {
    this.keys = Object.keys(this.moneyTypes).filter(Number);
  }

  ngOnInit() {
    this.authStatusSub = this.authService.getAuthStatusListener().subscribe();
    this.form = new FormGroup({
      description: new FormControl(null, { validators: [Validators.required] }),
      moneyType: new FormControl(null, { validators: [Validators.required] }),
      amount: new FormControl(null, {
        validators: [Validators.required, Validators.pattern(this.moneyPattern)]
      }),
      note: new FormControl(null)
    });
    if (this.moneyId) {
      this.moneyService
        .getMoney(this.moneyId)
        .subscribe(moneyData => {
          this.form.setValue({
            description: moneyData.description,
            moneyType: MoneyType[moneyData.moneyType],
            amount: moneyData.amount,
            note: moneyData.note
          });
        });
      this.mode = 'edit';
    }
  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }

  onSaveMoney() {
    if (this.form.invalid) {
      return;
    }
    if (this.mode === 'create') {
      this.moneyService.createMoney(
        this.form.value.description,
        MoneyType[this.form.value.moneyType],
        this.form.value.amount,
        this.form.value.note,
        this.authService.getUserId()
      );
    } else {
      this.moneyService.updateMoney(
        this.moneyId,
        this.form.value.description,
        MoneyType[this.form.value.moneyType],
        this.form.value.amount,
        this.form.value.note,
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
