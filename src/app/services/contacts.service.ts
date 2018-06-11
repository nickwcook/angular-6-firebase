
import { Injectable } from '@angular/core';

import { of as observableOf,  Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';

import { AuthService } from './auth.service';

import { Contact } from '@app/contacts/contact.interface';

@Injectable()
export class ContactsService {

  userId: string;

  selectedContact: Contact;

  contactsCollection: AngularFirestoreCollection<Contact>;
  contacts$: Observable<Contact[]>;

  constructor(private authService: AuthService, private db: AngularFirestore) {
    this.userId = this.authService.user.uid;
    
    this.contactsCollection = this.db.collection('/users').doc(this.userId).collection('/contacts');
    
    // RXJS V5
    // this.contacts$ = this.contactsCollection.snapshotChanges().map(changes => {
    //     return changes.map(a => {
    //         const data = a.payload.doc.data() as Contact;
    //         data.id = a.payload.doc.id;
    //         return data;
    //     })
    // })

    // RXJS V6
    this.contacts$ = this.contactsCollection.snapshotChanges().pipe(
      map(changes => {
        return changes.map(a => {
          const data = a.payload.doc.data() as Contact;
          data.id = a.payload.doc.id;
          return data;
        })
      }),
      catchError(err => observableOf(null))
    )
  }

  getContacts$() {
    return this.contacts$;
  }

}
