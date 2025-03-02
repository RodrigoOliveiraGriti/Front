import { Routes } from '@angular/router';
import { CustomerFormComponent } from './components/customer-form/customer-form.component';
import { CustomerListComponent } from './components/customer-list/customer-list.component';

export const routes: Routes = [
    { path: '', redirectTo: 'customers', pathMatch: 'full' },
    { path: 'customers', component: CustomerListComponent },
    { path: 'customers/novo', component: CustomerFormComponent },
    { path: 'customers/editar/:id', component: CustomerFormComponent },
    { path: '**', redirectTo: 'customers' }
];