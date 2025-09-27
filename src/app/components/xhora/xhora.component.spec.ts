import { ComponentFixture, TestBed } from '@angular/core/testing';

import { XhoraComponent } from './xhora.component';

describe('XhoraComponent', () => {
  let component: XhoraComponent;
  let fixture: ComponentFixture<XhoraComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [XhoraComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(XhoraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
