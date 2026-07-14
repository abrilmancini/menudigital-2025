import { Component, inject, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';

import { CategoryService } from '../../services/category.service';
import { Category } from '../../interfaces/category';

@Component({
  selector: 'app-categories-page',
  imports: [FormsModule],
  templateUrl: './categories-page.html',
  styleUrl: './categories-page.scss'
})
export class CategoriesPage implements OnInit {

  readonly categoryService = inject(CategoryService);

  cargando = true;
  guardando = false;

  editingCategory: Category | null = null;

  formModel = {
    name: '',
    description: ''
  };

  async ngOnInit() {
    await this.categoryService.getCategories();
    this.cargando = false;
  }

  startEdit(category: Category) {
    this.editingCategory = category;
    this.formModel = {
      name: category.name,
      description: category.description
    };
  }

  cancelEdit(form: NgForm) {
    this.editingCategory = null;
    this.formModel = { name: '', description: '' };
    form.resetForm();
  }

  async submitCategory(form: NgForm) {

    if (form.invalid) return;

    this.guardando = true;

    try {

      if (this.editingCategory) {

        await this.categoryService.editCategory({
          ...this.editingCategory,
          name: this.formModel.name,
          description: this.formModel.description
        });

      } else {

        await this.categoryService.createCategory({
          name: this.formModel.name,
          description: this.formModel.description
        });

      }

      this.editingCategory = null;
      this.formModel = { name: '', description: '' };
      form.resetForm();

    } finally {
      this.guardando = false;
    }

  }

  async deleteCategory(id: number) {

    const confirmar = confirm(
      '¿Está seguro que desea eliminar esta categoría?'
    );

    if (!confirmar) return;

    await this.categoryService.deleteCategory(id);

    if (this.editingCategory?.id === id) {
      this.editingCategory = null;
      this.formModel = { name: '', description: '' };
    }

  }

}