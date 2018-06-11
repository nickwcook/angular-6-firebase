import { Component, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { MatSnackBar } from '@angular/material';

import { AngularFirestore } from 'angularfire2/firestore';
import * as firebase from 'firebase/app';

import { ElectronService } from 'ngx-electron';

import { AuthService } from './services/auth.service';
import { NotificationsService } from './services/notifications.service';
import { UserService } from './services/user.service';
import { TaxCodesService } from './services/tax-codes.service';
import { SortByPipe } from './pipes/sort-by.pipe';

import { fadeInAnimation } from "@app/router-animations";

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss'],
      // animations: [
      //       fadeInAnimation
      // ],
      // host: { '[@fadeInAnimation]': '' }
})

export class AppComponent {
	
	appTitle = 'Angular 5 Firebase App';
	appAuthor = 'Nick Cook';
	
	titles: any[];
    
	notifications: any[];
	
	constructor(private http: HttpClient, public db: AngularFirestore, 
		private electronService: ElectronService, 
		public authService: AuthService, private notifService: NotificationsService, private userService: UserService, private router: Router, public snackbar: MatSnackBar, private taxCodesService: TaxCodesService) {
		
        this.titles = userService.titles;
        
        this.notifications = notifService.notifications;
		
        this.notifService.notification.subscribe(message => {
			snackbar.open(message, null, {
				duration: 3000			  
			});
		})
		
	}
	
	ngOnInit() {
//		if (!this.isAuthenticated) {
//			console.log('Not authenticated');
//		 	this.router.navigateByUrl('/login');
//		}

		this.logAsyncTest();
	}
    
    get isAuthenticated(): boolean {
        return this.authService.isAuthenticated;
    }
    
    get user() {
        return this.authService.user;
    }
	
	signOut() {
        this.authService.signOut();
	}
	
	updateProfile() {
		this.userService.updateProfile();
	}


	/* ---------------- ASYNC/AWAIT TEST ---------------- */

	getAsyncData(): Promise<object> {
		return this.http.get('https://world.openfoodfacts.org/api/v0/product/737628064502.json').toPromise();
	}

	async logAsyncTest() {
		console.log('logAsyncTest() - Awaiting promise from getData()...');
		try {
			var data = await this.getAsyncData();
			console.log('logAsyncTest().data:', data);
		}
		catch(err) {
			console.error('logAsyncTest().error:', err);
		}
	}
}