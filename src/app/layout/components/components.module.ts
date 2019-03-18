import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { PageHeaderModule } from '../../shared';
import { FormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/material-modules';
import { ProfileUpdateComponent } from './profile-update/profile-update.component';

@NgModule({
  declarations: [ProfileUpdateComponent],
  imports: [
    CommonModule,
    FormsModule,
    MaterialModule,
    NgbModule,
    PageHeaderModule
  ],
  exports: [ProfileUpdateComponent],
  entryComponents: [ProfileUpdateComponent]
})
export class ComponentsModule {}
