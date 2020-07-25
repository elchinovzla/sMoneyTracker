import { Component, OnInit, OnDestroy } from '@angular/core';
import { Money } from '../money.model';
import { Subscription } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MoneyService } from '../money.service';
import { AuthService } from 'src/app/auth/auth.service';
import { MoneyCreateComponent } from '../money-create/money-create.component';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-money-list',
  templateUrl: './money-list.component.html',
  styleUrls: ['./money-list.component.scss']
})
export class MoneyListComponent implements OnInit, OnDestroy {
  moneyEntries: Money[] = [];
  moneyTotalCount = 0;
  moneyEntriesPerPage = 10;
  currentPage = 1;
  private moneySub: Subscription;

  constructor(
    private modalService: NgbModal,
    private moneyService: MoneyService,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.moneyService
      .getMoneyTotalCount(this.authService.getUserId())
      .subscribe(totalData => {
        this.moneyTotalCount = totalData.moneyTotalCount;
      });
    this.moneyService.getMoneyEntries(
      this.moneyEntriesPerPage,
      this.currentPage,
      this.authService.getUserId()
    );
    this.moneySub = this.moneyService
      .getMoneyUpdateListener()
      .subscribe(
        (moneyData: { moneyEntries: Money[] }) => {
          this.moneyEntries = moneyData.moneyEntries;
        }
      );
  }

  ngOnDestroy() {
    this.moneySub.unsubscribe();
  }

  edit(money: Money) {
    const activeModal = this.modalService.open(MoneyCreateComponent, {
      centered: true
    });
    activeModal.componentInstance.moneyId = money.id;
  }

  delete(money: Money) {
    this.moneyService.deleteMoney(money.id);
  }

  onChangedPage(pageData: PageEvent) {
    this.currentPage = pageData.pageIndex + 1;
    this.moneyEntriesPerPage = pageData.pageSize;
    this.moneyService.getMoneyEntries(
      this.moneyEntriesPerPage,
      this.currentPage,
      this.authService.getUserId()
    );
  }

  convertToMoney(amount: Number) {
    return '$' + amount.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
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
