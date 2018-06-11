import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';

import { AuthService } from './auth.service';

@Injectable()

export class NominalsService {
    
    userId: string;

    constructor(private authService: AuthService) {
        this.userId = this.authService.user.uid;
    }   

}
