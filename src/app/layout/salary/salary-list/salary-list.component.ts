import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from 'src/app/auth/auth.service';
import { PageEvent } from '@angular/material/paginator';
import { Salary } from '../salary.model';
import { SalaryService } from '../salary.service';
import { SalaryCreateComponent } from '../salary-create/salary-create.component';

@Component({
  selector: 'app-salary-list',
  templateUrl: './salary-list.component.html',
  styleUrls: ['./salary-list.component.scss'],
})
export class SalaryListComponent implements OnInit, OnDestroy {
  salaryEntries: Salary[] = [];
  salaryTotalCount = 0;
  salaryEntriesPerPage = 10;
  currentPage = 1;
  private salarySub: Subscription;

  constructor(
    private modalService: NgbModal,
    private salaryService: SalaryService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.salaryService
      .getSalaryTotalCount(this.authService.getUserId())
      .subscribe((totalData) => {
        this.salaryTotalCount = totalData.salaryTotalCount;
      });
    this.salaryService.getSalaryEntries(
      this.salaryEntriesPerPage,
      this.currentPage,
      this.authService.getUserId()
    );
    this.salarySub = this.salaryService
      .getSalaryUpdateListener()
      .subscribe((salaryData: { salaryEntries: Salary[] }) => {
        this.salaryEntries = salaryData.salaryEntries;
      });
  }

  ngOnDestroy() {
    this.salarySub.unsubscribe();
  }

  edit(salary: Salary) {
    const activeModal = this.modalService.open(SalaryCreateComponent, {
      centered: true,
    });
    activeModal.componentInstance.salaryId = salary.id;
  }

  delete(salary: Salary) {
    this.salaryService.deleteSalary(salary.id);
  }

  onChangedPage(pageData: PageEvent) {
    this.currentPage = pageData.pageIndex + 1;
    this.salaryEntriesPerPage = pageData.pageSize;
    this.salaryService.getSalaryEntries(
      this.salaryEntriesPerPage,
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
