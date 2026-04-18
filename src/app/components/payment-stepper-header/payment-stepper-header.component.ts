import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '@vcb/shared-libs';
import { PaymentStepperService } from '@vcb/shared-libs';

@Component({
  selector: 'app-payment-stepper-header',
  standalone: true,
  imports: [CommonModule, TranslatePipe],
  templateUrl: './payment-stepper-header.component.html',
  styleUrl: './payment-stepper-header.component.scss'
})
export class PaymentStepperHeaderComponent {
  private paymentStepperService = inject(PaymentStepperService);

  currentStep = this.paymentStepperService.currentStep;
  isStep1Valid = this.paymentStepperService.isStep1Valid;
  isStep2Valid = this.paymentStepperService.isStep2Valid;
  isStep3Valid = this.paymentStepperService.isStep3Valid;

  steps = [
    { number: 1, label: 'payments.stepper.step1Label' },
    { number: 2, label: 'payments.stepper.step2Label' },
    { number: 3, label: 'payments.stepper.step3Label' }
  ];

  isStepCompleted(stepNumber: number): boolean {
    if (stepNumber === 1) return this.isStep1Valid();
    if (stepNumber === 2) return this.isStep2Valid();
    if (stepNumber === 3) return this.isStep3Valid();
    return false;
  }

  isStepActive(stepNumber: number): boolean {
    return this.currentStep() === stepNumber;
  }

  isStepPassed(stepNumber: number): boolean {
    return stepNumber < this.currentStep();
  }
}
