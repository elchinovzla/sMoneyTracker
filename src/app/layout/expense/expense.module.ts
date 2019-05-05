import { NgModule } from '@angular/core';
import { ExpenseComponent } from './expense.component';
import { ExpenseCreateComponent } from './expense-create/expense-create.component';
import { ExpenseListComponent } from './expense-list/expense-list.component';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/material-modules';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PageHeaderModule } from 'src/app/shared';
import { ExpenseRoutingModule } from './expense-routing.module';

@NgModule({
  declarations: [ExpenseComponent, ExpenseCreateComponent, ExpenseListComponent],
  imports: [
    CommonModule,
    FormsModule,
    MaterialModule,
    NgbModule,
    PageHeaderModule,
    ExpenseRoutingModule,
    ReactiveFormsModule
  ],
  exports: [ExpenseCreateComponent],
  entryComponents: [ExpenseCreateComponent]
})
export class ExpenseModule { }
