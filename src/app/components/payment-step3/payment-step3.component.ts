import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '@vcb/shared-libs';
import { PaymentStepperService, PaymentMethodType, PaymentCreationState } from '@vcb/shared-libs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-payment-step3',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TranslatePipe],
  templateUrl: './payment-step3.component.html',
  styleUrl: './payment-step3.component.scss'
})
export class PaymentStep3Component implements OnInit {
  private formBuilder = inject(FormBuilder);
  private paymentStepperService = inject(PaymentStepperService);
  private router = inject(Router);

  form!: FormGroup;
  paymentState: PaymentCreationState | null = null;
  isSubmitting = false;
  PaymentMethodType = PaymentMethodType;

  ngOnInit(): void {
    this.paymentState = this.paymentStepperService.getPaymentState();
    this.initializeForm();
  }

  private initializeForm(): void {
    const state = this.paymentStepperService.getPaymentState();
    this.form = this.formBuilder.group({
      confirmationAccepted: [state.step3?.confirmationAccepted || false, Validators.requiredTrue],
      termsAccepted: [state.step3?.termsAccepted || false, Validators.requiredTrue]
    });
  }

  getPaymentDetails(): any {
    if (!this.paymentState?.step1 || !this.paymentState?.step2) {
      return null;
    }

    const step2 = this.paymentState.step2 as any;
    return {
      account: this.paymentState.step1.selectedAccount,
      method: this.paymentState.step1.selectedPaymentMethod,
      amount: step2.amount,
      details: step2
    };
  }

  get step2Data(): any {
    return this.paymentState?.step2 as any;
  }

  getMethodLabel(): string {
    const method = this.paymentState?.step1?.selectedPaymentMethod;
    if (!method) return '';

    const labels: Record<PaymentMethodType, string> = {
      [PaymentMethodType.BKT]: 'Bank Transfer',
      [PaymentMethodType.DFT]: 'Direct Fund Transfer',
      [PaymentMethodType.OPS]: 'Operations/Bulk Payment'
    };
    return labels[method] || method;
  }

  calculateTotalDebit(): number {
    if (!this.paymentState?.step2) return 0;
    const step2 = this.paymentState.step2 as any;
    const amount = step2.amount || 0;
    const fees = this.paymentStepperService.calculateFees(
      amount,
      this.paymentState.step1?.selectedPaymentMethod || PaymentMethodType.BKT
    );
    return amount + fees;
  }

  calculateFees(): number {
    if (!this.paymentState?.step2) return 0;
    const step2 = this.paymentState.step2 as any;
    return this.paymentStepperService.calculateFees(
      step2.amount || 0,
      this.paymentState.step1?.selectedPaymentMethod || PaymentMethodType.BKT
    );
  }

  onBack(): void {
    this.paymentStepperService.goToPreviousStep();
  }

  onSubmit(): void {
    if (this.form.valid && !this.isSubmitting) {
      this.paymentStepperService.updateStep3({
        confirmationAccepted: this.form.get('confirmationAccepted')?.value,
        termsAccepted: this.form.get('termsAccepted')?.value
      });

      this.isSubmitting = true;
      this.paymentStepperService.submitPayment().subscribe(
        response => {
          this.isSubmitting = false;
          // Show success message and redirect
          setTimeout(() => {
            this.router.navigate(['/payments/success'], {
              queryParams: { paymentId: response.paymentId }
            });
          }, 500);
        },
        error => {
          this.isSubmitting = false;
          console.error('Payment submission failed', error);
        }
      );
    }
  }

  onCancel(): void {
    if (confirm('Are you sure you want to cancel this payment? Your progress will be lost.')) {
      this.paymentStepperService.resetStepper();
      this.router.navigate(['/payments']);
    }
  }

  getFormattedAmount(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  }
}
