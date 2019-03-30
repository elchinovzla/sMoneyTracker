import { Component, OnInit } from '@angular/core';
import { routerTransition } from 'src/app/router.animations';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SalaryComponent } from './salary/salary.component';
import { ExpenseEstimateCreateComponent } from './expense-estimate-create/expense-estimate-create.component';
import { ExpenseEstimatorService } from './expense-estimator.service';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-expense-estimator',
  templateUrl: './expense-estimator.component.html',
  styleUrls: ['./expense-estimator.component.scss'],
  animations: [routerTransition()]
})
export class ExpenseEstimatorComponent implements OnInit {
  monthlySalary: string;
  monthlyExpectedExpense = '$3,000.00';
  monthlyTotalSpareAmount = '$1,000.00';
  private salaryId: string;

  constructor(
    private modalService: NgbModal,
    public expenseEstimatorService: ExpenseEstimatorService,
    public authService: AuthService
  ) {}

  ngOnInit() {
    this.expenseEstimatorService
      .getSalaryByOwner(this.authService.getUserId())
      .subscribe(
        (salaryData: { salaryId: string; monthlySalaryAmount: string }) => {
          this.salaryId = salaryData.salaryId;
          this.monthlySalary = salaryData.monthlySalaryAmount;
        }
      );
  }

  openCreateSalary() {
    const salaryComponent = this.modalService.open(SalaryComponent, {
      centered: true
    });
    if (this.salaryId) {
      salaryComponent.componentInstance.salaryId = this.salaryId;
    }
  }

  openCreateEstimatedExpense() {
    this.modalService.open(ExpenseEstimateCreateComponent, { centered: true });
  }
}
