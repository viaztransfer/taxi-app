import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MobileBookingComponent } from './mobile-booking.component';

describe('MobileBookingComponent', () => {
  let component: MobileBookingComponent;
  let fixture: ComponentFixture<MobileBookingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MobileBookingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MobileBookingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
