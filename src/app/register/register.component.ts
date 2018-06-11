import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

import * as firebase from 'firebase/app';
import { AngularFireAuth } from 'angularfire2/auth';
import { AuthService } from '../services/auth.service';

@Component({
	selector: 'app-register',
	templateUrl: './register.component.html',
	styleUrls: ['./register.component.scss']
})

export class RegisterComponent implements OnInit {
	
	email: string;
	password: string;
	password2: string;

	constructor(private firebaseAuth: AngularFireAuth, private authService: AuthService, private router: Router) {
		
	}

	ngOnInit() {
		
	}
	
	register() {
		if (this.password === this.password2) {
			this.authService.register(this.email, this.password);
		} else {
			console.log('Passwords do not match');
		}
	}

}
