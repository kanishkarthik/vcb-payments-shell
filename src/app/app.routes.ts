import { loadRemoteModule } from '@angular-architects/module-federation';
import { Routes } from '@angular/router';
import { App } from './app';
import { PaymentStepperContainerComponent } from './components/payment-stepper-container/payment-stepper-container.component';
import { PaymentStep1Component } from './components/payment-step1/payment-step1.component';
import { PaymentStep3Component } from './components/payment-step3/payment-step3.component';
import { PaymentLandingComponent } from './components/landing/payment.landing.component';

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
                        path: 'step/2/bkt',
                        loadComponent: () => {
                            // Dynamically load Step 2 from appropriate remote module
                            // This will be determined by the payment method selected in Step 1
                            return loadRemoteModule({
                                type: 'module',
                                remoteEntry: 'http://localhost:4202/remoteEntry.js',
                                exposedModule: './bkt-payment-step2'
                            }).then(m => m.PaymentStep2BKTComponent);
                        }
                    },
                    {
                        path: 'step/3',
                        component: PaymentStep3Component
                    }
                ]
            },
            {
                path: 'bkt',
                loadComponent: () => loadRemoteModule({
                    type: 'module',
                    remoteEntry: 'http://localhost:4202/remoteEntry.js',
                    exposedModule: './bkt'
                }).then(m => m.App)
            },
            {
                path: 'dft',
                loadComponent: () => loadRemoteModule({
                    type: 'module',
                    remoteEntry: 'http://localhost:4203/remoteEntry.js',
                    exposedModule: './dft'
                }).then(m => m.App)
            },
            {
                path: 'ops',
                loadComponent: () => loadRemoteModule({
                    type: 'module',
                    remoteEntry: 'http://localhost:4205/remoteEntry.js',
                    exposedModule: './ops'
                }).then(m => m.App)
            },
        ]
    }
];
