import { isPlatformBrowser } from '@angular/common';
import { Component, inject, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { catchError, forkJoin, of, switchMap } from 'rxjs';
import { BrandsService } from '../../core/services/brands/brands.service';
import { CartService } from '../../core/services/cart/cart.service';
import { ProductsService } from '../../core/services/products/products.service';
import { WishlistService } from '../../core/services/wishlist/wishlist.service';
import { ToastErrorComponent } from '../../shared/components/ui/toast/toast-error/toast-error.component';
import { ToastSuccessComponent } from '../../shared/components/ui/toast/toast-success/toast-success.component';
import { Category, IProducts } from '../../shared/interfaces/products/iproducts';
import { SplitPipe } from '../../shared/pipes/split.pipe';

@Component({
  selector: 'app-brand-products',
  imports: [RouterLink, ToastSuccessComponent, ToastErrorComponent, SplitPipe, TranslatePipe],
  templateUrl: './brand-products.component.html',
  styleUrl: './brand-products.component.scss'
})
export class BrandProductsComponent {
  private readonly brandsService = inject(BrandsService)
  private readonly activatedRoute = inject(ActivatedRoute)
  private readonly productsService = inject(ProductsService)
  private readonly cartService = inject(CartService)
  private readonly wishlistService = inject(WishlistService)
  private readonly platformId = inject(PLATFORM_ID)

  brandId: string = '';
  brandData: Category = {} as Category;
  brandProducts: IProducts[] = [];
  isLoading: boolean = false;
  successMessage: string = "";
  errorMessage: string = "";

  wishlistItems: IProducts[] = [];
  addedToWishlist: boolean = false;
  removingId: string | null = null;

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.finalProductsList()
    }
  }

  finalProductsList(): void {
    this.activatedRoute.paramMap.pipe(
      switchMap(param => {
        this.brandId = param.get('id')!;
        return forkJoin({
          brand: this.brandsService.getSpecificlBrand(this.brandId),
          products: this.productsService.getAllProducts(),
          wishlistProducts: this.wishlistService.getLoggedUserWishlist().pipe(catchError(() => of({ data: [] })))
        });
      })
    ).subscribe({
      next: ({ brand, products, wishlistProducts }) => {
        const wishlistIds = wishlistProducts.data.map((item: IProducts) => item._id)
        this.brandData = brand.data;
        this.brandProducts = products.data.filter(
          (product: IProducts) => product.brand?._id === this.brandId
        ).map((product: IProducts) => ({
          ...product,
          addedToWishlist: wishlistIds.includes(product._id)
        }));;
      }
    });
  }

  addToCart(id: string): void {
    this.isLoading = true;
    this.cartService.addProductToCart(id).subscribe({
      next: (res) => {
        this.isLoading = false;
        this.successMessage = res.message
        setTimeout(() => {
          this.successMessage = ""
        }, 1500);
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.message
        setTimeout(() => {
          this.errorMessage = ""
        }, 1500);
      }
    })
  }

  addToWishlist(id: string): void {
    this.wishlistService.setAddToWishlist(id).subscribe({
      next: (res) => {
        this.isLoading = false;
        this.successMessage = res.message;
        this.addedToWishlist = true;
        this.finalProductsList();
        setTimeout(() => {
          this.successMessage = ""
        }, 1500);
      }
    })
  }

  removeFromWishlist(id: string): void {
    this.removingId = id;
    this.wishlistService.setRemoveFromWishlist(id).subscribe({
      next: () => {
        this.wishlistItems = this.wishlistItems.filter(product => product._id !== id);
        this.removingId = null;
        this.finalProductsList();
      },
      error: () => {
        this.removingId = null;
      }
    })
  }
}
