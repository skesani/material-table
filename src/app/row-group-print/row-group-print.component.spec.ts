import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RowGroupPrintComponent } from './row-group-print.component';

describe('RowGroupPrintComponent', () => {
  let component: RowGroupPrintComponent;
  let fixture: ComponentFixture<RowGroupPrintComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RowGroupPrintComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RowGroupPrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
