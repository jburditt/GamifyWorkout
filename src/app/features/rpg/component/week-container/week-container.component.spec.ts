import { TestBed } from '@angular/core/testing';
import { WeekContainerComponent } from './week-container.component';
import { TestProvider } from '@app/test-provider';

describe('WeekContainerComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestProvider, WeekContainerComponent],
    }).compileComponents();
  });

  function createComponent(help = 'Test help') {
    const fixture = TestBed.createComponent(WeekContainerComponent);
    fixture.componentRef.setInput('help', help);
    fixture.detectChanges();
    return fixture;
  }

  it('should create', () => {
    expect(createComponent().componentInstance).toBeTruthy();
  });

  describe('getTodayOrNull', () => {
    it('returns a Date when the index matches today\'s day of week', () => {
      const { componentInstance } = createComponent();
      const todayIndex = new Date().getDay();
      const result = (componentInstance as any).getTodayOrNull(todayIndex);
      expect(result).toBeInstanceOf(Date);
    });

    it('returns null when the index does not match today\'s day of week', () => {
      const { componentInstance } = createComponent();
      const todayIndex = new Date().getDay();
      const otherIndex = (todayIndex + 1) % 7;
      const result = (componentInstance as any).getTodayOrNull(otherIndex);
      expect(result).toBeNull();
    });

    it('returns a Date that represents today', () => {
      const { componentInstance } = createComponent();
      const todayIndex = new Date().getDay();
      const result = (componentInstance as any).getTodayOrNull(todayIndex) as Date;
      const today = new Date();
      expect(result.getDate()).toBe(today.getDate());
      expect(result.getMonth()).toBe(today.getMonth());
      expect(result.getFullYear()).toBe(today.getFullYear());
    });
  });
});
