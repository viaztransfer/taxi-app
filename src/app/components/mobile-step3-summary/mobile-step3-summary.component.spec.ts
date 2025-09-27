import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MobileStep3SummaryComponent } from './mobile-step3-summary.component';

describe('MobileStep3SummaryComponent', () => {
  let component: MobileStep3SummaryComponent;
  let fixture: ComponentFixture<MobileStep3SummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MobileStep3SummaryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MobileStep3SummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
