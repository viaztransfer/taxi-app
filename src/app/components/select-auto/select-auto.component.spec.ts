import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectAutoComponent } from './select-auto.component';

describe('SelectAutoComponent', () => {
  let component: SelectAutoComponent;
  let fixture: ComponentFixture<SelectAutoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectAutoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelectAutoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
