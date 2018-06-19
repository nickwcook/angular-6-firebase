import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';

import { AngularFirestore } from 'angularfire2/firestore';

import { AuthService } from '@app/services/auth.service';
import { UserService } from '@app/services/user.service';
import { InvoicesService } from '@app/services/invoices.service';
import { ExpensesService } from '@app/services/expenses.service';
import { ContactsService } from '@app/services/contacts.service';

import { Invoice } from '@app/invoices/invoice.interface';
import { Expense } from '@app/expenses/expense.interface';
import { Contact } from '@app/contacts/contact.interface';

import { fadeInAnimation } from '@app/router-animations';

@Component({
	selector: 'app-dashboard',
	templateUrl: './dashboard.component.html',
      styleUrls: ['./dashboard.component.scss'],
      animations: [
            fadeInAnimation
      ],
      host: { '[@fadeInAnimation]': '' }
})

export class DashboardComponent implements OnInit {


	// NG2-CHART TEST
	chartTestData:Array<any>= [
		{
			data: [ 52000, 51400, 64000, 64150, 65600, 71000 ], 
			label: 'Income'
		},
		{
			data: [ 64000, 63450, 62300, 60050, 57600, 63900 ], 
			label: 'Expenses'
		}
	] 

	chartTestLabels: Array<any> = [
		'Jan',
		'Feb',
		'Mar',
		'Apr',
		'May',
		'Jun'
	]

	chartTestOptions: any = {
		responsive: true
	}

	chartTestColours: Array<any> = [
		{ // grey
		  backgroundColor: 'rgba(148,159,177,0.2)',
		  borderColor: 'rgba(148,159,177,1)',
		  pointBackgroundColor: 'rgba(148,159,177,1)',
		  pointBorderColor: '#fff',
		  pointHoverBackgroundColor: '#fff',
		  pointHoverBorderColor: 'rgba(148,159,177,0.8)'
		},
		{ // dark grey
		  backgroundColor: 'rgba(77,83,96,0.2)',
		  borderColor: 'rgba(77,83,96,1)',
		  pointBackgroundColor: 'rgba(77,83,96,1)',
		  pointBorderColor: '#fff',
		  pointHoverBackgroundColor: '#fff',
		  pointHoverBorderColor: 'rgba(77,83,96,1)'
		}
	]

	chartTestLegend: boolean = true;

	//
	
	invoices: Invoice[];
	expenses: Expense[];
	contacts: Contact[];

	constructor(private db: AngularFirestore, private authService: AuthService, private userService: UserService, private invoicesService: InvoicesService, private expensesService: ExpensesService, private contactsService: ContactsService, private route: ActivatedRoute, private router: Router) {

    }
	
	ngOnInit() {
		this.invoicesService.getInvoices$()
			.subscribe(
				data => {
					if (data.length) {
						this.invoices = data;
						console.log('Dashboard.invoicesService.getInvoices$():', this.invoices);
					} else {
						console.log('Dashboard.invoicesService.getInvoices$() - No invoices in collection');
					}
				},
				error => {
					console.error(`Dashboard.invoicesService.getInvoices$() - Error getting invoices: ${error}`);
				}
			)

		this.expensesService.getExpenses$()
			.subscribe(
				data => {
					if (data.length) {
						this.expenses = data;
						console.log('Dashboard.expensesService.getExpenses$():', this.expenses);
					} else {
						console.log('Dashboard.expensesService.getExpenses$() - No expenses in collection');
					}
				},
				error => {
					console.error(`Dashboard.expensesService.getExpenses$() - Error getting expenses: ${error}`);
				}
			)

		this.contactsService.getContacts$()
			.subscribe(
				data => {
					if (data.length) {
						this.contacts = data;
						console.log('Dashboard.contactsService.getContacts$():', this.contacts);
					} else {
						console.log('Dashboard.contactsService.getContacts$() - No contacts in collection');
					}
				},
				error => {
					console.error(`Dashboard.contactsService.getContacts$() - Error getting contacts: ${error}`);
				}
			)
	}

}
