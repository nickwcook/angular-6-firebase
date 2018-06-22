import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// ANGULAR RESOURCES
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

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
	MatTabsModule, 
	MatTooltipModule 
} from '@angular/material';

import { NewItemDialogComponent } from './dialogs/new-item-dialog/new-item-dialog.component';

// NEW INVOICE
import { NewInvoiceComponent } from './new-invoice/new-invoice.component';

// INVOICE LIST
import { InvoiceListComponent } from './invoice-list/invoice-list.component';

// VIEW INVOICE
import { ViewInvoiceComponent } from './view-invoice/view-invoice.component';
	// Dialogs
	import { NewPaymentDialogComponent } from './view-invoice/dialogs/new-payment-dialog/new-payment-dialog.component';
	import { DeleteInvoiceDialogComponent } from './view-invoice/dialogs/delete-invoice-dialog.component';
	// Directives
	import { DownloadInvoicePdfDirective } from './view-invoice/directives/download-invoice-pdf/download-invoice-pdf.directive';
	import { EmailInvoiceDirective } from './view-invoice/directives/email-invoice/email-invoice.directive';
	import { DuplicateInvoiceDirective } from './view-invoice/directives/duplicate-invoice/duplicate-invoice.directive';

// EDIT INVOICE
import { EditInvoiceComponent } from './edit-invoice/edit-invoice.component';
	// Dialogs
	import { EditReferenceDialogComponent } from './edit-invoice/dialogs/edit-reference-dialog/edit-reference-dialog.component';
	import { CancelChangesDialogComponent } from './edit-invoice/dialogs/cancel-changes-dialog/cancel-changes-dialog.component';

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		ReactiveFormsModule,
	],
	declarations: [
		NewItemDialogComponent,

		// NEW INVOICE
		NewInvoiceComponent,

		// INVOICES LIST
		InvoiceListComponent,	

		// VIEW INVOICE
		ViewInvoiceComponent,
			NewPaymentDialogComponent,
			DeleteInvoiceDialogComponent,

		// EDIT INVOICE
		EditInvoiceComponent,
			EditReferenceDialogComponent,
			CancelChangesDialogComponent,

		// DIRECTIVES
		DownloadInvoicePdfDirective,
		EmailInvoiceDirective,
		DuplicateInvoiceDirective,
	],
	exports: [
		NewItemDialogComponent,

		// NEW INVOICE
		NewInvoiceComponent,

		// INVOICES LIST
		InvoiceListComponent,

		// VIEW INVOICE
		ViewInvoiceComponent,
			NewPaymentDialogComponent,
			DeleteInvoiceDialogComponent,

		// EDIT INVOICE
		EditInvoiceComponent,
			EditReferenceDialogComponent,
			CancelChangesDialogComponent,
	],
	entryComponents: [
		NewItemDialogComponent,
		
		// VIEW INVOICE
		NewPaymentDialogComponent,
		DeleteInvoiceDialogComponent,

		// EDIT INVOICE
		EditReferenceDialogComponent,
		CancelChangesDialogComponent,
	]
})

export class InvoicesModule {

}