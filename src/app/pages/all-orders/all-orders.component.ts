import { Component, inject, OnInit, PLATFORM_ID } from '@angular/core';
import { OrderService } from '../../core/services/order/order.service';
import { TokenService } from '../../core/services/token/token.service';
import { IOrder } from '../../shared/interfaces/order/iorder';
import { DatePipe, isPlatformBrowser } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-all-orders',
  imports: [DatePipe, RouterLink, TranslatePipe],
  templateUrl: './all-orders.component.html',
  styleUrl: './all-orders.component.scss'
})
export class AllOrdersComponent implements OnInit {

  private readonly orderService = inject(OrderService)
  private readonly tokenService = inject(TokenService)
  private readonly platformId = inject(PLATFORM_ID)

  userData = this.tokenService.tokenData
  allOrders: IOrder[] = [] as IOrder[];

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.userOrders()
    }
  }

  userOrders() {
    const userId = this.userData?.id;

    this.orderService.getUserOrders(userId).subscribe({
      next: (res) => this.allOrders = res,
    })
  }
}
