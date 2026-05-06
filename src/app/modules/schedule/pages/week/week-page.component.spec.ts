import { TestBed } from '@angular/core/testing';
import { WeekPageComponent } from './week-page.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { TestProvider } from '@app/test-provider';

describe('WeekPageComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestProvider, WeekPageComponent, DragDropModule],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(WeekPageComponent);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });

  // it('should handle drag drop', () => {
  //   const fixture = TestBed.createComponent(WeekPageComponent);
  //   const component = fixture.componentInstance;
  //   // Mock drag drop event
  //   const event = { previousContainer: { data: [] }, container: { data: [] }, previousIndex: 0, currentIndex: 0 };
  //   component.drop(event);
  //   expect(component.monday).toEqual([]);
  // });
});
