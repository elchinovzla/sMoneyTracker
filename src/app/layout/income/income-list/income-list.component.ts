import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Subscription } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from 'src/app/auth/auth.service';
import { PageEvent } from '@angular/material';
import { Income } from '../income.model';
import { IncomeService } from '../income.service';
import { IncomeCreateComponent } from '../income-create/income-create.component';

@Component({
  selector: 'app-income-list',
  templateUrl: './income-list.component.html',
  styleUrls: ['./income-list.component.scss']
})
export class IncomeListComponent implements OnInit, OnDestroy {
  private date: Date;
  incomes: Income[] = [];
  totalIncomes = 0;
  incomesPerPage = 10;
  currentPage = 1;
  private incomeSub: Subscription;

  constructor(
    private modalService: NgbModal,
    private incomeService: IncomeService,
    private authService: AuthService
  ) { }

  ngOnInit() { }

  ngOnDestroy() {
    this.incomeSub.unsubscribe();
  }

  edit(income: Income) {
    const activeModal = this.modalService.open(IncomeCreateComponent, {
      centered: true
    });
    activeModal.componentInstance.incomeId = income.id;
  }

  delete(income: Income) {
    this.incomeService.deleteIncome(income.id);
  }

  onChangedPage(pageData: PageEvent) {
    this.currentPage = pageData.pageIndex + 1;
    this.incomesPerPage = pageData.pageSize;
    this.incomeService.getIncomes(
      this.incomesPerPage,
      this.currentPage,
      this.authService.getUserId(),
      this.date
    );
  }

  convertToMoney(amount: Number) {
    return '$' + amount.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
  }

  loadIncomeList(date: Date) {
    this.date = date;
    this.incomeService
      .getIncomeTotalCount(this.authService.getUserId(), date)
      .subscribe(totalData => {
        this.totalIncomes = totalData.maxIncomes;
      });
    this.incomeService.getIncomes(
      this.incomesPerPage,
      this.currentPage,
      this.authService.getUserId(),
      date
    );
    this.incomeSub = this.incomeService
      .getIncomeUpdateListener()
      .subscribe((incomeData: { incomes: Income[] }) => {
        this.incomes = incomeData.incomes;
      });
  }
}
