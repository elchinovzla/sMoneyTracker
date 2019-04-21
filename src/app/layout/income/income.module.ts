import { NgModule } from '@angular/core';
import { IncomeComponent } from './income.component';
import { IncomeCreateComponent } from './income-create/income-create.component';
import { IncomeListComponent } from './income-list/income-list.component';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/material-modules';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PageHeaderModule } from 'src/app/shared';
import { IncomeRoutingModule } from './income-routing.module';

@NgModule({
  declarations: [IncomeComponent, IncomeCreateComponent, IncomeListComponent],
  imports: [
    CommonModule,
    FormsModule,
    MaterialModule,
    NgbModule,
    PageHeaderModule,
    IncomeRoutingModule,
    ReactiveFormsModule
  ],
  exports: [IncomeCreateComponent],
  entryComponents: [IncomeCreateComponent]
})
export class IncomeModule {}
