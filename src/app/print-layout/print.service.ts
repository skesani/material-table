import { Injectable, OnDestroy } from '@angular/core';
import {Router} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class PrintService implements OnDestroy {
  private state: 'close' | 'open' = 'close';
  isPrinting = false;

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

  printTableDocument(documentName: string): void {
    this.isPrinting = true;
    this.router.navigate(['/',
      { outlets: {
          print: ['print', documentName]
        }}]);
  }

  onDataReady(): void {
    setTimeout(() => {
      window.print();
      this.isPrinting = false;
      this.router.navigate([{ outlets: { print: null }}]);
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
