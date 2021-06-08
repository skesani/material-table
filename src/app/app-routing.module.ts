import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {MaterialRowGroupComponent} from './material-row-group/material-row-group.component';
import {RowGroupPrintComponent} from './row-group-print/row-group-print.component';
import {PrintLayoutComponent} from './print-layout/print-layout.component';

const routes: Routes = [
  {path: '**', redirectTo: 'table'},
  {path: 'table', component: MaterialRowGroupComponent},
  { path: 'print',
    outlet: 'print',
    component: PrintLayoutComponent,
    children: [
      { path: 'printing', component: RowGroupPrintComponent }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
