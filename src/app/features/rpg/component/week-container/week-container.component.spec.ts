import { TestBed } from '@angular/core/testing';
import { WeekContainerComponent } from './week-container.component';
import { TestProvider } from '@app/test-provider';

describe('WeekContainerComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestProvider, WeekContainerComponent],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(WeekContainerComponent);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });

  // it('should highlight today', async () => {
  //   const fixture = TestBed.createComponent(WeekContainerComponent);
  //   await fixture.whenStable();
  //   const compiled = fixture.nativeElement;
  //   // Assume today is highlighted
  //   expect(compiled.querySelector('.today')).toBeTruthy();
  // });
});
