
import { Injectable } from '@angular/core';

import { of as observableOf,  Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';

import { AuthService } from '../services/auth.service';

import { Expense } from '@app/expenses/expense.interface';

@Injectable()
export class ExpensesService {

  userId: string;

  selectedExpense: Expense;

  expensesCollection: AngularFirestoreCollection<Expense>;
  expenses$: Observable<Expense[]>;

  constructor(private db: AngularFirestore, private authService: AuthService) {
    this.userId = this.authService.user.uid;

    this.expensesCollection = this.db.collection('/users').doc(this.userId).collection('/expenses');

    this.expenses$ = this.expensesCollection.snapshotChanges().pipe(
      map(changes => {
        return changes.map(a => {
          const data  = a.payload.doc.data() as Expense;
          data.id = a.payload.doc.id;
          return data;
        })
      }),
      catchError(err => observableOf(null))
    )
  }

  getExpenses$() {
    return this.expenses$;
  }

}
