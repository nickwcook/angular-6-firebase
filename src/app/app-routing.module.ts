import { NgModule } from '@angular/core';
import { RouterModule, Routes, RouterLinkActive } from '@angular/router';
import { CanActivateRouteGuard } from './can-activate-route.guard';

// COMPONENTS

	// Dashboard
	import { DashboardComponent } from './dashboard/dashboard.component';

	// Login/Register
	import { LoginComponent } from './login/login.component';
	import { RegisterComponent } from './register/register.component';

	// Notifications
	import { NotificationsComponent } from './notifications/notifications/notifications.component';

	// Invoices
	import { EditInvoiceComponent } from './invoices/edit-invoice/edit-invoice.component';
	import { NewInvoiceComponent } from './invoices/new-invoice/new-invoice.component';
	import { InvoiceListComponent } from './invoices/invoice-list/invoice-list.component';
	import { ViewInvoiceComponent } from './invoices/view-invoice/view-invoice.component';

	// Expenses
	import { NewExpenseComponent } from './expenses/new-expense/new-expense.component';
	import { ExpenseListComponent } from './expenses/expense-list/expense-list.component';
	import { ViewExpenseComponent } from './expenses/view-expense/view-expense.component';

	// Bank
	import { BankComponent } from './bank/bank.component';

	// Contacts
	import { NewContactComponent } from './contacts/new-contact/new-contact.component';
	import { ContactListComponent } from './contacts/contact-list/contact-list.component';
	import { ViewContactComponent } from './contacts/view-contact/view-contact.component';

	// Documents
	import { DocumentsComponent } from './documents/documents.component';
	
const routes: Routes = [
	{
		path: '',
		redirectTo: 'login',
		pathMatch: 'full'
	},
	{
		path: 'dashboard',
		component: DashboardComponent,
            canActivate: [CanActivateRouteGuard]
	},

	// Login/Register
	{
		path: 'login',
		component: LoginComponent
	},
	{
		path: 'register',
		component: RegisterComponent
	},

	// Notifications
	{
		path: 'notifications',
		component: NotificationsComponent,
            canActivate: [CanActivateRouteGuard]
	},
	{
		path: 'notifications/:id',
		component: NotificationsComponent,
            canActivate: [CanActivateRouteGuard]
	},

	// Invoices
	{
		path: 'invoices/new',
		component: NewInvoiceComponent,
            canActivate: [CanActivateRouteGuard]
	},
	{
		path: 'invoices/all',
		component: InvoiceListComponent,
            canActivate: [CanActivateRouteGuard]
	},
	{
		path: 'invoices/:id',
		component: ViewInvoiceComponent,
            canActivate: [CanActivateRouteGuard]
	},
	{
		path: 'invoices/:id/edit',
		component: EditInvoiceComponent,
            canActivate: [CanActivateRouteGuard]
	},

	// Expenses
	{
		path: 'expenses/new',
		component: NewExpenseComponent,
            canActivate: [CanActivateRouteGuard]
	},
	{
		path: 'expenses/all',
		component: ExpenseListComponent,
            canActivate: [CanActivateRouteGuard]
	},
	{
		path: 'expenses/:id',
		component: ViewExpenseComponent,
            canActivate: [CanActivateRouteGuard]
	},

	// Bank
	{
		path: 'bank',
		component: BankComponent,
            canActivate: [CanActivateRouteGuard]
	},

	// Contacts
	{
		path: 'contacts/new',
		component: NewContactComponent,
            canActivate: [CanActivateRouteGuard]
	},
	{
		path: 'contacts/all',
		component: ContactListComponent,
            canActivate: [CanActivateRouteGuard]
	},
	{
		path: 'contacts/:id',
		component: ViewContactComponent,
            canActivate: [CanActivateRouteGuard]
	},

	// Documents
	{
		path: 'documents',
		component: DocumentsComponent,
            canActivate: [CanActivateRouteGuard]
	}
]

@NgModule ({
	
	imports: [
		RouterModule.forRoot(routes)
	],

	exports: [
		RouterModule
	]
	
})

export class AppRoutingModule {
	
}