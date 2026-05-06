import { TestBed } from '@angular/core/testing';
import { ManageGymComponent } from '@app/features/rpg/component/manage-gym.component';
import { ReactiveFormsModule } from '@angular/forms';
import { input } from '@angular/core';
import { TestProvider } from '@app/test-provider';

describe('ManageGymComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestProvider, ManageGymComponent, ReactiveFormsModule],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(ManageGymComponent);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });

  // it('should display gym details', async () => {
  //   const fixture = TestBed.createComponent(ManageGymComponent);
  //   const component = fixture.componentInstance;
  //   component.gym().name = 'Test Gym';
  //   await fixture.whenStable();
  //   const compiled = fixture.nativeElement;
  //   expect(compiled.textContent).toContain('Test Gym');
  // });
});
