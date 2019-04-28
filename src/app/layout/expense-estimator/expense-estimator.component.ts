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
  monthlyTotalExpectedExpense: string;
  monthlyTotalEstimatedSpare: string;
  budgetDineOut: string;
  budgetGift: string;
  budgetGrocery: string;
  budgetHouse: string;
  budgetMembership: string;
  budgetOther: string;
  budgetTransportation: string;
  budgetTravel: string;
  displayBudgetDetails: boolean;
  private salaryId: string;

  constructor(
    private modalService: NgbModal,
    public expenseEstimatorService: ExpenseEstimatorService,
    public authService: AuthService
  ) { }

  ngOnInit() {
    this.expenseEstimatorService
      .getExpectedExpenseAmountsByOwner(this.authService.getUserId())
      .subscribe(
        (expectedExpenseData: {
          salaryId: string;
          monthlySalaryAmount: number;
          monthlyTotalExpectedExpenseAmount: number;
          monthlyTotalEstimatedSpareAmount: number;
          budgetDineOutAmount: number;
          budgetGiftAmount: number;
          budgetGroceryAmount: number;
          budgetHouseAmount: number;
          budgetMembershipAmount: number;
          budgetOtherAmount: number;
          budgetTransportationAmount: number;
          budgetTravelAmount: number;
        }) => {
          let expectedExpenseAmount = expectedExpenseData.monthlyTotalExpectedExpenseAmount;
          this.salaryId = expectedExpenseData.salaryId;
          this.monthlySalary = this.convertToMoney(expectedExpenseData.monthlySalaryAmount);
          this.monthlyTotalExpectedExpense = this.convertToMoney(expectedExpenseAmount);
          this.monthlyTotalEstimatedSpare = this.convertToMoney(expectedExpenseData.monthlyTotalEstimatedSpareAmount);
          this.budgetDineOut = this.convertToMoney(expectedExpenseData.budgetDineOutAmount);
          this.budgetGift = this.convertToMoney(expectedExpenseData.budgetGiftAmount);
          this.budgetGrocery = this.convertToMoney(expectedExpenseData.budgetGroceryAmount);
          this.budgetHouse = this.convertToMoney(expectedExpenseData.budgetHouseAmount);
          this.budgetMembership = this.convertToMoney(expectedExpenseData.budgetMembershipAmount);
          this.budgetOther = this.convertToMoney(expectedExpenseData.budgetOtherAmount);
          this.budgetTransportation = this.convertToMoney(expectedExpenseData.budgetTransportationAmount);
          this.budgetTravel = this.convertToMoney(expectedExpenseData.budgetTravelAmount);
          this.displayBudgetDetails = expectedExpenseAmount > 0;
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

  convertToMoney(amount: Number): string {
    if (amount) {
      return '$' + amount.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
    }
    return '$0.00';
  }

  isValueAvailable(amount: String): boolean {
    return amount !== this.convertToMoney(0);
  }
}
