import { Component, OnInit } from '@angular/core';
import { routerTransition } from 'src/app/router.animations';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SavingsService } from './savings.service';
import { AuthService } from 'src/app/auth/auth.service';
import { SavingsCreateComponent } from './savings-create/savings-create.component';

@Component({
  selector: 'app-savings',
  templateUrl: './savings.component.html',
  styleUrls: ['./savings.component.scss'],
  animations: [routerTransition()],
})
export class SavingsComponent implements OnInit {
  totalSavings: string;
  totalSavingsPerMonth: string;
  savingsDineOut: string;
  savingsGift: string;
  savingsGrocery: string;
  savingsHouse: string;
  savingsMembership: string;
  savingsOther: string;
  savingsTransportation: string;
  savingsTravel: string;
  displayTotalSavingsDetails: boolean;

  constructor(
    private modalService: NgbModal,
    public savingsService: SavingsService,
    public authService: AuthService
  ) {}

  ngOnInit() {
    this.savingsService
      .getSavingsInfo(this.authService.getUserId())
      .subscribe(
        (savingsInfoData: {
          totalSavingsAmount: number;
          totalSavingsAmountPerMonth: number;
          totalSavingsDineOutAmount: number;
          totalSavingsGiftAmount: number;
          totalSavingsGroceryAmount: number;
          totalSavingsHouseAmount: number;
          totalSavingsMembershipAmount: number;
          totalSavingsOtherAmount: number;
          totalSavingsTransportationAmount: number;
          totalSavingsTravelAmount: number;
        }) => {
          this.totalSavings = this.convertToMoney(
            savingsInfoData.totalSavingsAmount
          );
          this.totalSavingsPerMonth = this.convertToMoney(
            savingsInfoData.totalSavingsAmountPerMonth
          );
          this.savingsDineOut = this.convertToMoney(
            savingsInfoData.totalSavingsDineOutAmount
          );
          this.savingsGift = this.convertToMoney(
            savingsInfoData.totalSavingsGiftAmount
          );
          this.savingsGrocery = this.convertToMoney(
            savingsInfoData.totalSavingsGroceryAmount
          );
          this.savingsHouse = this.convertToMoney(
            savingsInfoData.totalSavingsHouseAmount
          );
          this.savingsMembership = this.convertToMoney(
            savingsInfoData.totalSavingsMembershipAmount
          );
          this.savingsOther = this.convertToMoney(
            savingsInfoData.totalSavingsOtherAmount
          );
          this.savingsTransportation = this.convertToMoney(
            savingsInfoData.totalSavingsTransportationAmount
          );
          this.savingsTravel = this.convertToMoney(
            savingsInfoData.totalSavingsTravelAmount
          );
          this.displayTotalSavingsDetails =
            savingsInfoData.totalSavingsAmount > 0;
        }
      );
  }

  openCreateSavings() {
    this.modalService.open(SavingsCreateComponent, { centered: true });
  }

  convertToMoney(amount: Number): string {
    return '$' + amount.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
  }

  isValueAvailable(amount: String): boolean {
    return amount !== this.convertToMoney(0);
  }
}
