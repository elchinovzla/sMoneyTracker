import { Component, OnInit } from '@angular/core';
import { routerTransition } from 'src/app/router.animations';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from 'src/app/auth/auth.service';
import { YearlyBalanceService } from './yearly-balance.service';
import { YearlyBalanceCreateComponent } from './yealy-balance-create/yearly-balance-create.component';

@Component({
  selector: 'app-savings',
  templateUrl: './yearly-balance.component.html',
  styleUrls: ['./yearly-balance.component.scss'],
  animations: [routerTransition()],
})
export class YearlyBalanceComponent implements OnInit {
  constructor(
    private modalService: NgbModal,
    public yearlyBalanceService: YearlyBalanceService,
    public authService: AuthService
  ) {}

  ngOnInit() {}

  openCreateYearlyBalance() {
    this.modalService.open(YearlyBalanceCreateComponent, { centered: true });
  }
}
