import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

import Swal from 'sweetalert2';

import { Auth } from '../../services/auth';
import { UsersService } from '../../services/user.service';
import { User } from '../../interfaces/user';

@Component({
    selector: 'app-profile-page',
    imports: [FormsModule],
    templateUrl: './profile-page.html',
    styleUrl: './profile-page.scss'
})
export class ProfilePage implements OnInit {
    readonly authService = inject(Auth);
    readonly userService = inject(UsersService);
    cargando = true;
    user: User = {
        id: 0,
        restaurantName: '',
        email: ''
    };
    password = '';
    async ngOnInit() {
        const currentUser = await this.userService.getCurrentUser();
        if (currentUser) {
            this.user = currentUser;
        }
        this.cargando = false;
    }

    async save() {
        const updatedUser = await this.userService.editUser(this.user, this.password);
        if (updatedUser) {
            this.password = '';
            await Swal.fire({
                icon: 'success',
                title: 'Perfil actualizado',
                timer: 1500,
                showConfirmButton: false
            });
            return;
        }
        Swal.fire({
            icon: 'error',
            title: 'No se pudo actualizar el perfil',
            text: 'Intenta nuevamente más tarde.'
        });
    }
    async deleteAccount() {
        const result = await Swal.fire({
            title: '¿Eliminar cuenta?',
            text: 'Esta acción no se puede deshacer.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        });
        if (!result.isConfirmed) return;
            const deleted = await this.userService.deleteUser(this.user.id);
            if (deleted) {
                this.authService.logout();
                return;
            }
            Swal.fire({
                icon: 'error',
                title: 'No se pudo eliminar la cuenta',
                text: 'Intenta nuevamente más tarde.'
            });
        }

}