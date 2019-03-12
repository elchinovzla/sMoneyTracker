import { NgModule } from '@angular/core';
import { LoginComponent } from './login/login.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthRoutingModule } from './auth-routing.module';
import { MaterialModule } from '../material-modules';

@NgModule({
  declarations: [LoginComponent],
  imports: [MaterialModule, CommonModule, FormsModule, AuthRoutingModule]
})
export class AuthModule {}
