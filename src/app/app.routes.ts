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
                children: [
                    {
                        path: 'step/1',
                        component: PaymentStep1Component
                    },
                    {
                        path: 'step/2/:paymentMethod',
                        loadComponent: () => {
                            debugger;
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
                        }
                    },
                    {
                        path: 'step/3',
                        component: PaymentStep3Component
                    }
                ]
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
                }
            },
        ]
    }
];
