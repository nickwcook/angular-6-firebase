import { Component, OnInit, AfterViewInit, ViewChild, ViewChildren, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatDialog, MatDialogRef, MatPaginator, MatTableDataSource, MatSort } from '@angular/material';

import { of as observableOf,  Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import { AngularFireDatabase, snapshotChanges } from 'angularfire2/database';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';

import { AuthService } from '@app/services/auth.service';
import { NotificationsService } from '@app/services/notifications.service';
import { InvoicesService } from '@app/services/invoices.service';

import { Invoice } from '../invoice.interface';
import { InvoiceItem } from '../invoice-item.interface';
import { InvoicePayment } from '../invoice-payment.interface';

import { NewPaymentDialogComponent } from './dialogs/new-payment-dialog/new-payment-dialog.component';
import { DeleteInvoiceDialogComponent } from './dialogs/delete-invoice-dialog.component';

@Component({
	selector: 'app-view-invoice',
	templateUrl: './view-invoice.component.html',
	styleUrls: ['./view-invoice.component.scss']
})

export class ViewInvoiceComponent implements OnInit, AfterViewInit {

	invoiceId: string;
	invoice: Invoice;
	
	itemsCollection: AngularFirestoreCollection<InvoiceItem>;
    items$: Observable<InvoiceItem[]>;
	itemsData = new MatTableDataSource<InvoiceItem>();

	itemsTableColumns = [
		'description',
		'quantity',
		'unitPrice',
		'subtotal',
		'taxCode',
		'tax',
		'total'
	]

	paymentsCollection: AngularFirestoreCollection<InvoicePayment>;	
	payments$: Observable<InvoicePayment[]>;
	payments: InvoicePayment[];
	totalPaid: number;
	paymentsData = new MatTableDataSource<InvoicePayment>();

	paymentsTableColumns = [
		'reference',
		'date',
		'amount',
		'bank'
	]

	deleteDialogRef: MatDialogRef<DeleteInvoiceDialogComponent>;
	newPaymentDialogRef: MatDialogRef<NewPaymentDialogComponent>;

	@ViewChild(MatPaginator) itemsPaginator: MatPaginator;
	@ViewChild(MatSort) itemsSort: MatSort;

	constructor(private authService: AuthService, private notifService: NotificationsService, private invoicesService: InvoicesService, private db: AngularFirestore, private route: ActivatedRoute, private dialog: MatDialog) {
		
		this.invoice = this.invoicesService.selectedInvoice;
		
		this.items$ = this.invoicesService.invoicesCollection.doc(this.invoice.id).collection('/items').snapshotChanges().pipe(
			map(changes => {
				return changes.map(a => {
					const data = a.payload.doc.data() as InvoiceItem;
					data.id = a.payload.doc.id;
					return data;
				})
			}),
			catchError(err => observableOf(null))
		)

		this.payments$ = this.invoicesService.invoicesCollection.doc(this.invoice.id).collection('/payments').snapshotChanges().pipe(
			map(changes => {
				return changes.map(a => {
					const data = a.payload.doc.data() as InvoicePayment;
					data.id = a.payload.doc.id;
					return data;
				})
			}),
			catchError(err => observableOf(null))
		)
		
	}

	ngOnInit() {
		this.getItems().subscribe(
			data => {
				this.itemsData.data = data;
			},
			error => {
				console.error(`ViewInvoice - Error subscribing to items in getItems(): ${error}`);
			}
		)
		
		this.getPayments().subscribe(
			data => {
				this.payments = data;
				this.paymentsData.data = data;

				this.calcPaymentTotals();
			},
			error => {
				console.error(`ViewInvoice - Error subscribing to payments in getPayments(): ${error}`);
			}
		)
	}
	
	ngAfterViewInit() {
		this.itemsData.paginator = this.itemsPaginator;
		this.itemsData.sort = this.itemsSort;
	}
	
	getItems() {
		return this.items$;
	}
	
	editItem(item) {
		console.log(`ViewInvoice.editItem('${item.description}')`, item);
	}

	getPayments() {
		return this.payments$;
	}

	addPayment() {
		let _this = this;

		console.log('ViewInvoice.addPayment()');
		
		this.newPaymentDialogRef = this.dialog.open(NewPaymentDialogComponent, {
			hasBackdrop: true,
			data: {
				userId: _this.authService.user.uid,
				invoice: _this.invoice,
				payments: _this.payments
			}
		})

		this.newPaymentDialogRef.afterClosed().subscribe(payment => {
			if (payment) {
				_this.payments.push(payment);
				_this.paymentsData.data = _this.payments;

				_this.db.collection('/users').doc(_this.authService.user.uid).collection('/invoices').doc(_this.invoice.id).collection('/payments').doc(payment.id).set(payment)
					.then(function(docRef) {
						console.log('ViewInvoice.addPayment() - New payment saved:', payment);
						_this.notifService.showNotification('Payment added', 'Close');
					})
					.catch(function(error) {
						console.error(`ViewInvoice.addPayment() - Error saving new payment: ${error.message}`);
						_this.notifService.showNotification(`Error adding new payment: ${error.message}`, 'Close');
					})

				_this.calcPaymentTotals(payment);
			}
		})
	}

	calcPaymentTotals(newPayment?) {
		let _component = this;

		this.totalPaid = 0;

		this.payments.forEach(payment => {
			this.totalPaid += payment.amount;
		})

		this.invoice.remainderDue = this.invoice.total - this.totalPaid;

		console.log(`ViewInvoice.totalPaid: ${this.totalPaid}`);
		console.log(`ViewInvoice.invoice.total: ${this.invoice.total}`);

		if (+this.totalPaid.toFixed(2) === +this.invoice.total.toFixed(2)) {
			this.invoice.paid = true;

			if (newPayment) {
				_component.db.collection('/users').doc(_component.authService.user.uid).collection('/invoices').doc(_component.invoice.id).set(_component.invoice)
					.then(function() {
						console.log('ViewInvoice.calcPaymentTotals() - Invoice fully-paid and saved');
						// _component.notifService.showNotification('Invoice fully-paid', 'Close');
					})
					.catch(function(error) {
						console.log(`ViewInvoice.calcPaymentTotals() - Error saving fully-paid invoice: ${error.message}`);
						_component.notifService.showNotification(`Error saving fully-paid invoice: ${error.message}`, 'Close');
					})
			}
		}
	}
	
	editInvoice() {
		console.log('ViewInvoice.editInvoice()');
	}

	unpostInvoice() {
		let _this = this;

		console.log('ViewInvoice.unpostInvoice()');

		this.invoice.posted = false;

		this.db.collection('users').doc(this.authService.user.uid).collection('invoices').doc(this.invoice.id).set(this.invoice)
			.then(function() {
				console.log('ViewInvoice.unpostInvoice() - Invoice successfully unposted');
				_this.notifService.showNotification('Invoice unposted', 'Close');
			})
			.catch(function(error) {
				console.log(`ViewInvoice.unpostInvoice() - Error unposting invoice: ${error.message}`);
				_this.notifService.showNotification(`Error unposting invoice: ${error.message}`, 'Close');
			})
	}
	
	deleteInvoice(userId, invoiceId) {
		console.log('ViewInvoice.deleteInvoice()');

		this.deleteDialogRef = this.dialog.open(DeleteInvoiceDialogComponent, {
			hasBackdrop: true,
			data: {
				userId: this.authService.user.uid,
				invoiceId: this.invoice.id
			}
		})

	}

	ngOnDestroy() {
		this.invoicesService.selectedInvoice = this.invoice;
		console.log('ViewInvoice.OnDestroy().invoice:', this.invoice);
		console.log('InvoicesService.selectedInvoice:', this.invoicesService.selectedInvoice);

		this.invoicesService.selectedInvoiceItems = this.itemsData.data;
		console.log('ViewInvoice.OnDestroy().itemsData.data:', this.itemsData.data);
		console.log('InvoicesService.selectedInvoiceItems:', this.invoicesService.selectedInvoiceItems);
	}

}
