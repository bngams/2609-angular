import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map } from 'rxjs';

const STORAGE_KEY = 'demo-session';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly user = new BehaviorSubject<string | null>(localStorage.getItem(STORAGE_KEY));

  readonly currentUser$: Observable<string | null> = this.user.asObservable();
  readonly isLoggedIn$: Observable<boolean> = this.user.pipe(map((u) => u !== null));

  /** Lecture synchrone, utile à la garde de route. */
  get isLoggedIn(): boolean {
    return this.user.value !== null;
  }

  /** Connexion simulée : aucun vrai backend d'authentification ici. */
  login(username: string, password: string): boolean {
    if (!username || !password) {
      return false;
    }
    localStorage.setItem(STORAGE_KEY, username);
    this.user.next(username);
    return true;
  }

  logout(): void {
    localStorage.removeItem(STORAGE_KEY);
    this.user.next(null);
  }
}
