import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes, RouterLinkActive } from '@angular/router';
import { CanActivateRouteGuard } from '@app/can-activate-route.guard';

// COMPONENTS
import { EditInvoiceComponent } from './edit-invoice/edit-invoice.component';
import { NewInvoiceComponent } from './new-invoice/new-invoice.component';
import { InvoiceListComponent } from './invoice-list/invoice-list.component';
import { ViewInvoiceComponent } from './view-invoice/view-invoice.component';

const routes: Routes = [
	{
		path: 'invoices/new',
		component: NewInvoiceComponent,
    canActivate: [CanActivateRouteGuard]
	},
	{
		path: 'invoices/all',
		component: InvoiceListComponent,
    canActivate: [CanActivateRouteGuard]
	},
	{
		path: 'invoices/:id',
		component: ViewInvoiceComponent,
    canActivate: [CanActivateRouteGuard]
	},
	{
		path: 'invoices/:id/edit',
		component: EditInvoiceComponent,
    canActivate: [CanActivateRouteGuard]
	},
]

@NgModule({

  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  
  exports: [
    RouterModule
  ]

})

export class InvoicesRoutingModule {

}