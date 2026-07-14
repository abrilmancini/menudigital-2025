import { Component, inject, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';

import { Auth } from '../../services/auth';
import { UsersService } from '../../services/user.service';

@Component({
  selector: 'app-restaurants-page',
  imports: [RouterModule],
  templateUrl: './restaurants-page.html',
  styleUrl: './restaurants-page.scss'
})
export class RestaurantsPage implements OnInit {

  readonly authService = inject(Auth);
  readonly usersService = inject(UsersService);

  cargando = true;

  async ngOnInit() {
    this.usersService.users = await this.usersService.getRestaurants();
    this.cargando = false;
  }
}