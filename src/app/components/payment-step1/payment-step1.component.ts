import { Component, DestroyRef, inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, NavigationStart, Router, RouterModule } from '@angular/router';
import { TranslatePipe } from '@vcb/shared-libs';
import { PaymentStepperService, PaymentAccount, PaymentMethodType } from '@vcb/shared-libs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-payment-step1',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, TranslatePipe],
  templateUrl: './payment-step1.component.html',
  styleUrl: './payment-step1.component.scss'
})
export class PaymentStep1Component implements OnInit, OnDestroy {
  private formBuilder = inject(FormBuilder);
  private paymentStepperService = inject(PaymentStepperService);
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);

  form!: FormGroup;
  accounts: PaymentAccount[] = [];
  paymentMethods = Object.values(PaymentMethodType);
  isLoading = false;
  private destroyRef = inject(DestroyRef);


  ngOnInit(): void {

    this.router.events
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((event: any) => {
        if (event?.['code'] === 0) {
          this.paymentStepperService.resetStepper();
        }
      });
    
    this.initializeForm();
    this.loadAccounts();
  }

  private initializeForm(): void {
    const state = this.paymentStepperService.getPaymentState();
    this.form = this.formBuilder.group({
      selectedAccountId: [state.step1?.selectedAccountId || '', Validators.required],
      selectedPaymentMethod: [state.step1?.selectedPaymentMethod || '', Validators.required]
    });
  }

  private loadAccounts(): void {
    this.isLoading = true;
    this.paymentStepperService.getAvailableAccounts().subscribe(
      accounts => {
        this.accounts = accounts;
        this.isLoading = false;
      },
      error => {
        console.error('Failed to load accounts', error);
        this.isLoading = false;
      }
    );
  }

  onNext(): void {
    if (this.form.valid) {
      const selectedAccountId = this.form.get('selectedAccountId')?.value;
      const selectedAccount = this.accounts.find(acc => acc.id === selectedAccountId);
      const selectedPaymentMethod = this.form.get('selectedPaymentMethod')?.value;

      this.paymentStepperService.updateStep1({
        selectedAccountId,
        selectedAccount,
        selectedPaymentMethod
      });
      this.paymentStepperService.goToNextStep();
    }
  }

  onCancel(): void {
    if (confirm('Are you sure you want to cancel this payment? Your progress will be lost.')) {
      this.paymentStepperService.resetStepper();
      this.router.navigate(['/payments']);
    }
  }

  getPaymentMethodLabel(method: PaymentMethodType): string {
    const labels: Record<PaymentMethodType, string> = {
      [PaymentMethodType.BKT]: 'Bank Transfer',
      [PaymentMethodType.DFT]: 'Direct Fund Transfer',
      [PaymentMethodType.OPS]: 'Operations/Bulk Payment'
    };
    return labels[method] || method;
  }

  getFormattedBalance(balance: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(balance);
  }

  ngOnDestroy(): void {
    
  }
}
