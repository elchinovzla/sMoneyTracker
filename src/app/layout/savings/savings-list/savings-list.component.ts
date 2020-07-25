import { Component, OnInit, OnDestroy } from '@angular/core';
import { Savings } from '../savings.model';
import { Subscription } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SavingsService } from '../savings.service';
import { AuthService } from 'src/app/auth/auth.service';
import { SavingsCreateComponent } from '../savings-create/savings-create.component';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-savings-list',
  templateUrl: './savings-list.component.html',
  styleUrls: ['./savings-list.component.scss']
})
export class SavingsListComponent implements OnInit, OnDestroy {
  savingsEntries: Savings[] = [];
  savingsTotalCount = 0;
  savingsEntriesPerPage = 10;
  currentPage = 1;
  private savingsSub: Subscription;

  constructor(
    private modalService: NgbModal,
    private savingsService: SavingsService,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.savingsService
      .getSavingsTotalCount(this.authService.getUserId())
      .subscribe(totalData => {
        this.savingsTotalCount = totalData.savingsTotalCount;
      });
    this.savingsService.getSavingsEntries(
      this.savingsEntriesPerPage,
      this.currentPage,
      this.authService.getUserId()
    );
    this.savingsSub = this.savingsService
      .getSavingsUpdateListener()
      .subscribe(
        (savingsData: { savingsEntries: Savings[] }) => {
          this.savingsEntries = savingsData.savingsEntries;
        }
      );
  }

  ngOnDestroy() {
    this.savingsSub.unsubscribe();
  }

  edit(savings: Savings) {
    const activeModal = this.modalService.open(SavingsCreateComponent, {
      centered: true
    });
    activeModal.componentInstance.savingsId = savings.id;
  }

  delete(savings: Savings) {
    this.savingsService.deleteSavings(savings.id);
  }

  onChangedPage(pageData: PageEvent) {
    this.currentPage = pageData.pageIndex + 1;
    this.savingsEntriesPerPage = pageData.pageSize;
    this.savingsService.getSavingsEntries(
      this.savingsEntriesPerPage,
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
