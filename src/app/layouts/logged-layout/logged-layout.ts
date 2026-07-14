import { Component, inject } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';

import Swal from 'sweetalert2';

import { Auth } from '../../services/auth';

@Component({
  selector: 'app-logged-layout',
  imports: [RouterOutlet, RouterModule],
  templateUrl: './logged-layout.html',
  styleUrl: './logged-layout.scss'
})
export class LoggedLayout {

  readonly authService = inject(Auth);

  showLogoutModal() {

    Swal.fire({
      title: '¿Desea cerrar sesión?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Cerrar sesión',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: 'var(--color-error)'
    }).then(result => {

      if (result.isConfirmed) {
        this.authService.logout();
      }

    });

  }

}