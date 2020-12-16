import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  NgbCarouselModule,
  NgbAlertModule,
  NgbModule,
} from '@ng-bootstrap/ng-bootstrap';
import { StatModule } from '../../shared';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/material-modules';
import { ReportComponent } from './report.component';
import { ReportRoutingModule } from './report-routing.module';

@NgModule({
  declarations: [ReportComponent],
  imports: [
    FormsModule,
    CommonModule,
    NgbCarouselModule,
    NgbAlertModule,
    StatModule,
    ReactiveFormsModule,
    NgbModule,
    MaterialModule,
    ReportRoutingModule,
  ],
})
export class ReportModule {}
