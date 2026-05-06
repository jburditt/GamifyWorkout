import { TestBed } from '@angular/core/testing';
import { GymEquipmentTableComponent } from '@app/features/rpg/component/gym-equipment-table.component';
import { TestProvider } from '@app/test-provider';

describe('GymEquipmentTableComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestProvider, GymEquipmentTableComponent],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(GymEquipmentTableComponent);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });

  // it('should display equipment table', async () => {
  //   const fixture = TestBed.createComponent(GymEquipmentTableComponent);
  //   const component = fixture.componentInstance;
  //   component.equipment()[0].name = 'Dumbbell';
  //   await fixture.whenStable();
  //   const compiled = fixture.nativeElement;
  //   expect(compiled.textContent).toContain('Dumbbell');
  // });
});
