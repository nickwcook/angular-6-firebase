import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CancelChangesDialogComponent } from './cancel-changes-dialog.component';

describe('CancelChangesDialogComponent', () => {
  let component: CancelChangesDialogComponent;
  let fixture: ComponentFixture<CancelChangesDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CancelChangesDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CancelChangesDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
