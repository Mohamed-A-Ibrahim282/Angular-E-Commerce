import { isPlatformBrowser } from '@angular/common';
import { Component, inject, OnInit, PLATFORM_ID } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { CartService } from '../../core/services/cart/cart.service';
import { WishlistService } from '../../core/services/wishlist/wishlist.service';
import { ToastErrorComponent } from '../../shared/components/ui/toast/toast-error/toast-error.component';
import { ToastSuccessComponent } from '../../shared/components/ui/toast/toast-success/toast-success.component';
import { IProducts } from '../../shared/interfaces/products/iproducts';
import { SplitPipe } from '../../shared/pipes/split.pipe';

@Component({
  selector: 'app-wishlist',
  imports: [RouterLink, TranslatePipe, SplitPipe, ToastSuccessComponent, ToastErrorComponent],
  templateUrl: './wishlist.component.html',
  styleUrl: './wishlist.component.scss'
})
export class WishlistComponent implements OnInit {

  private readonly wishlistService = inject(WishlistService)
  private readonly cartService = inject(CartService)
  private readonly platformId = inject(PLATFORM_ID)

  wishlistItems: IProducts[] = [];
  removingId: string | null = null;
  isLoading = false;
  successMessage = '';
  errorMessage = '';

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.loggedUserWishlist()
    }
  }

  loggedUserWishlist(): void {
    this.wishlistService.getLoggedUserWishlist().subscribe({
      next: (res) => {
        this.wishlistItems = res.data;
      }
    })
  }

  removeFromWishlist(id: string): void {
    this.removingId = id;
    this.wishlistService.setRemoveFromWishlist(id).subscribe({
      next: () => {
        this.wishlistItems = this.wishlistItems.filter(product => product._id !== id);
        this.removingId = null;
      },
      error: () => {
        this.removingId = null;
      }
    })
  }

  addToCart(id: string): void {
    this.isLoading = true;
    this.cartService.addProductToCart(id).subscribe({
      next: (res) => {
        this.successMessage = res.message;
        this.isLoading = false;
        setTimeout(() => this.successMessage = '', 1000);
      },
      error: (err) => {
        this.errorMessage = err.error?.message;
        this.isLoading = false;
        setTimeout(() => this.errorMessage = '', 1000);
      }
    })
  }
}
