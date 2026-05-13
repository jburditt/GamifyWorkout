import { TestBed } from '@angular/core/testing';
import { GymPageComponent } from '@app/modules/inventory/pages/gym.component';
import { ReactiveFormsModule } from '@angular/forms';
import { TestProvider } from '@app/test-provider';
import { GymService } from '@app/api/services';
import { of } from 'rxjs';
import { Gym } from '@app/api/models';

describe('GymPageComponent', () => {
  let gymServiceSpy: jasmine.SpyObj<GymService>;

  beforeEach(async () => {
    gymServiceSpy = jasmine.createSpyObj('GymService', {
      apiGymGet: of([]),
      apiGymPost: of({ id: 'new-1', name: 'New Gym' }),
    });

    await TestBed.configureTestingModule({
      imports: [TestProvider, GymPageComponent, ReactiveFormsModule],
      providers: [{ provide: GymService, useValue: gymServiceSpy }],
    }).compileComponents();
  });

  function createComponent() {
    const fixture = TestBed.createComponent(GymPageComponent);
    fixture.detectChanges();
    return fixture;
  }

  it('should create', () => {
    expect(createComponent().componentInstance).toBeTruthy();
  });

  it('loads gyms from the API on init', () => {
    createComponent();
    expect(gymServiceSpy.apiGymGet).toHaveBeenCalled();
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
  });

  describe('insert', () => {
    it('calls the API when the form is valid', () => {
      const { componentInstance } = createComponent();
      componentInstance.form.setValue({ name: 'New Gym' });

      (componentInstance as any).insert();

      expect(gymServiceSpy.apiGymPost).toHaveBeenCalledWith({
        body: { name: 'New Gym' }
      });
    });

    it('does not call the API when the form is invalid', () => {
      const { componentInstance } = createComponent();
      componentInstance.form.setValue({ name: '' });

      (componentInstance as any).insert();

      expect(gymServiceSpy.apiGymPost).not.toHaveBeenCalled();
    });

    it('resets the form after a successful insert', (done) => {
      const { componentInstance } = createComponent();
      componentInstance.form.setValue({ name: 'New Gym' });

      (componentInstance as any).insert();

      setTimeout(() => {
        expect(componentInstance.form.get('name')!.value).toBeNull();
        done();
      });
    });

    it('adds the new gym to the local gyms list', (done) => {
      const { componentInstance } = createComponent();
      componentInstance.form.setValue({ name: 'New Gym' });

      (componentInstance as any).insert();

      setTimeout(() => {
        expect(componentInstance.gyms.some(g => g.name === 'New Gym')).toBeTrue();
        done();
      });
    });
  });
});
