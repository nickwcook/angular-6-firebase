import { Component, OnInit, AfterViewInit, ViewChild, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { fadeInAnimation } from '@app/router-animations';
import { NgForm, FormBuilder, FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { MatDialog, MatDialogRef, MatPaginator, MatTableDataSource, MatSort } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { Observable } from 'rxjs';

import * as moment from 'moment';

import { AngularFireDatabase, snapshotChanges } from 'angularfire2/database';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';

import { AuthService } from '@app/services/auth.service';
import { NotificationsService } from '@app/services/notifications.service';
import { InvoicesService } from '@app/services/invoices.service';
import { ContactsService } from '@app/services/contacts.service';

import { Contact } from '@app/contacts/contact.interface';
import { Expense } from '@app/expenses/expense.interface';
import { Invoice } from '../invoice.interface';
import { InvoiceItem } from '../invoice-item.interface';

import { NewItemDialogComponent } from '../dialogs/new-item-dialog/new-item-dialog.component';

import { TaxCodesService } from '@app/services/tax-codes.service';
import { ExpensesService } from '@app/services/expenses.service';

@Component({
	selector: 'app-new-invoice',
	templateUrl: './new-invoice.component.html',
	styleUrls: ['./new-invoice.component.scss'],
      // animations: [
      //       fadeInAnimation
      // ],
      // host: { '[@fadeInAnimation]': '' }
})

export class NewInvoiceComponent implements OnInit {

	userId: string;

	contacts: Contact[];
	contacts$: Observable<Contact[]>;
	selectedContactId = '';
	selectedContact: Contact;

	expenses$: Observable<Expense[]>;

	invoiceId: number;
	invoice: Invoice;
	invoices$: Observable<Invoice[]>;
	invoiceTotals = {
		subtotal: 0,
		tax: 0,
		total: 0
	}

	taxCodes: any[];
	taxCodes$: Observable<any[]>;

	items: InvoiceItem[] = [];
	allowMultiSelect: boolean = true;
	itemsSelection = new SelectionModel(this.allowMultiSelect, []);
	itemsData = new MatTableDataSource<InvoiceItem>();
	newItemDialogRef: MatDialogRef<NewItemDialogComponent>;

	tableColumns = [
		'selectItem',
		'description',
		'quantity',
		'unitPrice',
		'subtotal',
		'taxCode',
		'tax',
		'total'
	]

	newInvoiceForm: FormGroup = this.formBuilder.group({
		contact: new FormControl('', [Validators.required]),
		reference: new FormControl('', [Validators.required]),
		date: new FormControl(moment(), [Validators.required]),
		description: new FormControl('', [Validators.maxLength(200)])
	})

	minDate = moment().subtract(1, 'year');
	maxDate = moment();

	constructor(private router: Router, private authService: AuthService, private notifService: NotificationsService, private contactsService: ContactsService, private expensesService: ExpensesService, private invoicesService: InvoicesService, public taxCodesService: TaxCodesService, private db: AngularFirestore, private formBuilder: FormBuilder, public dialog: MatDialog) {
		this.userId = this.authService.user.uid;

		this.contacts$ = this.contactsService.contactsCollection.valueChanges();
		this.expenses$ = this.expensesService.expensesCollection.valueChanges();
		this.invoices$ = this.invoicesService.invoicesCollection.valueChanges();
		this.taxCodes$ = this.taxCodesService.taxCodesCollection.valueChanges();
	}

	ngOnInit() {

		this.getContacts$()
			.subscribe(
				data => {
					this.contacts = data;
					console.log('NewInvoice.contacts:', data);

					this.selectedContactId = this.contacts[0].id;
					console.log('selectedContactId: ' + this.selectedContactId);

					this.getSelectedContact();
				},
				error => {
					console.error('NewInvoice - Error getting contacts via subscribe() method:', error);
				}
			)
			
		this.getTaxCodes$()
			.subscribe(
				data => {
					this.taxCodes = data;
					console.log('NewInvoice.taxCodes:', data);
				},
				error => {
					console.error('NewInvoice - Error getting taxCodes via subscribe() method:', error);
				}
			)

		// TODO:
		// - Change invoiceId prop from number to string
		// - Add company identifer prefix to sequencing, accessed through auth.service variable
		// - Split invoiceId prop to retrieve id as number via parseInt on split[1] for sorting
		// - Apply company identifier prefix to new invoiceId and convert to string type
		this.getInvoices$()
			.subscribe(
				data => {
					if(data.length) {
						let invoices = data.sort(function(invoice1, invoice2) {
							return invoice1.invoiceId - invoice2.invoiceId;
						})

						console.log('NewInvoice.invoicesService.getInvoices$:', invoices);
						
						this.invoiceId = invoices.slice(-1)[0].invoiceId + 1;
						console.log('NewInvoice.invoiceId: ' + this.invoiceId);
					} else {
						this.invoiceId = 1;
						console.log('NewInvoice.invoicesService.getInvoices$: No invoices. invoiceId set to 1');
					}
				},
				error => {
					console.error('NewInvoice.invoicesService.getInvoices$() - Error getting invoices$:', error);
				}
			)
	}

	ngAfterViewInit() {
		
	}

	getContacts$() {
		return this.contacts$;
	}

	getInvoices$() {
		return this.invoices$;
	}

	getTaxCodes$() {
		return this.taxCodes$;
	}
	
	addContact() {
		console.log('addContact()');
	}
	
	getSelectedContact() {
		this.contactsService.contactsCollection.doc(this.selectedContactId).ref.get().then(snapshot => {
			this.selectedContact = snapshot.data() as Contact;
			console.log('selectedContact:', this.selectedContact);
		})
	}


	// ITEMS

	allItemsSelected() {
		const selectedItems = this.itemsSelection.selected.length;
		const totalItems = this.itemsData.data.length;
		return selectedItems === totalItems;
	}

	toggleSelectAllItems() {
		console.log('NewInvoice.toggleSelectAllItems() - allItemsSelected(): ' + this.allItemsSelected());
		this.allItemsSelected() ? this.itemsSelection.clear() : this.itemsData.data.forEach(item => {
			this.itemsSelection.select(item);
		})
		console.log('NewInvoice.itemsSelection:', this.itemsSelection);
		console.log('NewInvoice - Selected Items (itemsSelection.selected):', this.itemsSelection.selected);
	}

	deleteItems() {
		let _this = this;
		console.log('NewInvoice.deleteItems():', this.itemsSelection.selected);
		console.log('NewInvoice.items:', this.items);

		this.itemsSelection.selected.forEach(item => {
			const itemId = item.itemId;
			const itemIndex = _this.itemsData.data.map(function(x){ return x.itemId; }).indexOf(itemId);

			_this.itemsData.data.splice(itemIndex, 1);

			_this.itemsData = new MatTableDataSource<InvoiceItem>(_this.itemsData.data);
		})

		this.items = this.itemsData.data;

		this.itemsSelection.clear();
		this.calcInvoiceTotals();

		console.log('NewInvoice.items:', this.items);
		console.log('NewInvoice.itemsSelection.selected:', this.itemsSelection.selected);
	}
	
	newItem() {

		console.log('newItem()');

		this.newItemDialogRef = this.dialog.open(NewItemDialogComponent, {
			hasBackdrop: true,
			data: {
				taxCodes: this.taxCodes,
				items: this.items,
				itemsData: this.itemsData
			}
		})

		this.newItemDialogRef.afterClosed().subscribe(item => {
			if (item) {
				item.itemId = this.items.length + 1;
				this.items.push(item);
				this.itemsData.data = this.items;

				console.log('NewInvoiceComponent.newItem:', item);
				console.log('NewInvoiceComponent.items:', this.items);

				this.invoiceTotals.subtotal += item.subtotal;
				this.invoiceTotals.tax += item.tax;
				this.invoiceTotals.total += item.total;
			}
		})

	}

	calcInvoiceTotals() {
		this.invoiceTotals.subtotal = this.invoiceTotals.tax = this.invoiceTotals.total = 0;

		this.items.forEach(item => {
			this.invoiceTotals.subtotal += item.subtotal;
			this.invoiceTotals.tax += item.tax;
			this.invoiceTotals.total += item.total;	
		})
	}

	save() {
		let _this = this;
		
		let newDocRef = _this.db.collection('/users').doc(_this.userId).collection('/invoices').ref.doc().id;
		console.log('newDocRef: ' + newDocRef);
		
		this.invoice = {
			id: newDocRef,
			invoiceId: this.invoiceId,
			reference: this.newInvoiceForm.get('reference').value,
			date: new Date(this.newInvoiceForm.get('date').value),
			contact: this.selectedContact,
			description: this.newInvoiceForm.get('reference').value,
			subtotal: +this.invoiceTotals.subtotal,
			tax: +this.invoiceTotals.tax,
			total: +this.invoiceTotals.total,
			posted: false,
			paid: false
		}

		function saveMainDetails() {
			_this.db.collection('/users').doc(_this.userId).collection('/invoices').doc(newDocRef).set(_this.invoice)
				.then(function(docRef) {
					console.log('NewInvoice.save() - Main details saved:', _this.invoice);
				})
				.catch(function(error) {
					_this.notifService.showNotification('Error saving new invoice details: ' + error.message, 'Close');
				})
		}

		function saveItems() {
			// for (let item of _this.items) {
			// 	_this.db.collection('/users').doc(_this.userId).collection('/invoices').doc(newDocRef).collection('/items').add(item)
			// 		.then(function(docRef) {
			// 			console.log('NewInvoice.save() - Item added to items collection: ', item);
			// 		})
			// 		.catch(function(error) {
			// 			_this.notifService.showNotification('Error saving items to new invoice: ' + error.message, 'Close');
			// 			console.error('Error adding document to items collection: ' + error.message);
			// 		})
			// }

			// Update to full es6 format
			_this.items.forEach(item => {
				_this.db.collection('/users').doc(_this.userId).collection('/invoices').doc(newDocRef).collection('/items').add(item)
					.then(function(docRef) {
						console.log('NewInvoice.save() - Item added to items collection: ', item);
					})
					.catch(function(error) {
						_this.notifService.showNotification('Error saving items to new invoice: ' + error.message, 'Close');
						console.error('Error adding document to items collection: ' + error.message);
					})
			})
		}

		return Promise.all([
			saveMainDetails(),
			saveItems()
		])
		.then(function() {
			console.log('NewInvoice.save() - All promises resolved');
			_this.notifService.showNotification('New invoice created', 'Close');
			setTimeout(function() {
				_this.router.navigateByUrl('/invoices/all');
			}, 500)
		})
		.catch(function(error) {
			_this.notifService.showNotification('Error saving invoice: ' + error.message, 'Close');
			console.error('Error saving new invoice:', error);
		})

	}

	reset() {
		console.log('reset()');
		this.newInvoiceForm.reset();
	}

}