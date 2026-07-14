import { Component, inject } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Spinner } from '../../components/spinner/spinner';
import { NewUser } from '../../interfaces/user';
import { UsersService } from '../../services/user.service';

@Component({
  selector: 'app-register',
  imports: [FormsModule, RouterLink,Spinner],
  templateUrl: './register.html',
  styleUrl: './register.scss'
})
export class RegisterPage {

  readonly userService = inject(UsersService);
  readonly router = inject(Router);

  isLoading = false;
  errorRegister = false;

  async register(form: NgForm) {

    this.errorRegister = false;

    if (form.invalid) return;

    if (form.value.password !== form.value.password2) {
      this.errorRegister = true;
      return;
    }

    const user: NewUser = {
      restaurantName: form.value.restaurantName,
      email: form.value.email,
      password: form.value.password
    };

    this.isLoading = true;

    try {

      const ok = await this.userService.register(user);

      if (ok) {
        this.router.navigate(['/login']);
        return;
      }

      this.errorRegister = true;

    } catch {

      this.errorRegister = true;

    } finally {

      this.isLoading = false;

    }

  }

}