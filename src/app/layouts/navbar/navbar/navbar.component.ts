import { Component, inject, input, PLATFORM_ID, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../core/services/auth/auth.service';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { MytranslateService } from '../../../core/services/mytranslate/mytranslate.service';
import { CartService } from '../../../core/services/cart/cart.service';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive, TranslatePipe],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {

  readonly authService = inject(AuthService)
  readonly mytranslateService = inject(MytranslateService)
  readonly translateService = inject(TranslateService)
  readonly cartService = inject(CartService)
  readonly platformId = inject(PLATFORM_ID)

  
  isLogin = input<boolean>(true)
  checkLang: string = this.translateService.getCurrentLang() ?? 'en'

  changeCurrentLang(lang: string): void {
    this.mytranslateService.changeLang(lang)
    this.checkLang = lang
  }
}
