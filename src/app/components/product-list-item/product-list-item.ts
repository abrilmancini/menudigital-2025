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

  async editHappyHour() {

    const producto = this.producto();

    const { value: formValues, isConfirmed } = await Swal.fire({
      title: 'Happy Hour',
      html: `
        <div style="text-align:left;">
          <label style="display:flex;align-items:center;gap:8px;margin-bottom:14px;">
            <input id="swal-happyhour-enabled" type="checkbox" ${producto.happyHour ? 'checked' : ''} style="width:18px;height:18px;">
            Habilitado
          </label>
          <label style="display:block;margin-bottom:4px;">Desde</label>
          <input id="swal-happyhour-start" type="time" value="${producto.happyHourStart ?? ''}" class="swal2-input" style="margin:0 0 10px;">
          <label style="display:block;margin-bottom:4px;">Hasta</label>
          <input id="swal-happyhour-end" type="time" value="${producto.happyHourEnd ?? ''}" class="swal2-input" style="margin:0;">
          <p style="font-size:0.8rem;color:#888;margin-top:10px;">
            Si dejás el horario vacío, el happy hour queda activo todo el tiempo mientras esté habilitado.
          </p>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: 'Guardar',
      cancelButtonText: 'Cancelar',
      preConfirm: () => {
        const enabled = (document.getElementById('swal-happyhour-enabled') as HTMLInputElement).checked;
        const start = (document.getElementById('swal-happyhour-start') as HTMLInputElement).value;
        const end = (document.getElementById('swal-happyhour-end') as HTMLInputElement).value;

        return {
          happyHour: enabled,
          happyHourStart: start || null,
          happyHourEnd: end || null
        };
      }
    });

    if (!isConfirmed || !formValues) return;

    const res = await this.productService.updateHappyHourSchedule(
      producto.id,
      formValues.happyHour,
      formValues.happyHourStart,
      formValues.happyHourEnd
    );

    if (res) {
      Toast.fire({
        icon: 'success',
        title: 'Happy hour actualizado'
      });
    }

  }

}