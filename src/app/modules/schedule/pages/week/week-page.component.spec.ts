import { TestBed } from '@angular/core/testing';
import { WeekPageComponent, WeekdayDropContainer } from './week-page.component';
import { CdkDragDrop, DragDropModule } from '@angular/cdk/drag-drop';
import { TestProvider } from '@app/test-provider';
import { ScheduleService } from '@app/api/services';
import { MuscleGroup, WeeklySchedule } from '@app/api/models';
import { of, throwError } from 'rxjs';

describe('WeekPageComponent', () => {
  let scheduleServiceSpy: jasmine.SpyObj<ScheduleService>;

  beforeEach(async () => {
    scheduleServiceSpy = jasmine.createSpyObj('ScheduleService', {
      apiSchedulePost: of(true),
      apiScheduleMondayGet: of({}),
    });

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

  it('activity list contains all 8 muscle groups', () => {
    const { componentInstance: component } = createComponent();
    expect(component.activity.length).toBe(8);
    expect(component.activity).toContain(MuscleGroup.Cardio);
    expect(component.activity).toContain(MuscleGroup.Core);
    expect(component.activity).toContain(MuscleGroup.Chest);
    expect(component.activity).toContain(MuscleGroup.Back);
    expect(component.activity).toContain(MuscleGroup.Legs);
  });

  describe('ngOnInit', () => {
    it('calls apiScheduleMondayGet with this week\'s Monday date in YYYY-MM-DD format', () => {
      createComponent();
      expect(scheduleServiceSpy.apiScheduleMondayGet).toHaveBeenCalledOnceWith({
        monday: jasmine.stringMatching(/^\d{4}-\d{2}-\d{2}$/)
      });
    });

    it('populates all day arrays from the API response', () => {
      scheduleServiceSpy.apiScheduleMondayGet.and.returnValue(of({
        monday:    { muscleGroupFilter: [MuscleGroup.Chest] },
        tuesday:   { muscleGroupFilter: [MuscleGroup.Back] },
        wednesday: { muscleGroupFilter: [MuscleGroup.Legs] },
        thursday:  { muscleGroupFilter: [MuscleGroup.Shoulders] },
        friday:    { muscleGroupFilter: [MuscleGroup.Arms] },
        saturday:  { muscleGroupFilter: [MuscleGroup.Core] },
        sunday:    { muscleGroupFilter: [MuscleGroup.Cardio] },
      } as unknown as WeeklySchedule[]));

      const { componentInstance: component } = createComponent();

      expect(component.monday).toEqual([MuscleGroup.Chest]);
      expect(component.tuesday).toEqual([MuscleGroup.Back]);
      expect(component.wednesday).toEqual([MuscleGroup.Legs]);
      expect(component.thursday).toEqual([MuscleGroup.Shoulders]);
      expect(component.friday).toEqual([MuscleGroup.Arms]);
      expect(component.saturday).toEqual([MuscleGroup.Core]);
      expect(component.sunday).toEqual([MuscleGroup.Cardio]);
    });

    it('leaves all day arrays empty when the API returns no schedule', () => {
      scheduleServiceSpy.apiScheduleMondayGet.and.returnValue(throwError(() => new Error('Not found')));

      const { componentInstance: component } = createComponent();

      expect(component.monday).toEqual([]);
      expect(component.tuesday).toEqual([]);
      expect(component.wednesday).toEqual([]);
      expect(component.thursday).toEqual([]);
      expect(component.friday).toEqual([]);
      expect(component.saturday).toEqual([]);
      expect(component.sunday).toEqual([]);
    });

    it('leaves a day array empty when that day has no muscle groups in the schedule', () => {
      scheduleServiceSpy.apiScheduleMondayGet.and.returnValue(of({
        monday: { muscleGroupFilter: [MuscleGroup.Chest] },
      } as unknown as WeeklySchedule[]));

      const { componentInstance: component } = createComponent();

      expect(component.monday).toEqual([MuscleGroup.Chest]);
      expect(component.tuesday).toEqual([]);
      expect(component.sunday).toEqual([]);
    });
  });

  describe('clear', () => {
    it('empties all day arrays', () => {
      scheduleServiceSpy.apiScheduleMondayGet.and.returnValue(of({
        monday:    { muscleGroupFilter: [MuscleGroup.Chest, MuscleGroup.Core] },
        tuesday:   { muscleGroupFilter: [MuscleGroup.Back] },
        wednesday: { muscleGroupFilter: [MuscleGroup.Legs] },
        thursday:  { muscleGroupFilter: [MuscleGroup.Shoulders] },
        friday:    { muscleGroupFilter: [MuscleGroup.Arms] },
        saturday:  { muscleGroupFilter: [MuscleGroup.Core] },
        sunday:    { muscleGroupFilter: [MuscleGroup.Cardio] },
      } as unknown as WeeklySchedule[]));

      const { componentInstance: component } = createComponent();
      (component as any).clear();

      expect(component.monday).toEqual([]);
      expect(component.tuesday).toEqual([]);
      expect(component.wednesday).toEqual([]);
      expect(component.thursday).toEqual([]);
      expect(component.friday).toEqual([]);
      expect(component.saturday).toEqual([]);
      expect(component.sunday).toEqual([]);
    });

    it('clear button is rendered in the toolbar', () => {
      const fixture = createComponent();
      const buttons: NodeListOf<HTMLButtonElement> = fixture.nativeElement.querySelectorAll('button');
      const labels = Array.from(buttons).map(b => b.textContent?.trim());
      expect(labels).toContain('Clear');
    });

    it('clicking the Clear button empties all day arrays', () => {
      scheduleServiceSpy.apiScheduleMondayGet.and.returnValue(of({
        monday: { muscleGroupFilter: [MuscleGroup.Chest] },
        tuesday: { muscleGroupFilter: [MuscleGroup.Back] },
      } as unknown as WeeklySchedule[]));

      const fixture = createComponent();
      const buttons: NodeListOf<HTMLButtonElement> = fixture.nativeElement.querySelectorAll('button');
      const clearButton = Array.from(buttons).find(b => b.textContent?.trim() === 'Clear')!;
      clearButton.click();
      fixture.detectChanges();

      expect(fixture.componentInstance.monday).toEqual([]);
      expect(fixture.componentInstance.tuesday).toEqual([]);
    });
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
