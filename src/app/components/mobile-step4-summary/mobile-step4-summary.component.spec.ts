import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MobileStep4SummaryComponent } from './mobile-step4-summary.component';

describe('MobileStep4SummaryComponent', () => {
  let component: MobileStep4SummaryComponent;
  let fixture: ComponentFixture<MobileStep4SummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MobileStep4SummaryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MobileStep4SummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
