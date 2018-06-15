import { Component, OnInit, Inject } from '@angular/core';
import { NgForm, FormBuilder, FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { QuerySnapshot } from '@firebase/firestore-types';
import * as moment from 'moment';

import { InvoicePayment } from '@app/invoices/invoice-payment.interface';
import { Bank } from '@app/invoices/bank.interface';

import { InvoicesService } from '@app/services/invoices.service';
import { BankService } from '@app/services/bank.service';

@Component({
  selector: 'app-new-payment-dialog',
  templateUrl: './new-payment-dialog.component.html',
  styleUrls: ['./new-payment-dialog.component.scss']
})

export class NewPaymentDialogComponent implements OnInit {

	newPaymentForm: FormGroup = this.formBuilder.group({
    reference: new FormControl(''),
    date: new FormControl('', [Validators.required]),
    amount: new FormControl('', [Validators.required])
  })
  
  banks: Bank[];
  selectedBankId: number;
  selectedBank: any;

  payment: InvoicePayment;
  payments: InvoicePayment[];

  minPaymentDate: Date;
  maxPaymentDate: Date;

  constructor(private dialogRef: MatDialogRef<NewPaymentDialogComponent>, @Inject (MAT_DIALOG_DATA) private data, private formBuilder: FormBuilder, private invoicesService: InvoicesService, public bankService: BankService) {
    // this.banks = this.data.banks;
    this.minPaymentDate = new Date(this.data.invoice.date);
    this.maxPaymentDate = new Date();
  }

  ngOnInit() {
    // this.bankService.getSelectedBank(this.selectedBank);
    // console.log('NewPaymentDialog.BankService.getSelectedBank:', this.bankService.selectedBank);
  }

  addPayment() {
    this.payment = {
      // TODO: GET ID AS NEXT DOC ID
      id: this.invoicesService.invoicesCollection.doc(this.data.invoice.id).collection('/payments').ref.doc().id,
      paymentId: this.data.payments.length + 1,
      reference: this.newPaymentForm.get('reference').value,
      date: new Date(this.newPaymentForm.get('date').value),
      amount: +parseFloat(this.newPaymentForm.get('amount').value).toFixed(2),
      // TEMP BANK
      bank: this.bankService.bank
      // ON BANK SELECTION APP UPDATE
      // , bank: this.bankService.selectedBank
    }

    console.log('addPayment():', this.payment);

    this.dialogRef.close(this.payment);
  }

}