import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { SalaryComponent } from './salary.component';

const routes: Routes = [
  {
    path: '',
    component: SalaryComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SalaryRoutingModule {}
