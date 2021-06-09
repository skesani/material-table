import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {MaterialRowGroupComponent} from './material-row-group/material-row-group.component';
import {RowGroupPrintComponent} from './row-group-print/row-group-print.component';
import {PrintLayoutComponent} from './print-layout/print-layout.component';

const routes: Routes = [
  {path: 'table', component: MaterialRowGroupComponent},
  {path: 'mobileprint', outlet: 'mobile', component: RowGroupPrintComponent},
  { path: 'print',
    outlet: 'print',
    component: PrintLayoutComponent,
    children: [
      { path: 'printing', component: RowGroupPrintComponent }
    ]
  },
  {path: '**', redirectTo: 'table'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
