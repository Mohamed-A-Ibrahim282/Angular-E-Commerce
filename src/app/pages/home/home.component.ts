import { Component, inject, OnInit, PLATFORM_ID } from '@angular/core';
import { ProductsService } from '../../core/services/products/products.service';
import { IProducts } from '../../shared/interfaces/products/iproducts';
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';
import { CategoriesService } from '../../core/services/categories/categories.service';
import { ICategories } from '../../shared/interfaces/categories/icategories';
import { RouterLink } from '@angular/router';
import { SplitPipe } from '../../shared/pipes/split.pipe';
import { CartService } from '../../core/services/cart/cart.service';
import { ToastSuccessComponent } from '../../shared/components/ui/toast/toast-success/toast-success.component';
import { ToastErrorComponent } from '../../shared/components/ui/toast/toast-error/toast-error.component';
import { TranslatePipe } from '@ngx-translate/core';
import { WishlistService } from '../../core/services/wishlist/wishlist.service';
import { catchError, forkJoin, of } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-home',
  imports: [CarouselModule, RouterLink, SplitPipe, ToastSuccessComponent, ToastErrorComponent, TranslatePipe],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {

  private readonly productsService = inject(ProductsService)
  private readonly categoriesService = inject(CategoriesService)
  private readonly cartService = inject(CartService)
  private readonly wishlistService = inject(WishlistService)
  private readonly platformId = inject(PLATFORM_ID)


  products: IProducts[] = []
  categories: ICategories[] = []

  bannerSlideOptions: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: false,
    dots: false,
    rtl: true,
    autoplay: true,
    autoplaySpeed: 1500,
    navSpeed: 700,
    items: 1,
    nav: false
  }

  bannerImgSrc: string[] = [
    '/images/img1.avif',
    '/images/img2.avif',
    '/images/img3.avif',
    '/images/img4.avif',
    '/images/img5.avif',
    '/images/img6.avif',
  ]

  categorySlideOptions: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: false,
    dots: false,
    rtl: true,
    navSpeed: 700,
    autoplay: true,
    autoplaySpeed: 1000,
    navText: ['<i class="fas fa-arrow-right"></i>', '<i class="fas fa-arrow-left"></i>'],
    responsive: {
      0: {
        items: 1
      },
      400: {
        items: 2
      },
      740: {
        items: 4
      },
      940: {
        items: 6
      }
    },
    nav: true
  }

  isLoading: boolean = false;
  successMessage: string = "";
  errorMessage: string = "";
  addedToWishlist: boolean = false;

  wishlistItems: IProducts[] = [];
  removingId: string | null = null;

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.allCategories()
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

  allCategories(): void {
    this.categoriesService.getAllCategories().subscribe({
      next: (res) => this.categories = res.data,
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
