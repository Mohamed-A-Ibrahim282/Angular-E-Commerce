import { Component, inject, OnInit, PLATFORM_ID } from '@angular/core';
import { ProductsService } from '../../core/services/products/products.service';
import { IProducts } from '../../shared/interfaces/products/iproducts';
import { RouterLink } from '@angular/router';
import { SplitPipe } from '../../shared/pipes/split.pipe';
import { CartService } from '../../core/services/cart/cart.service';
import { ToastSuccessComponent } from '../../shared/components/ui/toast/toast-success/toast-success.component';
import { ToastErrorComponent } from '../../shared/components/ui/toast/toast-error/toast-error.component';
import { TranslatePipe } from '@ngx-translate/core';
import { catchError, forkJoin, of } from 'rxjs';
import { WishlistService } from '../../core/services/wishlist/wishlist.service';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-products',
  imports: [RouterLink, SplitPipe, ToastSuccessComponent, ToastErrorComponent, TranslatePipe],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss'
})
export class ProductsComponent implements OnInit {

  private readonly productsService = inject(ProductsService)
  private readonly cartService = inject(CartService)
  private readonly wishlistService = inject(WishlistService)
  private readonly platformId = inject(PLATFORM_ID)

  products: IProducts[] = []
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
    forkJoin({
      allProducts: this.productsService.getAllProducts(),
      wishlistProducts: this.wishlistService.getLoggedUserWishlist().pipe(catchError(() => of({ data: [] })))
    }).subscribe({
      next: ({ allProducts, wishlistProducts }) => {
        const wishlistIds = wishlistProducts.data.map((item: IProducts) => item._id)

        this.products = allProducts.data.map((product: IProducts) => ({
          ...product,
          addedToWishlist: wishlistIds.includes(product._id)
        }));
      }
    })
  }

  allProducts() {
    this.productsService.getAllProducts().subscribe({
      next: (res) => {
        this.products = res.data
      },
    })
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
