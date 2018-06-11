// ANGULAR CORE
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';

// ANGULAR RESOURCES
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// ROUTING
import { AppRoutingModule } from './app-routing.module';
import { RouterLinkActive } from '@angular/router';
import { CanActivateRouteGuard } from './can-activate-route.guard';

// HTTP
import { HttpModule } from '@angular/http';
import { HttpClientModule, HttpClient } from '@angular/common/http';

// ANGULAR MATERIAL
import { 
	MatButtonModule,
	MatDialogModule,
	MatToolbarModule, 
	MatMenuModule,
	MatInputModule, 
	MatProgressSpinnerModule, 
	MatCardModule, 
	MatCheckboxModule,
	MatIconModule,
	MatDatepickerModule,
	MAT_DATE_FORMATS,
	MAT_DATE_LOCALE,
	DateAdapter,
	MatListModule,
	MatPaginatorModule, 
	MatRadioModule, 
	MatRippleModule, 
	MatSelectModule, 
	MatSidenavModule, 
	MatSnackBarModule, 
	MatSortModule,
	MatStepperModule,
	// MatTableModule, 
	MatTabsModule, 
	MatTooltipModule 
} from '@angular/material';

import { MatTableModule } from '@angular/material/table';
import { MatBadgeModule } from '@angular/material/badge';

// MOMENTJS
import * as _moment from 'moment';
import { MatMomentDateModule } from '@angular/material-moment-adapter';

// LODASH
import * as _ from 'lodash';

// FIREBASE
import { AngularFireModule } from 'angularfire2';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireStorageModule } from 'angularfire2/storage';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { environment } from '../environments/environment';

// ELECTRON
import { NgxElectronModule } from 'ngx-electron';

// NG2-CHARTS
import { ChartsModule } from 'ng2-charts';

// CONTENT-LOADER 
// import { ContentLoaderModule } from '@netbasal/content-loader';

// COMPONENTS
import { AppComponent } from './app.component';
import { DashboardComponent } from './dashboard/dashboard.component'

	// ACCOUNT
	import { LoginComponent } from './login/login.component'
	import { RegisterComponent } from './register/register.component'

	// INVOICES
		import { NewItemDialogComponent } from './invoices/dialogs/new-item-dialog/new-item-dialog.component';
		//EditInvoice
		import { EditInvoiceComponent } from './invoices/edit-invoice/edit-invoice.component';
			// Dialogs
			import { EditReferenceDialogComponent } from './invoices/edit-invoice/dialogs/edit-reference-dialog/edit-reference-dialog.component';
			import { CancelChangesDialogComponent } from './invoices/edit-invoice/dialogs/cancel-changes-dialog/cancel-changes-dialog.component';

		// NewInvoice
		import { NewInvoiceComponent } from './invoices/new-invoice/new-invoice.component';

		// InvoiceList
		import { InvoiceListComponent } from './invoices/invoice-list/invoice-list.component';

		// ViewInvoice
		import { ViewInvoiceComponent } from './invoices/view-invoice/view-invoice.component';
			// Dialogs
			import { DeleteInvoiceDialogComponent } from './invoices/view-invoice/dialogs/delete-invoice-dialog.component';
			// Directives
			import { DownloadInvoicePdfDirective } from './invoices/view-invoice/directives/download-invoice-pdf/download-invoice-pdf.directive';
			import { EmailInvoiceDirective } from './invoices/view-invoice/directives/email-invoice/email-invoice.directive';
			import { DuplicateInvoiceDirective } from './invoices/view-invoice/directives/duplicate-invoice/duplicate-invoice.directive';

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
import { NotificationsService } from './services/notifications.service';
import { UserService } from './services/user.service';
import { TaxCodesService } from './services/tax-codes.service';
import { NominalsService } from './services/nominals.service';
import { InvoicesService } from '@app/services/invoices.service';
import { ExpensesService } from '@app/services/expenses.service';
import { ContactsService } from '@app/services/contacts.service';

// PIPES
import { SortByPipe } from './pipes/sort-by.pipe';

// GLOBAL DIRECTIVES
import { ParseIntDirective } from './directives/parse-int.directive';
import { ParseFloatDirective } from './directives/parse-float.directive';

@NgModule({
	
	declarations: [
		AppComponent,
		
		// COMPONENTS
        DashboardComponent,
		
        LoginComponent,
        RegisterComponent,
		
		NewItemDialogComponent,
		EditInvoiceComponent,
			EditReferenceDialogComponent,
			CancelChangesDialogComponent,
        NewInvoiceComponent,
        InvoiceListComponent,		
        ViewInvoiceComponent,		
        	DeleteInvoiceDialogComponent,
		
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
		
		// PIPES
        SortByPipe,
		
		// DIRECTIVES
        ParseIntDirective,
		ParseFloatDirective,
			// Invoices
			DownloadInvoicePdfDirective,
			EmailInvoiceDirective,
			DuplicateInvoiceDirective
	],
	
	imports: [
        // ANGULAR CORE
        BrowserModule,
		// ANGULAR RESOURCES
		FlexLayoutModule,
		FormsModule,
		ReactiveFormsModule,
		
		// ROUTING
		AppRoutingModule,
		
		// HTTP
		HttpModule, 
		HttpClientModule,
        
        // ANGULAR MATERIAL
		MatButtonModule,
		MatDialogModule,
		MatToolbarModule,
		MatMenuModule, 
		MatInputModule, 
		MatProgressSpinnerModule, 
		MatBadgeModule,
		MatCardModule, 
		MatCheckboxModule, 
		MatIconModule, 
		MatDatepickerModule,
		MatListModule, 
		MatPaginatorModule, 
		MatRadioModule, 
		MatRippleModule, 
		MatSelectModule, 
		MatSidenavModule, 
		MatSnackBarModule, 
		MatSortModule,
        BrowserAnimationsModule,
		MatStepperModule,
		MatTableModule, 
		MatTabsModule, 
		MatTooltipModule,

		// CONTENT-LOADER
		// ContentLoaderModule,

		// MOMENTJS
		MatMomentDateModule,
        
        // FIREBASE
        AngularFireModule.initializeApp(environment.firebase),
        AngularFirestoreModule.enablePersistence(),
        AngularFireAuthModule,
        AngularFireStorageModule,
		
		// ELECTRON
		NgxElectronModule,

		// NG2-CHARTS
		ChartsModule
	],
	
	entryComponents: [
		// CONTACTS
			// View Contact
			DeleteContactDialogComponent,

		// INVOICES
			NewItemDialogComponent,
			// View Invoice
			DeleteInvoiceDialogComponent,
			// Edit Invoice
			EditReferenceDialogComponent,
			CancelChangesDialogComponent,

		// EXPENSES
			// View Expense
			DeleteExpenseDialogComponent
	],
	
	providers: [
		AuthService,
		NotificationsService,
		UserService,
        TaxCodesService,
        NominalsService,
		InvoicesService,
		ExpensesService,
		ContactsService,
		CanActivateRouteGuard,
		{
			provide: MAT_DATE_LOCALE,
			useValue: 'en-GB'
		}
	],
	
	bootstrap: [AppComponent]
})

export class AppModule { }