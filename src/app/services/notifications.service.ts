import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material';

import { Subject } from 'rxjs';

@Injectable()

export class NotificationsService {

	public notification: Subject<string> = new Subject();
    
    notifications: any[];
	
 	constructor(private snackbar: MatSnackBar) {
		this.notifications = [
            {
                title: 'Notification One',
                description: 'This is the first notification'
            },
            {
                title: 'Notification Two',
                description: 'This is second first notification'
            }
        ];
	}
	
	showNotification(message: string, action: string) {
		this.snackbar.open(message, action, {
			duration: 5000
		})
	}

}
