export interface Contact {
	id: string;
    contactId: number;
    name: string;
    address: {
        buildingName: string;
        buildingNumber: number;
        streetName: string;
        townCity: string;
        county: string;
        postcode: string;
    };
    primaryTelephone: string;
    secondaryTelephone: string;
    primaryEmail: string;
    secondaryEmail: string;
    bank: {
        bankName: string;
		bankRef: string;
        accountNumber: string;
        sortCode: string;
    };
    vatNumber: string;
}
