import { Component, inject, input, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';

import { Product } from '../../interfaces/product';
import { ProductService } from '../../services/product.service';

@Component({
    selector: 'app-product-detail-page',
    imports: [RouterModule],
    templateUrl: './product-detail-page.html',
    styleUrl: './product-detail-page.scss'
})
export class ProductDetailPage implements OnInit {
    id = input.required<string>();

    readonly productService = inject(ProductService);
    product: Product | null = null;
    cargando = true;

    async ngOnInit() {
        this.product = await this.productService.getProductById(this.id());
        this.cargando = false;
    }
}