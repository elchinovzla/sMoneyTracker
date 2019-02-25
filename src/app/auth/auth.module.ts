import { NgModule } from '@angular/core';
import { LoginComponent } from './login/login.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthRoutingModule } from './auth-routing.module';
import { MaterialModule } from '../material-modules';
import { RegistrationComponent } from './registration/registration.component';

@NgModule({
  declarations: [LoginComponent, RegistrationComponent],
  imports: [MaterialModule, CommonModule, FormsModule, AuthRoutingModule]
})
export class AuthModule {}
