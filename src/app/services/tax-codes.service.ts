import { Injectable } from '@angular/core';

import { of as observableOf,  Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';

import { AuthService } from './auth.service';
import { NewItemDialogComponent } from '@app/invoices/dialogs/new-item-dialog/new-item-dialog.component';

@Injectable()

export class TaxCodesService {
    
    taxCodesCollection: AngularFirestoreCollection<any>;
    taxCodes$: Observable<any[]>;
    selectedTaxCode: any;

    constructor(private authService: AuthService, private db: AngularFirestore) {
        this.taxCodesCollection = this.db.collection('/taxCodes');

        this.taxCodes$ = this.taxCodesCollection.snapshotChanges().pipe(
            map(changes => {
                return changes.map(a => {
                    const data = a.payload.doc.data();
                    data.id = a.payload.doc.id;
                    return data;
                })
            }),
            catchError(err => observableOf(null))
        )
    }

    getTaxCodes$() {
        return this.taxCodes$;
    }

    getSelectedTaxCode(selectedRate) {
        let _this = this;
        this.taxCodesCollection.ref.where('rate', '==', selectedRate).get().then(function(querySnapshot) {
            querySnapshot.forEach(function(documentSnapshot) {
                _this.selectedTaxCode = documentSnapshot.data();
                console.log('TaxCodesService.getSelectedTaxCode().selectedTaxCode:', _this.selectedTaxCode);
            })
        })
        return this.selectedTaxCode;
    }

}
