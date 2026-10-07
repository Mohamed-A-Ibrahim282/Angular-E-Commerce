import { Component, inject, PLATFORM_ID } from '@angular/core';
import { AuthService } from '../../core/services/auth/auth.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-forget-password',
  imports: [ReactiveFormsModule, TranslatePipe],
  templateUrl: './forget-password.component.html',
  styleUrl: './forget-password.component.scss'
})
export class ForgetPasswordComponent {

  private readonly authService = inject(AuthService)
  private readonly formBuilder = inject(FormBuilder)
  private readonly platformId = inject(PLATFORM_ID)
  private readonly router = inject(Router)


  step: number = 1;
  isLoading: boolean = false;
  successMessage: string = '';
  errorMessage: string = '';

  forgetPassword: FormGroup = this.formBuilder.group({
    email: [null, [Validators.required, Validators.email]]
  })

  verifyResetCode: FormGroup = this.formBuilder.group({
    resetCode: [null, [Validators.required, Validators.pattern(/^\w{6}$/)]]
  })

  resetPassword: FormGroup = this.formBuilder.group({
    email: [null, [Validators.required, Validators.email]],
    newPassword: [null, [Validators.required, Validators.pattern(/^\w{6,}$/)]],
  })

  submitForgetPassword() {
    if (this.forgetPassword.valid) {
      this.isLoading = true;
      this.authService.setForgetPassword(this.forgetPassword.value).subscribe({
        next: (res) => {
          this.errorMessage = '';
          this.successMessage = res.message;
          this.isLoading = false;
          let userEmail = this.forgetPassword.get('email')?.value;
          this.resetPassword.get('email')?.patchValue(userEmail)
          setTimeout(() => {
            this.step = 2;
            this.successMessage = '';
          }, 1000);
        },
        error: (err) => {
          this.isLoading = false;
          this.successMessage = '';
          this.errorMessage = err.error.message;
        }
      })
    }
    else {
      this.forgetPassword.markAllAsTouched()
    }
  }

  SubmitVerifyResetCode() {
    if (this.verifyResetCode.valid) {
      this.isLoading = true;
      this.authService.setVerifyResetCode(this.verifyResetCode.value).subscribe({
        next: (res) => {
          this.errorMessage = '';
          this.successMessage = 'Your code has been successfully verified!';
          this.isLoading = false;
          setTimeout(() => {
            this.step = 3;
            this.successMessage = '';
          }, 1000);
        },
        error: (err) => {
          this.isLoading = false;
          this.successMessage = '';
          this.errorMessage = err.error.message;
        }
      })
    }
    else {
      this.verifyResetCode.markAllAsTouched()
    }
  }

  SubmitResetPassword() {
    if (this.resetPassword.valid) {
      this.isLoading = true;
      this.authService.setResetPassword(this.resetPassword.value).subscribe({
        next: (res) => {
          this.errorMessage = '';
          this.successMessage = 'Your password has been successfully reset!';
          this.isLoading = false;

          if (isPlatformBrowser(this.platformId)) {
            localStorage.setItem("userToken", res.token)
          }

          setTimeout(() => {
            this.router.navigate(['/home'])
            this.successMessage = '';
          }, 1000);
        },
        error: (err) => {
          this.isLoading = false;
          this.successMessage = '';
          this.errorMessage = err.error.message;
        }
      })
    }
    else {
      this.resetPassword.markAllAsTouched()
    }
  }
}
