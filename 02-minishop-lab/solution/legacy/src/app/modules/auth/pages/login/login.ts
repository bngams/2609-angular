import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth';
import { Credentials } from '../../components/login-form/login-form';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  error: string | null = null;

  constructor(
    private auth: AuthService,
    private router: Router,
  ) {}

  onConnected(credentials: Credentials): void {
    const ok = this.auth.login(credentials.username, credentials.password);
    if (ok) {
      this.router.navigate(['/products']);
    } else {
      this.error = 'Identifiants invalides.';
    }
  }
}
