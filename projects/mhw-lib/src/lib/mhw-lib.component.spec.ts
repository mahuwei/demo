import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MhwLibComponent } from './mhw-lib.component';

describe('MhwLibComponent', () => {
  let component: MhwLibComponent;
  let fixture: ComponentFixture<MhwLibComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MhwLibComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MhwLibComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
