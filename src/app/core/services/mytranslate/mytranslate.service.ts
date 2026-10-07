import { isPlatformBrowser } from '@angular/common';
import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class MytranslateService {

  private readonly platformId = inject(PLATFORM_ID)

  constructor(private translateService: TranslateService) {

    this.translateService.setFallbackLang('en')

    if (isPlatformBrowser(this.platformId)) {
      const tagetLang = localStorage.getItem("lang")
      if (tagetLang) {
        this.translateService.use(tagetLang)
      }
    }

    this.changeDirection()
  }

  changeDirection(): void {
    if (isPlatformBrowser(this.platformId)) {
      if (localStorage.getItem('lang') === 'en') {
        document.documentElement.dir = 'ltr';
        document.documentElement.lang = 'en';
      }
      else if (localStorage.getItem('lang') === 'ar') {
        document.documentElement.dir = 'rtl';
        document.documentElement.lang = 'ar';
      }
    }
  }

  changeLang(lang: string): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('lang', lang);
    }

    this.translateService.use(lang);
    this.changeDirection();
  }
}
