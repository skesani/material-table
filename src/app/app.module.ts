import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {HttpClientModule} from '@angular/common/http';
import {FormsModule} from '@angular/forms';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import {AppComponent} from './app.component';
import {MatButtonModule} from '@angular/material/button';
import {MatTableModule} from '@angular/material/table';
import {MaterialRowGroupComponent} from './material-row-group/material-row-group.component';
import {CarTableDataService} from './material-row-group/car-table-data.service';
import {MatMenuModule} from '@angular/material/menu';
import {AppRoutingModule} from './app-routing.module';
import {MatIconModule} from '@angular/material/icon';
import { SidenavComponent } from './sidenav/sidenav.component';
import { ToolbarComponent } from './toolbar/toolbar.component';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatToolbarModule} from '@angular/material/toolbar';
import {SidenavService} from './sidenav/sidenav.service';
import {ThemingService} from './theming.service';
import {PrintLayoutComponent} from './print-layout/print-layout.component';
import {PrintService} from './print-layout/print.service';
import {InvoiceComponent} from './invoice/invoice.component';
import { RowGroupPrintComponent } from './row-group-print/row-group-print.component';
import {MatSortModule} from '@angular/material/sort';

@NgModule({
  declarations: [
    AppComponent,
    MaterialRowGroupComponent,
    SidenavComponent,
    ToolbarComponent,
    PrintLayoutComponent,
    InvoiceComponent,
    RowGroupPrintComponent
  ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        FormsModule,
        HttpClientModule,
        MatButtonModule,
        MatTableModule,
        AppRoutingModule,
        MatMenuModule,
        MatIconModule,
        MatSidenavModule,
        MatToolbarModule,
        MatSortModule,
    ],
  providers: [CarTableDataService, SidenavService, ThemingService, PrintService],
  bootstrap: [AppComponent]
})
export class AppModule { }
