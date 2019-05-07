import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbCarouselModule, NgbAlertModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import { StatModule } from '../../shared';
import { ChartsModule } from 'ng2-charts';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    FormsModule,
    CommonModule,
    NgbCarouselModule,
    NgbAlertModule,
    DashboardRoutingModule,
    StatModule,
    ReactiveFormsModule,
    ChartsModule,
    NgbModule
  ],
  declarations: [
    DashboardComponent
  ]
})
export class DashboardModule { }
