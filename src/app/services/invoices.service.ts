import { Injectable } from '@angular/core';
import { of as observableOf,  Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';

import { AuthService } from '../services/auth.service';

import { Invoice } from '@app/invoices/invoice.interface';
import { InvoiceItem } from '../invoices/invoice-item.interface';
import { database } from 'firebase';

@Injectable()
export class InvoicesService {

	invoicesCollection: AngularFirestoreCollection<Invoice>;
    invoices$: Observable<Invoice[]>;
    invoices: Invoice[];

    selectedInvoice: Invoice;
    selectedInvoiceItems: InvoiceItem[];

	constructor(private authService: AuthService, private db: AngularFirestore) {
        
        debugger;
        this.invoicesCollection = this.db.collection('/users').doc(this.authService.user.uid).collection('/invoices');

        this.invoices$ = this.invoicesCollection.snapshotChanges().pipe(
            map(changes => {
                return changes.map(a => {
                    const data = a.payload.doc.data() as Invoice;
                    data.id = a.payload.doc.id;
                    return data;
                })
            }),
            catchError(err => observableOf(null))
        )
    }
    
    getInvoices$() {
        return this.invoices$;
    }
	
}
