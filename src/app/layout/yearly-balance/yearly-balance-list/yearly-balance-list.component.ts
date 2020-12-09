import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from 'src/app/auth/auth.service';
import { PageEvent } from '@angular/material/paginator';
import { YearlyBalance } from '../yearly-balance.model';
import { YearlyBalanceService } from '../yearly-balance.service';
import { YearlyBalanceCreateComponent } from '../yealy-balance-create/yearly-balance-create.component';

@Component({
  selector: 'app-yearly-balance-list',
  templateUrl: './yearly-balance-list.component.html',
  styleUrls: ['./yearly-balance-list.component.scss'],
})
export class YearlyBalanceListComponent implements OnInit, OnDestroy {
  yearlyBalanceEntries: YearlyBalance[] = [];
  yearlyBalanceTotalCount = 0;
  yearlyBalanceEntriesPerPage = 10;
  currentPage = 1;
  private yearlyBalanceSub: Subscription;

  constructor(
    private modalService: NgbModal,
    private yearlyBalanceService: YearlyBalanceService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.yearlyBalanceService
      .getYearlyBalanceTotalCount(this.authService.getUserId())
      .subscribe((totalData) => {
        this.yearlyBalanceTotalCount = totalData.yearlyBalanceTotalCount;
      });
    this.yearlyBalanceService.getYearlyBalanceEntries(
      this.yearlyBalanceEntriesPerPage,
      this.currentPage,
      this.authService.getUserId()
    );
    this.yearlyBalanceSub = this.yearlyBalanceService
      .getYearlyBalanceUpdateListener()
      .subscribe(
        (yearlyBalanceData: { yearlyBalanceEntries: YearlyBalance[] }) => {
          this.yearlyBalanceEntries = yearlyBalanceData.yearlyBalanceEntries;
        }
      );
  }

  ngOnDestroy() {
    this.yearlyBalanceSub.unsubscribe();
  }

  edit(yearlyBalance: YearlyBalance) {
    const activeModal = this.modalService.open(YearlyBalanceCreateComponent, {
      centered: true,
    });
    activeModal.componentInstance.yearlyBalanceId = yearlyBalance.id;
  }

  delete(yearlyBalance: YearlyBalance) {
    this.yearlyBalanceService.deleteYearBalance(yearlyBalance.id);
  }

  onChangedPage(pageData: PageEvent) {
    this.currentPage = pageData.pageIndex + 1;
    this.yearlyBalanceEntriesPerPage = pageData.pageSize;
    this.yearlyBalanceService.getYearlyBalanceEntries(
      this.yearlyBalanceEntriesPerPage,
      this.currentPage,
      this.authService.getUserId()
    );
  }

  convertToMoney(amount: Number) {
    return '$' + amount.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
  }
}
