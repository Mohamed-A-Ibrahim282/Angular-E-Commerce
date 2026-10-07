import { Component, inject } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../core/services/auth/auth.service';
import { Router } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, TranslatePipe],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {

  private readonly authService = inject(AuthService)
  private readonly formBuilder = inject(FormBuilder)
  private readonly router = inject(Router)

  // New and common sentax
  registerForm: FormGroup = this.formBuilder.group({
    name: [null, [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
    email: [null, [Validators.required, Validators.email]],
    password: [null, [Validators.required, Validators.pattern(/^\w{6,}$/)]],
    rePassword: [null, [Validators.required]],
    phone: [null, [Validators.required, Validators.pattern(/^01[0125][0-9]{8}$/)]],
  }, { validators: [this.confirmPassword] })

  // Old sentax
  // registerForm: FormGroup = new FormGroup({
  //   name: new FormControl(null, [Validators.required, Validators.minLength(3), Validators.maxLength(20)]),
  //   email: new FormControl(null, [Validators.required, Validators.email]),
  //   password: new FormControl(null, [Validators.required, Validators.pattern(/^[A-Z]\w{6,}$/)]),
  //   rePassword: new FormControl(null, [Validators.required]),
  //   phone: new FormControl(null, [Validators.required, Validators.pattern(/^01[0125][0-9]{8}$/)])
  // },
  //   { validators: this.confirmPassword }
  // )

  isLoading: boolean = false;
  errorMesage: string = '';
  sucsessMesage: string = '';

  submitForm(): void {
    if (this.registerForm.valid) {
      this.isLoading = true;
      this.authService.sendRegisterData(this.registerForm.value).subscribe({
        next: (res) => {
          this.errorMesage = '';
          this.isLoading = false;
          if (res.message === "success") {
            this.sucsessMesage = res.message;
          }

          setTimeout(() => {
            this.router.navigate(['/login'])
          }, 1000);
        },
        error: (err) => {
          this.sucsessMesage = '';
          this.isLoading = false;
          this.errorMesage = err.error.message;
        }
      })
    } else {
      this.registerForm.markAllAsTouched()
    }
  }

  confirmPassword(grop: AbstractControl) {
    const password = grop.get('password')?.value;
    const rePassword = grop.get('rePassword')?.value;
    return password === rePassword ? null : { missmatch: true }
  }
}
