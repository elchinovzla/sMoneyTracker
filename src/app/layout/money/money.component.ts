import { Component, OnInit } from '@angular/core';
import { routerTransition } from 'src/app/router.animations';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MoneyService } from './money.service';
import { AuthService } from 'src/app/auth/auth.service';
import { MoneyCreateComponent } from './money-create/money-create.component';

@Component({
  selector: 'app-money',
  templateUrl: './money.component.html',
  styleUrls: ['./money.component.scss'],
  animations: [routerTransition()],
})
export class MoneyComponent implements OnInit {
  moneyInTheBank: string;
  moneyInvested: string;
  moneyUnclaimed: string;
  moneyOther: string;
  moneyInChecking: string;
  moneyInSavings: string;
  moneyInRrsp: string;
  moneyInTfsa: string;
  moneyCash: string;
  moneyGiftCard: string;
  displayMoneyInTheBankDetails: boolean;
  displayMoneyInvestedDetails: boolean;
  displayOtherMoneyDetails: boolean;

  constructor(
    private modalService: NgbModal,
    public moneyService: MoneyService,
    public authService: AuthService
  ) {}

  ngOnInit() {
    this.moneyService
      .getMoneyInfo(this.authService.getUserId())
      .subscribe(
        (moneyInfoData: {
          moneyInTheBank: number;
          moneyInvested: number;
          moneyUnclaimed: number;
          moneyOther: number;
          moneyInChecking: number;
          moneyInSavings: number;
          moneyInRrsp: number;
          moneyInTfsa: number;
          moneyCash: number;
          moneyGiftCard: number;
        }) => {
          this.moneyInTheBank = this.convertToMoney(
            moneyInfoData.moneyInTheBank
          );
          this.moneyInvested = this.convertToMoney(moneyInfoData.moneyInvested);
          this.moneyUnclaimed = this.convertToMoney(
            moneyInfoData.moneyUnclaimed
          );
          this.moneyOther = this.convertToMoney(moneyInfoData.moneyOther);
          this.moneyInChecking = this.convertToMoney(
            moneyInfoData.moneyInChecking
          );
          this.moneyInSavings = this.convertToMoney(
            moneyInfoData.moneyInSavings
          );
          this.moneyInRrsp = this.convertToMoney(moneyInfoData.moneyInRrsp);
          this.moneyInTfsa = this.convertToMoney(moneyInfoData.moneyInTfsa);
          this.moneyCash = this.convertToMoney(moneyInfoData.moneyCash);
          this.moneyGiftCard = this.convertToMoney(moneyInfoData.moneyGiftCard);
          this.displayMoneyInTheBankDetails = moneyInfoData.moneyInTheBank > 0;
          this.displayMoneyInvestedDetails = moneyInfoData.moneyInvested > 0;
          this.displayOtherMoneyDetails = moneyInfoData.moneyOther > 0;
        }
      );
  }

  openCreateMoney() {
    this.modalService.open(MoneyCreateComponent, { centered: true });
  }

  convertToMoney(amount: Number): string {
    return '$' + amount.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
  }
}
