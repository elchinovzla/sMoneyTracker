import { NgModule } from '@angular/core';
import { MoneyComponent } from './money.component';
import { MoneyCreateComponent } from './money-create/money-create.component';
import { MoneyListComponent } from './money-list/money-list.component';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/material-modules';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PageHeaderModule } from 'src/app/shared';
import { MoneyRoutingModule } from './money-routing.module';

@NgModule({
  declarations: [
    MoneyComponent,
    MoneyCreateComponent,
    MoneyListComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    MaterialModule,
    NgbModule,
    PageHeaderModule,
    MoneyRoutingModule,
    ReactiveFormsModule
  ],
  exports: [MoneyCreateComponent],
  entryComponents: [MoneyCreateComponent]
})
export class MoneyModule { }
