import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterialRowGroupComponent } from './material-row-group.component';

describe('MaterialRowGroupComponent', () => {
  let component: MaterialRowGroupComponent;
  let fixture: ComponentFixture<MaterialRowGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MaterialRowGroupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MaterialRowGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
