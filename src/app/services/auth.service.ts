import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog, MatDialogRef } from '@angular/material';
import { Observable } from 'rxjs';

import * as firebase from 'firebase/app';
import { AngularFireAuth } from 'angularfire2/auth';

import { NotificationsService } from './notifications.service';

import { VerifyEmailDialogComponent } from '@app/register/dialogs/verify-email-dialog/verify-email-dialog.component';
import { SelectionModel } from '@angular/cdk/collections';

@Injectable()

export class AuthService {
    
    public user: firebase.User;
    
    isAuthenticated: boolean = false;

	verifyEmailDialogRef: MatDialogRef<VerifyEmailDialogComponent>;

	constructor(public firebaseAuth: AngularFireAuth, private router: Router, private notifService: NotificationsService, private dialog: MatDialog) {
        
	}
    
    signIn(email: string, password: string) {
        
        let _component = this;

        _component.firebaseAuth
            .auth
            .signInWithEmailAndPassword(email, password)
            .then(value => {
                if (firebase.auth().currentUser.emailVerified) {
                    console.log('AuthService - Signed In');
                    _component.isAuthenticated = true;
                    _component.router.navigateByUrl('/dashboard');
                    _component.notifService.showNotification('Logged in as ' + email, 'Close');
                    _component.user = firebase.auth().currentUser;
                } else {
                    _component.notifService.showNotification('You must verify your email using the link sent to your email address before signing in', 'Close');
                }
            })
            .catch(err => {
                console.log('AuthService - Sign-In Error: ', err.message);
				_component.notifService.showNotification('ERROR: ' + err.message, null);
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

        let _component = this;

        this.firebaseAuth
            .auth
            .createUserWithEmailAndPassword(email, password)
            .then(value => {
                console.log('AuthService - Registration Successful', value);

                var user = firebase.auth().currentUser;

                user.sendEmailVerification()
                    .then(function() {
                        _component.verifyEmailDialogRef = _component.dialog.open(VerifyEmailDialogComponent, {
                            hasBackdrop: true
                        })
                    })
                    .catch(function(err) {
                        console.error('AuthService.register() - Error sending verification email:', err.message);
                        _component.notifService.showNotification('Error sending verification email: ' + err.message, null);
                    })
             })
             .catch(err => {
                console.log('Registration Error: ', err.message);
				this.notifService.showNotification('ERROR: ' + err.message, null);
            })
    }

}
