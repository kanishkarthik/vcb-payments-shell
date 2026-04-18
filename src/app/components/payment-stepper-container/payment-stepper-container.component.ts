import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { PaymentStepperHeaderComponent } from '../payment-stepper-header/payment-stepper-header.component';

@Component({
  selector: 'app-payment-stepper-container',
  standalone: true,
  imports: [CommonModule, RouterOutlet, PaymentStepperHeaderComponent],
  templateUrl: './payment-stepper-container.component.html',
  styleUrl: './payment-stepper-container.component.scss'
})
export class PaymentStepperContainerComponent {}
