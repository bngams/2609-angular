import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { AuthRoutingModule } from './auth-routing-module';
import { MaterialModule } from '../../material-module';
import { Login } from './pages/login/login';
import { LoginForm } from './components/login-form/login-form';

@NgModule({
  declarations: [Login, LoginForm],
  imports: [CommonModule, ReactiveFormsModule, AuthRoutingModule, MaterialModule],
})
export class AuthModule {}
