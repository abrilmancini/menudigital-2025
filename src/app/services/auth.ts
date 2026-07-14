import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { LoginData } from '../interfaces/auth';

@Injectable({
  providedIn: 'root'
})
export class Auth {

  token: string | null = localStorage.getItem('token');

  router = inject(Router);

  revisionTokenInterval: number | undefined;

  constructor() {
    // Si hay una sesión iniciada, comienza a revisar si el token vence
    if (this.token) {
      this.revisionTokenInterval = this.revisionToken();
    }
  }

  async login(loginData: LoginData) {
    const res = await fetch(
      'https://localhost:56740/api/authentication/authenticate',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(loginData)
      }
    );

    if (res.ok) {
      const data = await res.json();

      this.token = data.token;
      localStorage.setItem('token', data.token);

      this.revisionTokenInterval = this.revisionToken();
    }

    return res.ok;
  }

  logout() {
    localStorage.removeItem('token');
    this.token = null;

    if (this.revisionTokenInterval) {
      clearInterval(this.revisionTokenInterval);
    }

    this.router.navigate(['/login']);
  }

  get tokenClaims(): { [key: string]: any } | null {
    if (!this.token) return null;

    try {
      const base64Url = this.token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');

      const jsonPayload = decodeURIComponent(
        window
          .atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );

      return JSON.parse(jsonPayload);
    } catch {
      return null;
    }
  }

  get userId(): number | null {
    const claims = this.tokenClaims;
    if (!claims) return null;

    const possibleId = claims['nameid'] ?? claims['sub'] ?? claims['id'];
    const userId = Number(possibleId);

    return Number.isNaN(userId) ? null : userId;
  }

  /**
   * Revisa cada 10 minutos si el token sigue siendo válido.
   */
  revisionToken() {
    return window.setInterval(() => {
      if (!this.token) return;

      const base64Url = this.token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');

      const jsonPayload = decodeURIComponent(
        window
          .atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );

      const claims: { exp: number } = JSON.parse(jsonPayload);

      if (new Date(claims.exp * 1000) < new Date()) {
        this.logout();
      }
    }, 600000); // 10 minutos
  }
}