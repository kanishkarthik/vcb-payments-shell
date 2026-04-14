import { loadRemoteModule } from '@angular-architects/module-federation';
import { Routes } from '@angular/router';
import { App } from './app';

export const PAYMENTS_ROUTES: Routes = [
    {
        path: '',
        component: App,
        children: [
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
