import { TestBed } from '@angular/core/testing';
import { HomePageComponent } from '@app/modules/home.component';
import { TestProvider } from '@app/test-provider';

describe('HomePageComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestProvider, HomePageComponent],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(HomePageComponent);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });
});
