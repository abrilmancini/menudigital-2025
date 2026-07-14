import { inject, Injectable } from '@angular/core';
import { Auth } from './auth';
import { NewUser, User } from '../interfaces/user';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  authService = inject(Auth);

  readonly URL_BASE = 'https://localhost:56740/api/users';

  users: User[] = [];

  async getUsers() {
    const res = await fetch(this.URL_BASE);

    if (res.ok) {
      const data: User[] = await res.json();
      this.users = data;
    }
  }

  /** Obtener restaurante por ID */
  async getUserById(id: string | number) {
    const res = await fetch(`${this.URL_BASE}/${id}`);

    if (!res.ok) return null;

    return await res.json() as User;
  }

  /** Registrar restaurante (signup) */
  async register(user: NewUser) {
    const res = await fetch(this.URL_BASE, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(user),
    });

    return res.ok;
  }

  /** Obtener el usuario actualmente autenticado (endpoint /me del backend) */
  async getCurrentUser() {
    if (!this.authService.token) return null;

    const res = await fetch(`${this.URL_BASE}/me`, {
      headers: {
        Authorization: 'Bearer ' + this.authService.token,
      }
    });

    if (!res.ok) return null;

    return await res.json() as User;
  }

  /** Editar restaurante */
  async editUser(user: User, password: string) {
    const res = await fetch(`${this.URL_BASE}/${user.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + this.authService.token,
      },
      body: JSON.stringify({
        restaurantName: user.restaurantName,
        email: user.email,
        password
      }),
    });

    if (!res.ok) return null;

    this.users = this.users.map(u =>
      u.id === user.id ? user : u
    );

    return user;
  }

  /** Eliminar restaurante */
  async deleteUser(id: number) {
    const res = await fetch(`${this.URL_BASE}/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: 'Bearer ' + this.authService.token,
      },
    });

    if (!res.ok) return false;

    this.users = this.users.filter(u => u.id !== id);

    return true;
  }

  async getRestaurants() {
    const res = await fetch(`${this.URL_BASE}/restaurants`);

    if (!res.ok) {
      return [];
    }

    return await res.json();
  }

}