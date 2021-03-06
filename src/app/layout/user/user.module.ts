import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { PageHeaderModule } from '../../shared';
import { UserRoutingModule } from './user-routing.module';
import { UserComponent } from './user.component';
import { UserListComponent } from './user-list/user-list.component';
import { UserCreateComponent } from './user-create/user-create.component';
import { FormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/material-modules';
import { UserModifyComponent } from './user-modify/user-modify.component';

@NgModule({
  declarations: [
    UserComponent,
    UserCreateComponent,
    UserListComponent,
    UserModifyComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    MaterialModule,
    NgbModule,
    PageHeaderModule,
    UserRoutingModule
  ],
  exports: [UserCreateComponent, UserModifyComponent],
  entryComponents: [UserCreateComponent, UserModifyComponent]
})
export class UserModule {}
