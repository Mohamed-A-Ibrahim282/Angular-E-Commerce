import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth/auth.service';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink, TranslatePipe],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  private readonly authService = inject(AuthService)
  private readonly router = inject(Router)


  isLoading: boolean = false;
  errorMesage: string = '';
  sucsessMesage: string = '';

  loginForm: FormGroup = new FormGroup({
    email: new FormControl(null),
    password: new FormControl(null)
  })

  submitForm() {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.authService.sendLoginData(this.loginForm.value).subscribe({
        next: (res) => {
          this.errorMesage = '';
          this.isLoading = false;
          if (res.message === "success") {
            this.sucsessMesage = res.message;
            localStorage.setItem("userToken", res.token)
          }
          setTimeout(() => {
            this.router.navigate(['/home'])
          }, 1000);
        },
        error: (err) => {
          this.sucsessMesage = '';
          this.isLoading = false;
          this.errorMesage = err.error.message;
          if (err.error.message === "fail") {
            this.errorMesage = '';
          }
        }
      })
    } else {
      this.loginForm.markAllAsTouched()
    }
  }
}
