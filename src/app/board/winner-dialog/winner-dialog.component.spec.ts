import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WinnerDialogComponent } from './winner-dialog.component';

describe('WinnerDialogComponent', () => {
  let component: WinnerDialogComponent;
  let fixture: ComponentFixture<WinnerDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [WinnerDialogComponent]
    });
    fixture = TestBed.createComponent(WinnerDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
