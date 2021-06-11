import { Injectable, OnDestroy } from '@angular/core';
import {Router} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class PrintService implements OnDestroy {
  private state: 'close' | 'open' = 'close';
  isPrinting = false;
  private _option: Array<number>;
  private _isMobile: boolean;
  getOption(): any {
    return this._option;
  }

  setOption(value: Array<number>): any {
    this._option = value;
  }

  getIsMobile(): boolean {
    return this._isMobile;
  }

  setIsMobile(value: boolean): void {
    this._isMobile = value;
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

  printTableDocument(documentName: string, option?: Array<number>): void {
    this.isPrinting = true;
    this.setOption(option);
    if (this.getIsMobile()){
      this.router.navigateByUrl('/mobileprint');
    } else {
      this.router.navigate([{ outlets: { print: ['print', documentName] } }], { skipLocationChange: true });
    }
    // this.router.navigate([{ outlets: { print: ['print', documentName] } }], { skipLocationChange: true });

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

  onMobileDataReady(): void {
    setTimeout(() => {
      const onPrintFinished = (printed) => console.log('do something...');
      onPrintFinished(window.print());
      this.isPrinting = false;
      this.setOption(null);
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
