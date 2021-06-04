import { Component } from '@angular/core';
import {PrintService} from './print-layout/print.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'material-download';
  constructor(public printService: PrintService) {
  }
}
