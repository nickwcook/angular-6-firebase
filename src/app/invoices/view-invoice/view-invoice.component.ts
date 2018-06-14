import { Component, OnInit, AfterViewInit, ViewChild, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatDialog, MatDialogRef, MatPaginator, MatTableDataSource, MatSort } from '@angular/material';

import { of as observableOf,  Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';

import { AuthService } from '@app/services/auth.service';
import { NotificationsService } from '@app/services/notifications.service';
import { InvoicesService } from '@app/services/invoices.service';

import { Invoice } from '../invoice.interface';
import { InvoiceItem } from '../invoice-item.interface';
import { InvoicePayment } from '../invoice-payment.interface';

import { DeleteInvoiceDialogComponent } from './dialogs/delete-invoice-dialog.component';

@Component({
	selector: 'app-view-invoice',
	templateUrl: './view-invoice.component.html',
	styleUrls: ['./view-invoice.component.scss']
})

export class ViewInvoiceComponent implements OnInit, AfterViewInit {
	
	userId: string;

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
	paymentsData = new MatTableDataSource<InvoicePayment>();

	paymentsTableColumns = [
		'reference',
		'date',
		'amount',
		'bank'
	]

	deleteDialogRef: MatDialogRef<DeleteInvoiceDialogComponent>;

	@ViewChild(MatPaginator) paginator: MatPaginator;
	@ViewChild(MatSort) sort: MatSort;

	constructor(private authService: AuthService, private notifService: NotificationsService, private invoicesService: InvoicesService, private db: AngularFirestore, private route: ActivatedRoute, private dialog: MatDialog) {
		
		this.userId = this.authService.user.uid;
		
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
		
	}

	ngOnInit() {

	}
	
	ngAfterViewInit() {
		this.getItems$().subscribe(
			data => {
				this.itemsData.data = data;
			}
		)
        this.itemsData.paginator = this.paginator;
		this.itemsData.sort = this.sort;
	}
	
	getItems$() {
		return this.items$;
	}
	
	editItem(item) {
		console.log('ViewInvoice.editItem( ' + '\'' + item.description + '\'' + ' )', item);
	}

	addPayment() {
		console.log('ViewInvoice.addPayment()');
	}
	
	editInvoice() {
		console.log('ViewInvoice.editInvoice()');
	}

	unpostInvoice() {
		let _this = this;

		console.log('ViewInvoice.unpostInvoice()');

		this.invoice.posted = false;

		this.db.collection('users').doc(this.userId).collection('invoices').doc(this.invoice.id).set(this.invoice)
			.then(function() {
				console.log('ViewInvoice.unpostInvoice() - Invoice successfully unposted');
				_this.notifService.showNotification('Invoice unposted', 'Close');
			})
			.catch(function(error) {
				console.log('ViewInvoice.unpostInvoice() - Error unposting invoice: ' + error.message);
				_this.notifService.showNotification('Error unposting invoice: ' + error.message, 'Close');
			})
	}
	
	deleteInvoice(userId, invoiceId) {
		console.log('ViewInvoice.deleteInvoice()');

		this.deleteDialogRef = this.dialog.open(DeleteInvoiceDialogComponent, {
			hasBackdrop: true,
			data: {
				userId: this.userId,
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
