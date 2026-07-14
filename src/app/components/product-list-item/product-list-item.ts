import { Component, inject, input } from '@angular/core';
import { RouterModule } from '@angular/router';
import Swal from 'sweetalert2';

import { Product } from '../../interfaces/product';
import { ProductService } from '../../services/product.service';
import { Toast } from '../../utils/modals';

@Component({
  selector: 'app-product-list-item',
  imports: [RouterModule],
  templateUrl: './product-list-item.html',
  styleUrls: ['./product-list-item.scss']
})
export class ProductListItem {

  index = input.required<number>();
  producto = input.required<Product>();

  productService = inject(ProductService);

  showDeleteModal() {
    Swal.fire({
      title: 'Borrar producto',
      text: 'El borrado es permanente. ¿Está seguro?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Borrar definitivamente'
    }).then(async (result) => {

      if (result.isConfirmed) {

        const res = await this.productService.deleteProduct(this.producto().id);

        if (res) {
          Toast.fire({
            icon: 'success',
            title: 'Producto eliminado'
          });
        }

      }

    });
  }

  async editDiscount() {

    const { value: discount, isConfirmed } = await Swal.fire({
      title: 'Editar descuento',
      input: 'number',
      inputLabel: 'Porcentaje de descuento (0-100)',
      inputValue: this.producto().discount,
      showCancelButton: true,
      confirmButtonText: 'Guardar',
      cancelButtonText: 'Cancelar',
      inputValidator: (value) => {
        const n = Number(value);
        if (value === '' || isNaN(n) || n < 0 || n > 100) {
          return 'Ingresá un número entre 0 y 100';
        }
        return null;
      }
    });

    if (!isConfirmed) return;

    const res = await this.productService.updateDiscount(this.producto().id, Number(discount));

    if (res) {
      Toast.fire({
        icon: 'success',
        title: 'Descuento actualizado'
      });
    }

  }

  async toggleHappyHour() {

    const nuevoEstado = !this.producto().happyHour;

    const res = await this.productService.toggleHappyHour(this.producto().id, nuevoEstado);

    if (res) {
      Toast.fire({
        icon: 'success',
        title: nuevoEstado ? 'Happy hour activado' : 'Happy hour desactivado'
      });
    }

  }

}
