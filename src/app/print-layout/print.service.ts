import { Injectable, OnDestroy } from '@angular/core';
import {Router} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class PrintService implements OnDestroy {
  private state: 'close' | 'open' = 'close';
  isPrinting = false;
  private _option: string;

  getOption(): any {
    return this._option;
  }

  setOption(value: string): any {
    this._option = value;
  }

  constructor(private router: Router) {
  }

  ngOnDestroy(): void {
    this.closeDocument();
  }

  printDocument(documentName: string): void {
    if (this.state === 'open') {
      this.onDataReady();
    } else {
      this.router.navigate(['/',
          { outlets: {
              print: ['print', documentName]
            }}],
        { skipLocationChange: true })
        .then(result => this.state = result ? 'open' : this.state);
    }
  }

  printTableDocument(documentName: string, option?: string): void {
    this.isPrinting = true;
    this.setOption(option);
   // this.router.navigate(['print', documentName]);
    this.router.navigate([{ outlets: { print: ['print', documentName] } }], { skipLocationChange: true });

  }

  onDataReady(): void {
    setTimeout(() => {
      const onPrintFinished = (printed) => console.log('do something...');
      onPrintFinished(window.print());
      this.isPrinting = false;
      this.setOption(null);
      this.router.navigateByUrl('table');
    });
  }

  onDataReady1(): void {
    setTimeout(() => window.print());
  }

  closeDocument(): void {
    if (this.state === 'open') {
      this.router.navigate([{ outlets: { print: null }}])
        .then(() => this.state = 'close');
    }
  }
}
