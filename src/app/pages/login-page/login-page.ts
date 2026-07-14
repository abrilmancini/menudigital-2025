import { Component, inject } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

import { Auth } from '../../services/auth';
import { Spinner } from '../../components/spinner/spinner';

@Component({
  selector: 'app-login-page',
  imports: [RouterModule, FormsModule, Spinner],
  templateUrl: './login-page.html',
  styleUrl: './login-page.scss'
})
export class LoginPage {

  readonly authService = inject(Auth);
  readonly router = inject(Router);

  solicitudABackEnCurso = false;
  errorLogin = false;

  async login(form: NgForm) {

    this.errorLogin = false;

    if (form.invalid) {
      return;
    }

    this.solicitudABackEnCurso = true;

    try {

      const loginResult = await this.authService.login(form.value);

      if (loginResult) {
        this.router.navigate(['/']);
        return;
      }

      this.errorLogin = true;

    } catch (error) {

      console.error(error);
      this.errorLogin = true;

    } finally {

      this.solicitudABackEnCurso = false;

    }

  }

}