import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

import * as firebase from 'firebase/app';
import { AngularFireAuth } from 'angularfire2/auth';

import { NotificationsService } from './notifications.service';

@Injectable()

export class AuthService {
    
    public user: firebase.User;
    
    isAuthenticated: boolean = false;

	constructor(public firebaseAuth: AngularFireAuth, private router: Router, private notifService: NotificationsService) {
        
	}
    
    signIn(email: string, password: string) {
        this.firebaseAuth
            .auth
            .signInWithEmailAndPassword(email, password)
            .then(value => {
                console.log('AuthService - Signed In');
                this.isAuthenticated = true;
                this.router.navigateByUrl('/dashboard');
				this.notifService.showNotification('Logged in as ' + email, 'Close');
                this.user = firebase.auth().currentUser;
            })
            .catch(err => {
                console.log('AuthService - Sign-In Error: ', err.message);
				this.notifService.showNotification('ERROR: ' + err.message, null);
            })
        
//        firebase.auth().onAuthStateChanged(user => {
//            if (user) {
//                this.isAuthenticated = true;
//                console.log('Login state persisted');
//            } else {
//                this.isAuthenticated = false;
//                console.log('Login state not persisted');
//            }
//        })
    }
    
    signInGoogle() {
        return this.firebaseAuth.auth.signInWithPopup(
            new firebase.auth.GoogleAuthProvider()
        )
    }
    
    signOut() {
        this.firebaseAuth
            .auth
            .signOut();
			this.notifService.showNotification('Signed out', null);
        this.isAuthenticated = false;
        this.router.navigateByUrl('/login');
        console.log('AuthService - Signed Out');
    }
    
    register(email: string, password: string) {
        this.firebaseAuth
            .auth
            .createUserWithEmailAndPassword(email, password)
            .then(value => {
                console.log('AuthService - Registration Successful', value);
                this.isAuthenticated = true;
                this.router.navigateByUrl('/dashboard');
				// this.notifService.notification.next('Account created for ' + email);
				this.notifService.showNotification('Account created for: ' + email, null);
             })
             .catch(err => {
                console.log('Registration Error: ', err.message);
				// this.notifService.notification.next('ERROR: ' + err.message);
				this.notifService.showNotification('ERROR: ' + err.message, null);
            });    
    }

}
