import { Injectable, computed, signal } from '@angular/core';

const STORAGE_KEY = 'demo-session';

@Injectable({ providedIn: 'root' })
export class AuthService {
  /** Utilisateur courant, rechargé depuis le stockage au démarrage. */
  private readonly user = signal<string | null>(localStorage.getItem(STORAGE_KEY));

  readonly currentUser = this.user.asReadonly();
  readonly isLoggedIn = computed(() => this.user() !== null);

  /** Connexion simulée : aucun vrai backend d'authentification ici. */
  login(username: string, password: string): boolean {
    if (!username || !password) {
      return false;
    }
    localStorage.setItem(STORAGE_KEY, username);
    this.user.set(username);
    return true;
  }

  logout(): void {
    localStorage.removeItem(STORAGE_KEY);
    this.user.set(null);
  }
}
