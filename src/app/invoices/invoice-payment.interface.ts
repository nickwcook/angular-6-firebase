import { Bank } from './bank.interface';

export interface InvoicePayment {
    paymentId: number;
    reference: string;
    date: Date;
    amount: number;
    bank: Bank;
}