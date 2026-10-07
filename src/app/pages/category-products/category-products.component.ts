import { Component, inject, OnInit, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { catchError, forkJoin, of, switchMap } from 'rxjs';
import { TranslatePipe } from '@ngx-translate/core';
import { CategoriesService } from '../../core/services/categories/categories.service';
import { ProductsService } from '../../core/services/products/products.service';
import { CartService } from '../../core/services/cart/cart.service';
import { IProducts } from '../../shared/interfaces/products/iproducts';
import { ICategories } from '../../shared/interfaces/categories/icategories';
import { SplitPipe } from '../../shared/pipes/split.pipe';
import { ToastSuccessComponent } from '../../shared/components/ui/toast/toast-success/toast-success.component';
import { ToastErrorComponent } from '../../shared/components/ui/toast/toast-error/toast-error.component';
import { WishlistService } from '../../core/services/wishlist/wishlist.service';

@Component({
  selector: 'app-category-products',
  imports: [RouterLink, TranslatePipe, SplitPipe, ToastSuccessComponent, ToastErrorComponent],
  templateUrl: './category-products.component.html',
  styleUrl: './category-products.component.scss'
})
export class CategoryProductsComponent implements OnInit {

  private readonly categoriesService = inject(CategoriesService)
  private readonly productsService = inject(ProductsService)
  private readonly cartService = inject(CartService)
  private readonly wishlistService = inject(WishlistService)
  private readonly activatedRoute = inject(ActivatedRoute)
  private readonly platformId = inject(PLATFORM_ID)

  categoryId: string = '';
  categoryProducts: IProducts[] = [];
  categoryData: ICategories = {} as ICategories

  isLoading = false;
  successMessage = '';
  errorMessage = '';

  wishlistItems: IProducts[] = [];
  addedToWishlist: boolean = false;
  removingId: string | null = null;


  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.specificCategory()
    }
  }

  specificCategory(): void {
    this.activatedRoute.paramMap.pipe(
      switchMap(param => {
        this.categoryId = param.get('id')!;
        return forkJoin({
          category: this.categoriesService.getSpecificCategories(this.categoryId),
          products: this.productsService.getAllProducts(),
          wishlistProducts: this.wishlistService.getLoggedUserWishlist().pipe(catchError(() => of({ data: [] })))
        });
      })
    ).subscribe({
      next: ({ category, products, wishlistProducts }) => {
        const wishlistIds = wishlistProducts.data.map((item: IProducts) => item._id)
        this.categoryData = category.data
        this.categoryProducts = products.data.filter(
          (product: IProducts) => product.category?._id === this.categoryId
        ).map((product: IProducts) => ({
          ...product,
          addedToWishlist: wishlistIds.includes(product._id)
        }));
      }
    });
  }

  addToCart(id: string): void {
    this.isLoading = true;
    this.cartService.addProductToCart(id).subscribe({
      next: (res) => {
        this.successMessage = res.message;
        this.isLoading = false;
        setTimeout(() => this.successMessage = '', 3000);
      },
      error: (err) => {
        this.errorMessage = err.error?.message;
        this.isLoading = false;
        setTimeout(() => this.errorMessage = '', 3000);
      }
    })
  }

  addToWishlist(id: string): void {
    this.wishlistService.setAddToWishlist(id).subscribe({
      next: (res) => {
        this.isLoading = false;
        this.successMessage = res.message;
        this.addedToWishlist = true;
        this.specificCategory();
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
        this.specificCategory();
      },
      error: () => {
        this.removingId = null;
      }
    })
  }
}
