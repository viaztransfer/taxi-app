import { ComponentFixture, TestBed } from '@angular/core/testing';

import { XhoradetailComponent } from './xhoradetail.component';

describe('XhoradetailComponent', () => {
  let component: XhoradetailComponent;
  let fixture: ComponentFixture<XhoradetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [XhoradetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(XhoradetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
