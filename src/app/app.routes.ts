import { loadRemoteModule } from '@angular-architects/module-federation';
import { ActivatedRoute, Routes } from '@angular/router';
import { inject } from '@angular/core';
import { App } from './app';
import { PaymentStepperContainerComponent } from './components/payment-stepper-container/payment-stepper-container.component';
import { PaymentStep1Component } from './components/payment-step1/payment-step1.component';
import { PaymentStep3Component } from './components/payment-step3/payment-step3.component';
import { PaymentLandingComponent } from './components/landing/payment.landing.component';
import { PaymentStepperService, RuntimeConfigService } from '@vcb/shared-libs';

export const PAYMENTS_ROUTES: Routes = [
    {
        path: '',
        component: App,
        children: [
            {
                path: '',
                component: PaymentLandingComponent
            },
            {
                path: 'create-payment',
                component: PaymentStepperContainerComponent,
                data: {
                    breadcrumb: {
                        label: 'Create Payment', translationKey: 'breadcrumb.payments.create',
                        url: '/payments/create-payment/step/1', navigationState: { reset: true }
                    }
                },
                children: [
                    {
                        path: 'step/1',
                        component: PaymentStep1Component,
                        data: { breadcrumb: { label: 'Step 1', translationKey: 'breadcrumb.payments.step1' } }
                    },
                    {
                        path: 'step/2/:paymentMethod',
                        loadComponent: () => {
                            const configService = inject(RuntimeConfigService);

                            const stepperService = inject(PaymentStepperService);

                            const paymentMethod = stepperService.getPaymentState().step1?.selectedPaymentMethod?.toLowerCase() || '';

                            return loadRemoteModule({
                                type: 'module',
                                remoteEntry: `${configService.getRemoteUrl(paymentMethod)}/remoteEntry.js`,
                                exposedModule: `./${paymentMethod}-payment-step2`
                            }).then(m => {
                                const componentName = `PaymentStep2${paymentMethod.toUpperCase()}Component`;
                                return m[componentName];
                            });
                        },
                        data: { breadcrumb: { label: 'Step 2', translationKey: 'breadcrumb.payments.step2' } }
                    },
                    {
                        path: 'step/3',
                        component: PaymentStep3Component,
                        data: { breadcrumb: { label: 'Step 3', translationKey: 'breadcrumb.payments.step3' } }
                    }
                ],
            },
            {
                path: 'ops',
                loadComponent: () => {
                    const configService = inject(RuntimeConfigService);
                    return loadRemoteModule({
                        type: 'module',
                        remoteEntry: `${configService.getRemoteUrl('ops')}/remoteEntry.js`,
                        exposedModule: './ops'
                    }).then(m => m.App);
                },
                data: { breadcrumb: { label: 'Operations', translationKey: 'breadcrumb.payments.ops' } }
            },
        ]
    }
];
