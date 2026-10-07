import { Component, inject, OnInit, PLATFORM_ID } from '@angular/core';
import { ProductsService } from '../../core/services/products/products.service';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { IProducts } from '../../shared/interfaces/products/iproducts';
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';
import { CartService } from '../../core/services/cart/cart.service';
import { ToastSuccessComponent } from '../../shared/components/ui/toast/toast-success/toast-success.component';
import { ToastErrorComponent } from '../../shared/components/ui/toast/toast-error/toast-error.component';
import { SplitPipe } from '../../shared/pipes/split.pipe';
import { TranslatePipe } from '@ngx-translate/core';
import { WishlistService } from '../../core/services/wishlist/wishlist.service';
import { catchError, forkJoin, map, of, switchMap } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-product-details',
  imports: [CarouselModule, ToastSuccessComponent, ToastErrorComponent, RouterLink, SplitPipe, TranslatePipe],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.scss'
})
export class ProductDetailsComponent implements OnInit {

  private readonly productsService = inject(ProductsService);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly cartService = inject(CartService)
  private readonly wishlistService = inject(WishlistService)
  private readonly platformId = inject(PLATFORM_ID)

  productDetails: IProducts | null = null;

  productOptions: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: false,
    dots: false,
    autoplay: true,
    rtl: true,
    autoplaySpeed: 1500,
    navSpeed: 700,
    items: 1,
    nav: true,
    navText: ['', '']
  }

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
    this.activatedRoute.paramMap.pipe(
      map(params => params.get('id')!),
      switchMap(id => forkJoin({
        product: this.productsService.getSpecificProducts(id),
        wishlist: this.wishlistService.getLoggedUserWishlist().pipe(
          catchError(() => of({ data: [] }))
        )
      }))
    ).subscribe({
      next: ({ product, wishlist }) => {
        const wishlistIds = new Set<string>(wishlist.data.map((item: IProducts) => item._id));

        this.productDetails = {
          ...product.data,
          addedToWishlist: wishlistIds.has(product.data._id)
        };
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
