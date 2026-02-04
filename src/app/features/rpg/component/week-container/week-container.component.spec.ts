import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WeekContainerComponent } from './week-container.component';

describe('WeekContainerComponent', () => {
  let component: WeekContainerComponent;
  let fixture: ComponentFixture<WeekContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WeekContainerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WeekContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
