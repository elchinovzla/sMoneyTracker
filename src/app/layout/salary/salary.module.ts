import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/material-modules';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PageHeaderModule } from 'src/app/shared';
import { SalaryComponent } from './salary.component';
import { SalaryCreateComponent } from './salary-create/salary-create.component';
import { SalaryListComponent } from './salary-list/salary-list.component';
import { SalaryRoutingModule } from './salary-routing.module';

@NgModule({
  declarations: [SalaryComponent, SalaryCreateComponent, SalaryListComponent],
  imports: [
    CommonModule,
    FormsModule,
    MaterialModule,
    NgbModule,
    PageHeaderModule,
    SalaryRoutingModule,
    ReactiveFormsModule,
  ],
  exports: [SalaryCreateComponent],
  entryComponents: [SalaryCreateComponent],
})
export class SalaryModule {}
