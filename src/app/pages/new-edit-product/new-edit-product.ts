import { Component, inject, input, OnInit, viewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';

import { Product, NewProduct } from '../../interfaces/product';
import { ProductService } from '../../services/product.service';
import { CategoryService } from '../../services/category.service';

import { Spinner } from '../../components/spinner/spinner';

@Component({
  selector: 'app-new-edit-product',
  imports: [FormsModule, Spinner],
  templateUrl: './new-edit-product.html',
  styleUrl: './new-edit-product.scss'
})
export class NewEditProduct implements OnInit {

  readonly productService = inject(ProductService);
  readonly categoryService = inject(CategoryService);
  readonly router = inject(Router);

  id = input<string>();

  form = viewChild<NgForm>('newProductForm');

  errorEnBack = false;
  solicitudABackEnCurso = false;

  productBack?: Product;

  async ngOnInit() {

    await this.categoryService.getCategories();

    if (!this.id()) return;

    try {

      const product = await this.productService.getProductById(this.id()!);

      if (!product) return;

      this.productBack = product;

      this.form()?.setValue({
        name: product.name,
        description: product.description,
        price: product.price,
        imageUrl: product.imageUrl,
        categoryId: product.categoryId,
        featured: product.featured,
        happyHour: product.happyHour,
        happyHourStart: product.happyHourStart ?? '',
        happyHourEnd: product.happyHourEnd ?? '',
        discount: product.discount
      });

    } catch (error) {
      console.error(error);
    }
  }

  async handleFormSubmission(form: NgForm) {

    this.errorEnBack = false;
    this.solicitudABackEnCurso = true;

    const newProduct: NewProduct = {
      name: form.value.name,
      description: form.value.description,
      price: Number(form.value.price),
      imageUrl: form.value.imageUrl,
      categoryId: Number(form.value.categoryId),
      featured: !!form.value.featured,
      happyHour: !!form.value.happyHour,
      happyHourStart: form.value.happyHourStart || null,
      happyHourEnd: form.value.happyHourEnd || null,
      discount: Number(form.value.discount) || 0
    };

    try {

      let result;

      if (this.id()) {

        result = await this.productService.editProduct({
          ...newProduct,
          id: this.productBack!.id,
          userId: this.productBack!.userId
        });

      } else {

        result = await this.productService.createProduct(newProduct);

      }

      if (!result) {

        this.errorEnBack = true;
        return;

      }

      this.router.navigate(['/dashboard/products']);

    } catch (error) {

      console.error(error);
      this.errorEnBack = true;

    } finally {

      this.solicitudABackEnCurso = false;

    }

  }

}