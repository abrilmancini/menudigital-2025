import { inject, Injectable } from '@angular/core';
import { Product, NewProduct } from '../interfaces/product';
import { Auth } from './auth';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  authService = inject(Auth);

  readonly URL_BASE = 'https://localhost:56740/api/products';

  /** Lista de productos en memoria */
  products: Product[] = [];

  /** Crear producto */
  async createProduct(newProduct: NewProduct) {
    const res = await fetch(this.URL_BASE, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + this.authService.token,
      },
      body: JSON.stringify(newProduct)
    });

    if (!res.ok) return;

    const product: Product = await res.json();

    this.products.push(product);

    return product;
  }

  /** Eliminar producto */
  async deleteProduct(id: number) {
    const res = await fetch(`${this.URL_BASE}/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: 'Bearer ' + this.authService.token,
      },
    });

    if (!res.ok) return;

    this.products = this.products.filter(product => product.id !== id);

    return true;
  }

  /** Editar producto */
  async editProduct(product: Product) {
    const res = await fetch(`${this.URL_BASE}/${product.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + this.authService.token,
      },
      body: JSON.stringify(product)
    });

    if (!res.ok) return;

    this.products = this.products.map(oldProduct => {
      if (oldProduct.id === product.id) return product;
      return oldProduct;
    });

    return product;
  }

  /** Editar solo el descuento de un producto — endpoint propio */
  async updateDiscount(id: number, discount: number) {
    const res = await fetch(`${this.URL_BASE}/${id}/discount`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + this.authService.token,
      },
      body: JSON.stringify({ discount })
    });

    if (!res.ok) return null;

    // El backend responde 204 No Content: no hay body para parsear,
    // actualizamos el estado local con el valor que ya mandamos.
    this.products = this.products.map(product =>
      product.id === id ? { ...product, discount } : product
    );

    return true;
  }

  /** Habilitar/deshabilitar happy hour — endpoint propio */
  async toggleHappyHour(id: number, happyHour: boolean) {
    const res = await fetch(`${this.URL_BASE}/${id}/happyhour`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + this.authService.token,
      },
      body: JSON.stringify({ happyHour })
    });

    if (!res.ok) return null;

    // Ídem: 204 No Content, sin body.
    this.products = this.products.map(product =>
      product.id === id ? { ...product, happyHour } : product
    );

    return true;
  }

  /** Obtener todos los productos (endpoint público, sin auth) */
  async getProducts() {
    const res = await fetch(this.URL_BASE);

    if (res.ok) {
      const products: Product[] = await res.json();
      this.products = products;
    }
  }

  /** Productos del restaurante logueado (dashboard, requiere token) */
  async getProductsByRestaurant(userId: number) {
    const res = await fetch(`${this.URL_BASE}/restaurant/${userId}`, {
      method: 'GET',
      headers: {
        Authorization: 'Bearer ' + this.authService.token,
      }
    });

    if (res.ok) {
      const products: Product[] = await res.json();
      this.products = products;
    }
  }

  /** Productos de un restaurante puntual (endpoint público, para el menú) */
  async getProductsByRestaurantPublic(userId: number | string) {
    const res = await fetch(`${this.URL_BASE}/restaurant/${userId}`);

    if (!res.ok) return [];

    return await res.json() as Product[];
  }

  /** Obtener producto por ID (endpoint público, sin auth) */
  async getProductById(id: string | number) {
    const res = await fetch(`${this.URL_BASE}/${id}`);

    if (res.ok) {
      const product: Product = await res.json();
      return product;
    }

    return null;
  }

}