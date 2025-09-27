import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MobileStep2FormComponent } from './mobile-step2-form.component';

describe('MobileStep2FormComponent', () => {
  let component: MobileStep2FormComponent;
  let fixture: ComponentFixture<MobileStep2FormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MobileStep2FormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MobileStep2FormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
