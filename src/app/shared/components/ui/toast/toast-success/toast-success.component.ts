import { Component, input } from '@angular/core';

@Component({
  selector: 'app-toast-success',
  imports: [],
  templateUrl: './toast-success.component.html',
  styleUrl: './toast-success.component.scss'
})
export class ToastSuccessComponent {
  successMessage = input<string>('')
}
