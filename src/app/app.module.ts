// ANGULAR CORE
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';

// FEATURE MODULES
import { InvoicesModule } from '@app/invoices/invoices.module';

// MATERIAL MODULE
import { MaterialModule } from '@app/material.module';

// SHARED MODULE
import { SharedModule } from '@app/shared.module';

// COMPONENTS
import { AppComponent } from './app.component';
import { DashboardComponent } from './dashboard/dashboard.component'

	// ACCOUNT
	import { LoginComponent } from './login/login.component'
	import { RegisterComponent } from './register/register.component'
	import { VerifyEmailDialogComponent } from './register/dialogs/verify-email-dialog/verify-email-dialog.component';

	// NOTIFICATIONS
	import { NotificationsComponent } from './notifications/notifications/notifications.component';

	// EXPENSES
	import { NewExpenseComponent } from './expenses/new-expense/new-expense.component';
	import { ExpenseListComponent } from './expenses/expense-list/expense-list.component';
	import { ViewExpenseComponent } from './expenses/view-expense/view-expense.component';
	import { DeleteExpenseDialogComponent } from './expenses/view-expense/dialogs/delete-expense-dialog/delete-expense-dialog.component';

	// BANK
	import { BankComponent } from './bank/bank.component';

	// CONTACTS
	import { NewContactComponent } from './contacts/new-contact/new-contact.component';
	import { ContactListComponent } from './contacts/contact-list/contact-list.component';
	import { ViewContactComponent } from './contacts/view-contact/view-contact.component';
	import { DeleteContactDialogComponent } from './contacts/view-contact/dialogs/delete-contact-dialog/delete-contact-dialog.component';

	// DOCUMENTS
	import { DocumentsComponent } from './documents/documents.component';

// SERVICES
import { AuthService } from './services/auth.service';
import { BankService } from './services/bank.service';
import { NotificationsService } from './services/notifications.service';
import { UserService } from './services/user.service';
import { TaxCodesService } from './services/tax-codes.service';
import { NominalsService } from './services/nominals.service';
import { InvoicesService } from '@app/services/invoices.service';
import { ExpensesService } from '@app/services/expenses.service';
import { ContactsService } from '@app/services/contacts.service';

@NgModule({
	
	declarations: [
		AppComponent,
		
		// COMPONENTS
        DashboardComponent,
		
        LoginComponent,
		RegisterComponent,
			VerifyEmailDialogComponent,
		
		NotificationsComponent,
		
		// NewItemDialogComponent,
		// EditInvoiceComponent,
		// 	EditReferenceDialogComponent,
		// 	CancelChangesDialogComponent,
        // NewInvoiceComponent,
        // InvoiceListComponent,		
        // ViewInvoiceComponent,
		// 	NewPaymentDialogComponent,
        // 	DeleteInvoiceDialogComponent,
		
        NewExpenseComponent,
        ExpenseListComponent,
        ViewExpenseComponent,		
        DeleteExpenseDialogComponent,
		
        BankComponent,
		
        ContactListComponent,
        NewContactComponent,		
        ViewContactComponent,		
        DeleteContactDialogComponent,
		
		DocumentsComponent,
	],
	
	imports: [
        // ANGULAR CORE
		BrowserModule,
		BrowserAnimationsModule,

		// FEATURE MODULES
		InvoicesModule,

		// MATERIAL MODULE
		MaterialModule,

		// SHARED MODULE
		SharedModule
	],
	
	entryComponents: [

		// REGISTER
		VerifyEmailDialogComponent,

		// CONTACTS
			// View Contact
			DeleteContactDialogComponent,

		// // INVOICES
		// 	NewItemDialogComponent,
		// 	// View Invoice
		// 	NewPaymentDialogComponent,
		// 	DeleteInvoiceDialogComponent,
		// 	// Edit Invoice
		// 	EditReferenceDialogComponent,
		// 	CancelChangesDialogComponent,

		// EXPENSES
			// View Expense
			DeleteExpenseDialogComponent
	],
	
	providers: [
		AuthService,
		BankService,
		NotificationsService,
		UserService,
        TaxCodesService,
        NominalsService,
		InvoicesService,
		ExpensesService,
		ContactsService
	],
	
	bootstrap: [AppComponent]
})

export class AppModule { }