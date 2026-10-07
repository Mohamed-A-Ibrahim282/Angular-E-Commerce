import { Component, input } from '@angular/core';

@Component({
  selector: 'app-toast-error',
  imports: [],
  templateUrl: './toast-error.component.html',
  styleUrl: './toast-error.component.scss'
})
export class ToastErrorComponent {
  errorMessage = input<string>("")
}
