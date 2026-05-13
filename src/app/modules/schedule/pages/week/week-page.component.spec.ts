import { TestBed } from '@angular/core/testing';
import { WeekPageComponent, WeekdayDropContainer } from './week-page.component';
import { CdkDragDrop, DragDropModule } from '@angular/cdk/drag-drop';
import { TestProvider } from '@app/test-provider';
import { ScheduleService } from '@app/api/services';
import { MuscleGroup } from '@app/api/models';
import { of } from 'rxjs';

describe('WeekPageComponent', () => {
  beforeEach(async () => {
    const scheduleServiceSpy = jasmine.createSpyObj('ScheduleService', { apiSchedulePost: of(true) });

    await TestBed.configureTestingModule({
      imports: [TestProvider, WeekPageComponent, DragDropModule],
      providers: [{ provide: ScheduleService, useValue: scheduleServiceSpy }],
    }).compileComponents();
  });

  function createComponent() {
    const fixture = TestBed.createComponent(WeekPageComponent);
    fixture.detectChanges();
    return fixture;
  }

  it('should create', () => {
    expect(createComponent().componentInstance).toBeTruthy();
  });

  it('all day arrays are empty on init', () => {
    const { componentInstance: component } = createComponent();
    expect(component.monday).toEqual([]);
    expect(component.tuesday).toEqual([]);
    expect(component.wednesday).toEqual([]);
    expect(component.thursday).toEqual([]);
    expect(component.friday).toEqual([]);
    expect(component.saturday).toEqual([]);
    expect(component.sunday).toEqual([]);
  });

  it('activity list contains all 8 muscle groups', () => {
    const { componentInstance: component } = createComponent();
    expect(component.activity.length).toBe(8);
    expect(component.activity).toContain(MuscleGroup.Cardio);
    expect(component.activity).toContain(MuscleGroup.Core);
    expect(component.activity).toContain(MuscleGroup.Chest);
    expect(component.activity).toContain(MuscleGroup.Back);
    expect(component.activity).toContain(MuscleGroup.Legs);
  });
});

describe('WeekdayDropContainer', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestProvider, WeekdayDropContainer, DragDropModule],
    }).compileComponents();
  });

  function createContainer(id = 'monday', data: string[] = []) {
    const fixture = TestBed.createComponent(WeekdayDropContainer);
    fixture.componentRef.setInput('id', id);
    fixture.componentRef.setInput('data', data);
    fixture.detectChanges();
    return fixture;
  }

  describe('drop', () => {
    it('reorders items when dropped within the same container', () => {
      const data = [MuscleGroup.Cardio, MuscleGroup.Core, MuscleGroup.Chest] as string[];
      const { componentInstance: component } = createContainer('monday', data);
      const container = { id: 'monday', data };
      const mockEvent = {
        previousContainer: container,
        container,
        previousIndex: 0,
        currentIndex: 2,
      } as CdkDragDrop<string[]>;

      component.drop(mockEvent);

      expect(data[2]).toBe(MuscleGroup.Cardio);
    });

    it('copies the item when dragged from the activity list', () => {
      const sourceData = [MuscleGroup.Cardio, MuscleGroup.Core] as string[];
      const targetData: string[] = [];
      const { componentInstance: component } = createContainer('monday', targetData);
      const mockEvent = {
        previousContainer: { id: 'activityList', data: sourceData },
        container: { id: 'monday', data: targetData },
        previousIndex: 0,
        currentIndex: 0,
      } as CdkDragDrop<string[]>;

      component.drop(mockEvent);

      expect(targetData).toContain(MuscleGroup.Cardio);
      expect(sourceData.length).toBe(2);
    });

    it('moves the item when dragged from another day container', () => {
      const sourceData = [MuscleGroup.Cardio, MuscleGroup.Core] as string[];
      const targetData: string[] = [];
      const { componentInstance: component } = createContainer('tuesday', targetData);
      const mockEvent = {
        previousContainer: { id: 'monday', data: sourceData },
        container: { id: 'tuesday', data: targetData },
        previousIndex: 0,
        currentIndex: 0,
      } as CdkDragDrop<string[]>;

      component.drop(mockEvent);

      expect(targetData).toContain(MuscleGroup.Cardio);
      expect(sourceData).not.toContain(MuscleGroup.Cardio);
      expect(sourceData.length).toBe(1);
    });
  });
});
