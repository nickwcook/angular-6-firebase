import { Component, OnInit, AfterViewInit, ViewChild, Input } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
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

import { EditReferenceDialogComponent } from './dialogs/edit-reference-dialog/edit-reference-dialog.component';
import { NewItemDialogComponent } from '../dialogs/new-item-dialog/new-item-dialog.component';

import { TaxCodesService } from '@app/services/tax-codes.service';
import { ExpensesService } from '@app/services/expenses.service';

import { isEqual } from 'lodash';

@Component({
  selector: 'app-edit-invoice',
  templateUrl: './edit-invoice.component.html',
  styleUrls: ['./edit-invoice.component.scss']
})

export class EditInvoiceComponent implements OnInit {

	userId: string;

	contacts: Contact[];
	contacts$: Observable<Contact[]>;
	selectedContactId = '';
	selectedContact: Contact;

	expenses$: Observable<Expense[]>;

	invoiceId: number;
	invoice: Invoice;
	initModel: Invoice;
	invoices$: Observable<Invoice[]>;

	items: any[];
	initItems: any[];
	newItems: InvoiceItem[] = [];
	allowMultiSelect: boolean = true;
	itemsSelection = new SelectionModel(this.allowMultiSelect, []);
	deletedItems: InvoiceItem[] = [];
	itemsData = new MatTableDataSource<InvoiceItem>();

	taxCodes: any[];
	taxCodes$: Observable<any[]>;

	editReferenceDialogRef: MatDialogRef<EditReferenceDialogComponent>;
	newItemDialogRef: MatDialogRef<NewItemDialogComponent>;

	changesMade: boolean = false;

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

	@ViewChild(MatSort) sort: MatSort;

	constructor(private router: Router, private authService: AuthService, private notifService: NotificationsService, private contactsService: ContactsService, private expensesService: ExpensesService, public invoicesService: InvoicesService, private taxCodesService: TaxCodesService, private db: AngularFirestore, private formBuilder: FormBuilder, public dialog: MatDialog) {
		this.userId = this.authService.user.uid;

		this.taxCodes$ = this.taxCodesService.taxCodesCollection.valueChanges();

		this.invoice = this.invoicesService.selectedInvoice;
		this.initModel = {...this.invoice};

		this.items = this.invoicesService.selectedInvoiceItems;
		this.initItems = [...this.items];
		this.itemsData.data = this.items;
	}

	ngOnInit() {
		this.compareModels();

		this.getTaxCodes$()
			.subscribe(
				data => {
					this.taxCodes = data;
					console.log('EditInvoice.getTaxCodes$.subscribe().data:', data);
				},
				error => {
					console.error('EditInvoice.getTaxCodes$.subscribe() - Error retrieving data:', error);
				}
			)
	}
	
	ngAfterViewInit() {
		this.itemsData.sort = this.sort;
	}

	getTaxCodes$() {
		return this.taxCodes$;
	}

	compareModels() {
		console.log('compareModels()');
		
		if (isEqual(this.invoice, this.initModel) && isEqual(this.items, this.initItems)) {
			console.log('No changes have been made to invoice');
			this.changesMade = false;
		} else {
			console.log('Changes have been made to invoice');
			this.changesMade = true;
		}
	}


	// ITEMS

	allItemsSelected() {
		const selectedItems = this.itemsSelection.selected.length;
		const totalItems = this.itemsData.data.length;
		return selectedItems === totalItems;
	}

	toggleSelectAllItems() {
		console.log('EditInvoice.toggleSelectAllItems() - allItemsSelected(): ' + this.allItemsSelected());
		this.allItemsSelected() ? this.itemsSelection.clear() : this.itemsData.data.forEach(item => {
			this.itemsSelection.select(item);
		})
		console.log('EditInvoice.itemsSelection:', this.itemsSelection);
		console.log('EditInvoice - Selected Items (itemsSelection.selected):', this.itemsSelection.selected);
	}

