import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { YearlyBalanceComponent } from './yearly-balance.component';

const routes: Routes = [
  {
    path: '',
    component: YearlyBalanceComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class YearlyBalanceRoutingModule {}
