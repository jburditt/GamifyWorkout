import { TestBed } from '@angular/core/testing';
import { GymPageComponent } from '@app/modules/inventory/pages/gym.component';
import { ReactiveFormsModule } from '@angular/forms';
import { TestProvider } from '@app/test-provider';

describe('GymPageComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestProvider, GymPageComponent, ReactiveFormsModule],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(GymPageComponent);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });

  it('should validate form', async () => {
    const fixture = TestBed.createComponent(GymPageComponent);
    const component = fixture.componentInstance;
    component.form.setValue({ name: '' });
    expect(component.form.valid).toBeFalse();
  });
});
