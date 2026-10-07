import { Component, inject, OnInit } from '@angular/core';
import { BrandsService } from '../../core/services/brands/brands.service';
import { Category, IProducts } from '../../shared/interfaces/products/iproducts';
import { RouterLink } from '@angular/router';
import { ProductsService } from '../../core/services/products/products.service';
import { forkJoin } from 'rxjs';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-brands',
  imports: [RouterLink, TranslatePipe],
  templateUrl: './brands.component.html',
  styleUrl: './brands.component.scss'
})
export class BrandsComponent implements OnInit {

  private readonly brandsService = inject(BrandsService)
  private readonly productsService = inject(ProductsService)
  brands: Category[] = [];
  products: IProducts[] = []
  brandsWithProducts: Category[] = [];


  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    forkJoin({
      brands: this.brandsService.getAllBrands(),
      products: this.productsService.getAllProducts()
    }).subscribe({
      next: ({ brands, products }) => {
        this.brands = brands.data;
        this.products = products.data;
        this.getBrandsWithProducts();
      },
    });
  }

  getBrandsWithProducts(): void {
    const brandIds = new Set(this.products.map(p => p.brand._id));
    this.brandsWithProducts = this.brands.filter(b => brandIds.has(b._id));
  }
}
