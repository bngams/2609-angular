import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth';
import { Credentials, LoginForm } from '../../components/login-form/login-form';

@Component({
  selector: 'app-login',
  imports: [LoginForm],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  private auth = inject(AuthService);
  private router = inject(Router);

  readonly error = signal<string | null>(null);

  onConnected(credentials: Credentials): void {
    const ok = this.auth.login(credentials.username, credentials.password);
    if (ok) {
      this.router.navigate(['/products']);
    } else {
      this.error.set('Identifiants invalides.');
    }
  }
}
