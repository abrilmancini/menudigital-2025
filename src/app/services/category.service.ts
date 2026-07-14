import { inject, Injectable } from '@angular/core';
import { Category, NewCategory } from '../interfaces/category';
import { Auth } from './auth';

@Injectable({
    providedIn: 'root'
})
export class CategoryService {

    authService = inject(Auth);

    readonly URL_BASE = 'https://localhost:56740/api/categories';

    categories: Category[] = [];

    async createCategory(newCategory: NewCategory) {
        const res = await fetch(this.URL_BASE, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + this.authService.token
            },
            body: JSON.stringify(newCategory)
        });

        if (!res.ok) return;

        const data: Category = await res.json();

        this.categories.push(data);

        return data;
    }

    async editCategory(category: Category) {
        const res = await fetch(`${this.URL_BASE}/${category.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + this.authService.token
            },
            body: JSON.stringify(category)
        });

        if (!res.ok) return null;

        // El backend responde 204 No Content: actualizamos con lo que mandamos.
        this.categories = this.categories.map(c =>
            c.id === category.id ? category : c
        );

        return category;
    }

    async deleteCategory(id: number) {
        const res = await fetch(`${this.URL_BASE}/${id}`, {
            method: 'DELETE',
            headers: {
                Authorization: 'Bearer ' + this.authService.token
            }
        });

        if (!res.ok) return false;

        this.categories = this.categories.filter(c => c.id !== id);

        return true;
    }

    async getCategories() {
        const res = await fetch(this.URL_BASE, {
            headers: {
                Authorization: 'Bearer ' + this.authService.token
            }
        });

        if (res.ok) {
            const data: Category[] = await res.json();
            this.categories = data;
        }
    }

    /** Categorías de un restaurante puntual (endpoint público, para el menú) */
    async getCategoriesByRestaurant(userId: number | string) {
        const res = await fetch(`${this.URL_BASE}/restaurant/${userId}`);

        if (!res.ok) return [];

        return await res.json() as Category[];
    }

    async getCategoryById(id: string | number) {
        const res = await fetch(`${this.URL_BASE}/${id}`);

        if (!res.ok) return null;

        return await res.json() as Category;
    }
}