	addItem() {
		console.log('EditInvoice.addItem()');
		console.log('EditInvoice.items:', this.items);

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
				this.newItems.push(item);
				this.itemsData.data = this.items;
				
				this.compareModels();
				this.calcInvoiceTotals();
			}
		})
	}
	
	editItem(item) {
		console.log('EditInvoice.editItem( ' + '\'' + item.description + '\'' + ' )', item);
	}

	deleteItems() {
		let _this = this;
		console.log('EditInvoice.deleteItems():', this.itemsSelection.selected);
		console.log('EditInvoice.items:', this.items);

		this.itemsSelection.selected.forEach(item => {
			_this.deletedItems.push(item);

			const itemId = item.itemId;
			const itemIndex = _this.itemsData.data.map(function(x){ return x.itemId; }).indexOf(itemId);

			_this.itemsData.data.splice(itemIndex, 1);

			_this.itemsData = new MatTableDataSource<InvoiceItem>(_this.itemsData.data);
		})

		this.items = this.itemsData.data;

		this.compareModels();
		this.itemsSelection.clear();
		this.calcInvoiceTotals();

		console.log('EditInvoice.deletedItems:', this.deletedItems);
		console.log('EditInvoice.initItems:', this.initItems);
		console.log('EditInvoice.items:', this.items);
		console.log('EditInvoice.itemsSelection.selected:', this.itemsSelection.selected);
	}

	undoDeleteItem() {
		console.log('EditInvoice.undoDeleteItem()');

		this.compareModels();
		// TODO:
	}


	// REFERENCE
	
	editReference() {
		console.log('editReference()');

		this.editReferenceDialogRef = this.dialog.open(EditReferenceDialogComponent, {
			hasBackdrop: true,
			data: {
				currentReference: this.invoice.reference
			}
		})

		this.editReferenceDialogRef.afterClosed().subscribe(newReference => {
			if (newReference) {
				this.invoice.reference = newReference;
				this.compareModels();
			}
		})
	}


	// INVOICE ACTIONS

	cancel() {
		// TODO: Dialog if changesMade - Confirm cancellation to discard changes
		this.invoice = this.initModel;
		this.router.navigateByUrl('/invoices/' + this.invoice.id);
	}

	postInvoice() {
		console.log('EditInvoice.postInvoice()');

		this.invoice.posted = true;

		// TODO: Prevent post if changesMade && !saved
	}

	calcInvoiceTotals() {
		this.invoice.subtotal = this.invoice.tax = this.invoice.total = 0;

		this.items.forEach(item => {
			this.invoice.subtotal += item.subtotal;
			this.invoice.tax += item.tax;
			this.invoice.total += item.total;	
		})
	}

	saveChanges() {
		console.log('saveChanges()');

		let _this = this;
		
		this.calcInvoiceTotals();

		function saveMainDetails() {
			_this.db.collection('/users').doc(_this.userId).collection('/invoices').doc(_this.invoice.id).set(_this.invoice)
				.then(function() {
					console.log('EditInvoice.save().saveMainDetails() - Main details saved:', _this.invoice);
					_this.initModel = _this.invoice;
				})
				.catch(function(error) {
					_this.notifService.showNotification('Error saving invoice details: ' + error.message, 'Close');
					console.error('EditInvoice.save().saveMainDetails() - Error saving invoice details: ', error.message);
				})
		}

		function saveItems() {
			for (let item of _this.newItems) {
				_this.db.collection('/users').doc(_this.userId).collection('/invoices').doc(_this.invoice.id).collection('/items').add(item)
					.then(function() {
						console.log('EditInvoice.save().saveItems() - Item added to items collection: ', item);
						// _this.changesMade = false;
					})
					.catch(function(error) {
						_this.notifService.showNotification('Error saving items to new invoice: ' + error.message, 'Close');
						console.error('EditInvoice.save().saveItems() - Error adding document to items collection: ' + error.message);
					})
			}
		}

		function deleteItems() {
			for (let item of _this.deletedItems) {
				_this.db.collection('/users').doc(_this.userId).collection('/invoices').doc(_this.invoice.id).collection('/items').doc(item.id.toString()).delete()
				.then(function() {
					console.log('EditInvoicesave().deleteItems() - Item deleted from invoice - ' + '\'' + item.description + '\'');
				})
				.catch(function(error) {
				  console.error('EditInvoicesave().deleteItems - Error deleting item' + '\'' + item.description + '\'' + ':', error);
				})
			}
		}

		return Promise.all([
			saveMainDetails(),
			saveItems(),
			deleteItems()
		])
		.then(function() {
			console.log('EditInvoice.save().Promise.all() - All promises resolved');
			_this.notifService.showNotification('Changes saved', 'Close');
			setTimeout(function() {
				_this.router.navigateByUrl('/invoices/' + _this.invoice.id);
			}, 500)
		})
		.catch(function(error) {
			_this.notifService.showNotification('EditInvoice.save().Promise.all() - Error saving invoice: ' + error.message, 'Close');
			console.error('EditInvoice.save().Promise.all() - Error saving invoice:', error);
		})
	}
	
}