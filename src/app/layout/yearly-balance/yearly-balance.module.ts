import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/material-modules';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PageHeaderModule } from 'src/app/shared';
import { YearlyBalanceCreateComponent } from './yealy-balance-create/yearly-balance-create.component';
import { YearlyBalanceComponent } from './yearly-balance.component';
import { YearlyBalanceListComponent } from './yearly-balance-list/yearly-balance-list.component';
import { YearlyBalanceRoutingModule } from './yearly-balance-routing.module';

@NgModule({
  declarations: [
    YearlyBalanceComponent,
    YearlyBalanceCreateComponent,
    YearlyBalanceListComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    MaterialModule,
    NgbModule,
    PageHeaderModule,
    YearlyBalanceRoutingModule,
    ReactiveFormsModule,
  ],
  exports: [YearlyBalanceCreateComponent],
  entryComponents: [YearlyBalanceCreateComponent],
})
export class YearlyBalanceModule {}
