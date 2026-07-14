import { Component, inject, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { UsersService } from '../../services/user.service';
import { ProductService } from '../../services/product.service';
import { ProductListItem } from '../../components/product-list-item/product-list-item';

@Component({
    selector: 'app-products-page',
    imports: [RouterModule, ProductListItem],
    templateUrl: './products-page.html',
    styleUrl: './products-page.scss'
})
export class ProductsPage implements OnInit {
    readonly productService = inject(ProductService);
    readonly usersService = inject(UsersService);
    cargando = true;
    async ngOnInit() {
        const user = await this.usersService.getCurrentUser();
        if (user) {
            await this.productService.getProductsByRestaurant(user.id);
        }
        this.cargando = false;
    }
}