import { TestBed } from '@angular/core/testing';
import { ManageGymComponent } from '@app/features/rpg/component/manage-gym.component';
import { ReactiveFormsModule } from '@angular/forms';
import { TestProvider } from '@app/test-provider';
import { EquipmentService, GymEquipmentService } from '@app/api/services';
import { Gym, Equipment } from '@app/api/models';
import { of } from 'rxjs';

describe('ManageGymComponent', () => {
  let equipmentServiceSpy: jasmine.SpyObj<EquipmentService>;
  let gymEquipmentServiceSpy: jasmine.SpyObj<GymEquipmentService>;
  const mockGym: Gym = { id: 'gym-1', name: 'Test Gym' };

  beforeEach(async () => {
    equipmentServiceSpy = jasmine.createSpyObj('EquipmentService', { apiEquipmentIdGet: of([]) });
    gymEquipmentServiceSpy = jasmine.createSpyObj('GymEquipmentService', {
      apiGymEquipmentGymIdPost: of(null),
      apiGymEquipmentGymIdEquipmentIdDelete: of(null),
    });

    await TestBed.configureTestingModule({
      imports: [TestProvider, ManageGymComponent, ReactiveFormsModule],
      providers: [
        { provide: EquipmentService, useValue: equipmentServiceSpy },
        { provide: GymEquipmentService, useValue: gymEquipmentServiceSpy },
      ],
    }).compileComponents();
  });

  function createComponent(gym: Gym = mockGym) {
    const fixture = TestBed.createComponent(ManageGymComponent);
    fixture.componentRef.setInput('gym', gym);
    fixture.detectChanges();
    return fixture;
  }

  it('should create', () => {
    expect(createComponent().componentInstance).toBeTruthy();
  });

  describe('form pre-population', () => {
    it('should pre-populate the name field with the gym name on init', () => {
      const { componentInstance } = createComponent();
      expect(componentInstance.form.get('name')!.value).toBe('Test Gym');
    });

    it('should load equipment for the gym on init', () => {
      createComponent();
      expect(equipmentServiceSpy.apiEquipmentIdGet).toHaveBeenCalledWith({ id: 'gym-1' });
    });
  });

  describe('form validation', () => {
    it('form is invalid when name is empty', () => {
      const { componentInstance } = createComponent();
      componentInstance.form.setValue({ name: '' });
      expect(componentInstance.form.valid).toBeFalse();
    });

    it('form is invalid when name is shorter than 3 characters', () => {
      const { componentInstance } = createComponent();
      componentInstance.form.setValue({ name: 'ab' });
      expect(componentInstance.form.valid).toBeFalse();
    });

    it('form is valid with exactly 3 characters', () => {
      const { componentInstance } = createComponent();
      componentInstance.form.setValue({ name: 'abc' });
      expect(componentInstance.form.valid).toBeTrue();
    });

    it('form is invalid when name exceeds 50 characters', () => {
      const { componentInstance } = createComponent();
      componentInstance.form.setValue({ name: 'a'.repeat(51) });
      expect(componentInstance.form.valid).toBeFalse();
    });

    it('form is valid with exactly 50 characters', () => {
      const { componentInstance } = createComponent();
      componentInstance.form.setValue({ name: 'a'.repeat(50) });
      expect(componentInstance.form.valid).toBeTrue();
    });
  });

  describe('canAddRow', () => {
    it('returns true when there are no equipment items', () => {
      const { componentInstance } = createComponent();
      expect((componentInstance as any).canAddRow([])).toBeTrue();
    });

    it('returns true when there are fewer than 4 equipment items', () => {
      const { componentInstance } = createComponent();
      expect((componentInstance as any).canAddRow([{}, {}, {}])).toBeTrue();
    });

    it('returns false when there are 4 or more equipment items', () => {
      const { componentInstance } = createComponent();
      expect((componentInstance as any).canAddRow([{}, {}, {}, {}])).toBeFalse();
    });
  });

  describe('deleteGymEquipment', () => {
    it('removes the item from the local equipment list', () => {
      const { componentInstance } = createComponent();
      componentInstance.equipment = [
        { id: 'e1', name: 'Dumbbell' },
        { id: 'e2', name: 'Barbell' },
      ] as Equipment[];

      (componentInstance as any).deleteGymEquipment('e1');

      expect(componentInstance.equipment.length).toBe(1);
      expect(componentInstance.equipment[0].id).toBe('e2');
    });

    it('calls the API to delete from the server', () => {
      const { componentInstance } = createComponent();
      componentInstance.equipment = [{ id: 'e1', name: 'Dumbbell' }] as Equipment[];

      (componentInstance as any).deleteGymEquipment('e1');

      expect(gymEquipmentServiceSpy.apiGymEquipmentGymIdEquipmentIdDelete)
        .toHaveBeenCalledWith({ gymId: 'gym-1', equipmentId: 'e1' });
    });
  });
});
