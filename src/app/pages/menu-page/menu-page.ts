import { Component, inject, input, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Product } from '../../interfaces/product';
import { Category } from '../../interfaces/category';
import { ProductService } from '../../services/product.service';
import { CategoryService } from '../../services/category.service';
import { UsersService } from '../../services/user.service';

@Component({
  selector: 'app-menu-page',
  imports: [RouterModule],
  templateUrl: './menu-page.html',
  styleUrl: './menu-page.scss'
})
export class MenuPage implements OnInit {

  id = input.required<string>();

  readonly productService = inject(ProductService);
  readonly categoryService = inject(CategoryService);
  readonly usersService = inject(UsersService);

  restaurantName = 'Menú del restaurante';

  cargandoRestaurant = true;

  categories: Category[] = [];
  products: Product[] = [];

  async ngOnInit() {

    const [categories, products, restaurant] = await Promise.all([
      this.categoryService.getCategoriesByRestaurant(this.id()),
      this.productService.getProductsByRestaurantPublic(this.id()),
      this.usersService.getUserById(this.id())
    ]);

    this.categories = categories;
    this.products = products;

    if (restaurant) {
      this.restaurantName = restaurant.restaurantName;
    }

    this.cargandoRestaurant = false;
  }

  restaurantCategories(): Category[] {
    return this.categories;
  }

  productsByCategory(categoryId: number): Product[] {
    return this.products.filter(
      product => product.categoryId === categoryId
    );
  }

}