import { Component, inject } from '@angular/core';
import { OrderService } from '../../core/services/order/order.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-checkout',
  imports: [ReactiveFormsModule, TranslatePipe],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.scss'
})
export class CheckoutComponent {

  private readonly orderService = inject(OrderService)
  private readonly formBuilder = inject(FormBuilder)
  private readonly activatedRoute = inject(ActivatedRoute)
  private readonly router = inject(Router)

  isLoadingCash: boolean = false;
  isLoadingOnline: boolean = false;

  orderForm: FormGroup = this.formBuilder.group({
    details: [null, [Validators.required]],
    phone: [null, [Validators.required, Validators.pattern(/^01[0125][0-9]{8}$/)]],
    city: [null, [Validators.required]],
  })

  checkoutOrderForm(paymentType: 'cash' | 'online') {
    this.activatedRoute.paramMap.subscribe({
      next: (param) => {
        const cartId = param.get("id")

        if (paymentType === 'cash') {
          this.isLoadingCash = true;
          this.isLoadingOnline = false;
          this.orderService.createCashOrderFromCart(cartId!, this.orderForm.value).subscribe({
            next: (res) => {
              this.isLoadingCash = false;
              if (res.status === 'success') {
                this.router.navigate(['/allorders'])
              }
            },
          })
        }
        else if (paymentType === 'online') {
          this.isLoadingOnline = true;
          this.isLoadingCash = false;
          this.orderService.createOnlineOrderFromCart(cartId!, this.orderForm.value).subscribe({
            next: (res) => {
              this.isLoadingOnline = false;
              if (res.status === 'success') {
                open(res.session.url, '_self')
              }
            },
          })
        }
      },
    })
  }
}
