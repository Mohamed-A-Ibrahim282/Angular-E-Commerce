import { Component, inject, OnInit } from '@angular/core';
import { CartService } from '../../core/services/cart/cart.service';
import { CartItem } from '../../shared/interfaces/cart-item/cart-item';
import { RouterLink } from '@angular/router';
import { ToastErrorComponent } from '../../shared/components/ui/toast/toast-error/toast-error.component';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-cart',
  imports: [RouterLink, ToastErrorComponent, TranslatePipe],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss'
})
export class CartComponent implements OnInit {

  private readonly cartService = inject(CartService)

  cartItems: CartItem = {} as CartItem;
  cartId: string = ''
  isLoading: boolean = false;
  deleteMessage: string = ""
  deletedItemId: string = "";


  ngOnInit(): void {
    this.getCartItems()
  }

  getCartItems() {
    this.cartService.getLoggedUserCart().subscribe({
      next: (res) => {
        this.cartItems = res.data;
        this.cartId = this.cartItems._id        
      },
    })
  }

  removeSpecificItem(id: string) {
    this.deletedItemId = id;
    this.isLoading = true;
    this.cartService.removeSpecificCartItem(id).subscribe({
      next: (res) => {
        this.isLoading = false;
        this.deleteMessage = "Item removed successfully";
        this.getCartItems();
        setTimeout(() => {
          this.deleteMessage = "";
        }, 1500);
      },
      error: (err) => {
        this.isLoading = false;
      }
    })
  }

  updateProductQuantity(id: string, count: string) {
    this.cartService.updateCartProductQuantity(id, count).subscribe({
      next: (res) => {
        this.getCartItems();
      },
    })
  }

  removeAllCartItems() {
    this.deletedItemId = "all";
    this.isLoading = true;
    this.cartService.clearUserCart().subscribe({
      next: (res) => {
        this.isLoading = false;
        this.deleteMessage = "All items removed successfully";
        this.getCartItems();
        setTimeout(() => {
          this.deleteMessage = "";
        }, 1500);
      },
      error: (err) => {
        this.isLoading = false;
      }
    })
  }
}
