import { Injectable } from '@angular/core';

import { Bank } from '@app/invoices/bank.interface';

@Injectable()
export class BankService {
	
	bank: Bank;

	constructor() {
		this.bank = {
			bankId: 1,
			bankName: 'Halifax',
			bankReference: 'Halifax',
			accountNumber: '01234567',
			accountReference: 'Halifax',
			sortCode: '11-11-11'
		}
	}

}