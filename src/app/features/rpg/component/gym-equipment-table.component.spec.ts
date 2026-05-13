import { TestBed } from '@angular/core/testing';
import { GymEquipmentTableComponent } from '@app/features/rpg/component/gym-equipment-table.component';
import { TestProvider } from '@app/test-provider';
import { Equipment } from '@app/api/models';

describe('GymEquipmentTableComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestProvider, GymEquipmentTableComponent],
    }).compileComponents();
  });

  function createComponent(equipment: Equipment[] = []) {
    const fixture = TestBed.createComponent(GymEquipmentTableComponent);
    fixture.componentRef.setInput('equipment', equipment);
    fixture.detectChanges();
    return fixture;
  }

  it('should create', () => {
    expect(createComponent().componentInstance).toBeTruthy();
  });

  describe('onChange', () => {
    it('adds equipment ID to selection and emits when checked', () => {
      const { componentInstance: component } = createComponent();
      const spy = spyOn(component.changeGymEquipment, 'emit');

      (component as any).onChange({ checked: true, source: { value: 'equip-1' } });

      expect((component as any).equipmentIds).toContain('equip-1');
      expect(spy).toHaveBeenCalledWith(['equip-1']);
    });

    it('removes equipment ID from selection and emits when unchecked', () => {
      const { componentInstance: component } = createComponent();
      (component as any).equipmentIds = ['equip-1', 'equip-2'];
      const spy = spyOn(component.changeGymEquipment, 'emit');

      (component as any).onChange({ checked: false, source: { value: 'equip-1' } });

      expect((component as any).equipmentIds).not.toContain('equip-1');
      expect((component as any).equipmentIds).toContain('equip-2');
      expect(spy).toHaveBeenCalledWith(['equip-2']);
    });

    it('checking and unchecking the same item leaves selection empty', () => {
      const { componentInstance: component } = createComponent();
      (component as any).onChange({ checked: true, source: { value: 'equip-1' } });
      (component as any).onChange({ checked: false, source: { value: 'equip-1' } });
      expect((component as any).equipmentIds).toEqual([]);
    });
  });

  describe('openDialogEmitter', () => {
    it('emits the IDs of all current equipment', () => {
      const mockEquipment: Equipment[] = [
        { id: 'e1', name: 'Dumbbell' },
        { id: 'e2', name: 'Barbell' },
      ];
      const { componentInstance: component } = createComponent(mockEquipment);
      const spy = spyOn(component.addGymEquipment, 'emit');

      (component as any).openDialogEmitter();

      expect(spy).toHaveBeenCalledWith(['e1', 'e2']);
    });

    it('emits an empty array when there is no equipment', () => {
      const { componentInstance: component } = createComponent([]);
      const spy = spyOn(component.addGymEquipment, 'emit');

      (component as any).openDialogEmitter();

      expect(spy).toHaveBeenCalledWith([]);
    });
  });

  describe('showPaginator', () => {
    it('returns false for exactly 10 items', () => {
      const { componentInstance: component } = createComponent();
      const items = Array(10).fill({ id: '1', name: 'Item' });
      expect((component as any).showPaginator(items)).toBeFalse();
    });

    it('returns true for more than 10 items', () => {
      const { componentInstance: component } = createComponent();
      const items = Array(11).fill({ id: '1', name: 'Item' });
      expect((component as any).showPaginator(items)).toBeTrue();
    });

    it('returns false for an empty list', () => {
      const { componentInstance: component } = createComponent();
      expect((component as any).showPaginator([])).toBeFalse();
    });
  });
});
