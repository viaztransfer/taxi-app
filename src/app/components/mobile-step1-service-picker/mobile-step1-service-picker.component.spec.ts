import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MobileStep1ServicePickerComponent } from './mobile-step1-service-picker.component';

describe('MobileStep1ServicePickerComponent', () => {
  let component: MobileStep1ServicePickerComponent;
  let fixture: ComponentFixture<MobileStep1ServicePickerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MobileStep1ServicePickerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MobileStep1ServicePickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
