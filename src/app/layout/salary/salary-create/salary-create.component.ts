import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from 'src/app/auth/auth.service';
import { Salary } from '../salary.model';
import { SalaryService } from '../salary.service';
import { SalaryType } from '../salary-type';

@Component({
  selector: 'app-salary-create',
  templateUrl: './salary-create.component.html',
  styleUrls: ['./salary-create.component.scss'],
})
export class SalaryCreateComponent implements OnInit, OnDestroy {
  public salaryId: string;
  salary: Salary;
  form: FormGroup;
  salaryTypes = SalaryType;
  keys = [];

  private mode = 'create';
  private moneyPattern = '^[0-9]+(.[0-9]{1,2})?$';
  private authStatusSub: Subscription;

  constructor(
    private activeModal: NgbActiveModal,
    private authService: AuthService,
    private salaryService: SalaryService
  ) {
    this.keys = Object.keys(this.salaryTypes).filter(Number);
  }

  ngOnInit() {
    this.authStatusSub = this.authService.getAuthStatusListener().subscribe();
    this.form = new FormGroup({
      description: new FormControl(null, {
        validators: [Validators.required],
      }),
      salaryType: new FormControl(null, { validators: [Validators.required] }),
      amount: new FormControl(null, {
        validators: [
          Validators.required,
          Validators.pattern(this.moneyPattern),
        ],
      }),
      note: new FormControl(null),
    });
    if (this.salaryId) {
      this.salaryService
        .getSalaryById(this.salaryId)
        .subscribe((salaryData) => {
          this.form.setValue({
            description: salaryData.description,
            salaryType: SalaryType[salaryData.salaryType],
            amount: salaryData.amount,
            note: salaryData.note,
          });
        });
      this.mode = 'edit';
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
      this.salaryService.createSalary(
        this.form.value.description,
        SalaryType[this.form.value.salaryType],
        this.form.value.amount,
        this.form.value.note,
        this.authService.getUserId()
      );
    } else {
      this.salaryService.updateSalary(
        this.salaryId,
        this.form.value.description,
        SalaryType[this.form.value.salaryType],
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
