import { Injectable } from '@angular/core';
import { of as observableOf,  Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';

import { AuthService } from './auth.service';

export interface Nominal {
    id: string;
    nominalId: number;
    name: string;
}

@Injectable()
export class NominalsService {

	nominalsCollection: AngularFirestoreCollection<Nominal>;
    nominals$: Observable<Nominal[]>;

    constructor(private authService: AuthService, private db: AngularFirestore) {
        
        this.nominalsCollection = this.db.collection('/users').doc(this.authService.user.uid).collection('/nominals');

        this.nominals$ = this.nominalsCollection.snapshotChanges().pipe(
            map(changes => {
                return changes.map(a => {
                    const data = a.payload.doc.data() as Nominal;
                    data.id = a.payload.doc.id;
                    return data;
                })
            }),
            catchError(err => observableOf(null))
        )
    }
    
    getNominals$() {
        return this.nominals$;
    }

}
