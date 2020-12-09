import { NgModule } from '@angular/core';
import { SavingsComponent } from './savings.component';
import { SavingsCreateComponent } from './savings-create/savings-create.component';
import { SavingsListComponent } from './savings-list/savings-list.component';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/material-modules';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PageHeaderModule } from 'src/app/shared';
import { SavingsRoutingModule } from './savings-routing.module';

@NgModule({
  declarations: [
    SavingsComponent,
    SavingsCreateComponent,
    SavingsListComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    MaterialModule,
    NgbModule,
    PageHeaderModule,
    SavingsRoutingModule,
    ReactiveFormsModule,
  ],
  exports: [SavingsCreateComponent],
  entryComponents: [SavingsCreateComponent],
})
export class SavingsModule {}
