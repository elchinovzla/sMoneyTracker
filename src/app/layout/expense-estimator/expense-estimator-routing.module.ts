import { Routes, RouterModule } from '@angular/router';
import { ExpenseEstimatorComponent } from './expense-estimator.component';
import { NgModule } from '@angular/core';

const routes: Routes = [
  {
    path: '',
    component: ExpenseEstimatorComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExpenseEstimatorRoutingModule {}
