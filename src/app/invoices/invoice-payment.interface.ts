import { Bank } from './bank.interface';

export interface InvoicePayment {
    reference: string;
    date: Date;
    amount: number;
    bank: Bank;
}