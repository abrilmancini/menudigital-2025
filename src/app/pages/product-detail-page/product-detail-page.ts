import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';

import { Product } from '../../interfaces/product';
import { ProductService } from '../../services/product.service';

@Component({
    selector: 'app-product-detail-page',
    imports: [RouterModule],
    templateUrl: './product-detail-page.html',
    styleUrl: './product-detail-page.scss'
})
export class ProductDetailPage implements OnInit {
    readonly route = inject(ActivatedRoute);
    readonly productService = inject(ProductService);
    product: Product | null = null;
    cargando = true;
    async ngOnInit() {
        const id = this.route.snapshot.paramMap.get('id');
        if (id) {
            this.product = await this.productService.getProductById(id);
        }
        this.cargando = false;
    }
}