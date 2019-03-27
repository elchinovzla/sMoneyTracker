import { NgModule } from '@angular/core';
import { ExpenseEstimatorComponent } from './expense-estimator.component';
import { SalaryComponent } from './salary/salary.component';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/material-modules';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PageHeaderModule } from 'src/app/shared';
import { ExpenseEstimatorRoutingModule } from './expense-estimator-routing.module';
import { ExpenseEstimateCreateComponent } from './expense-estimate-create/expense-estimate-create.component';
import { ExpenseEstimateListComponent } from './expense-estimate-list/expense-estimate-list.component';
import { ExpenseEstimateModifyComponent } from './expense-estimate-modify/expense-estimate-modify.component';

@NgModule({
  declarations: [
    ExpenseEstimatorComponent,
    ExpenseEstimateCreateComponent,
    ExpenseEstimateListComponent,
    ExpenseEstimateModifyComponent,
    SalaryComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    MaterialModule,
    NgbModule,
    PageHeaderModule,
    ExpenseEstimatorRoutingModule,
    ReactiveFormsModule
  ],
  exports: [
    ExpenseEstimateCreateComponent,
    ExpenseEstimateModifyComponent,
    SalaryComponent
  ],
  entryComponents: [
    ExpenseEstimateCreateComponent,
    ExpenseEstimateModifyComponent,
    SalaryComponent
  ]
})
export class ExpenseEstimatorModule {}
