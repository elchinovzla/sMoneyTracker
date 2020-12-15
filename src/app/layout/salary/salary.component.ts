import { Component, OnInit } from '@angular/core';
import { routerTransition } from 'src/app/router.animations';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from 'src/app/auth/auth.service';
import { SalaryService } from './salary.service';
import { SalaryCreateComponent } from './salary-create/salary-create.component';

@Component({
  selector: 'app-salary-balance',
  templateUrl: './salary.component.html',
  styleUrls: ['./salary.component.scss'],
  animations: [routerTransition()],
})
export class SalaryComponent implements OnInit {
  monthlySalary: string;

  constructor(
    private modalService: NgbModal,
    public salaryService: SalaryService,
    public authService: AuthService
  ) {}

  ngOnInit() {
    this.getUsersSalaryInfo();
  }

  openCreateSalary() {
    this.modalService.open(SalaryCreateComponent, { centered: true });
  }

  getUsersSalaryInfo() {
    this.salaryService
      .getMonthlySalary(this.authService.getUserId())
      .subscribe((salaryInfo: { monthlySalaryAmount: number }) => {
        this.monthlySalary = this.convertToMoney(
          salaryInfo.monthlySalaryAmount
        );
      });
  }

  convertToMoney(amount: Number): string {
    if (amount) {
      return '$' + amount.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
    }
    return '$0.00';
  }
}
