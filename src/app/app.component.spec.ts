import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { TestProvider } from '@app/test-provider';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent, TestProvider],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('isLoggedIn starts as false', () => {
    const fixture = TestBed.createComponent(AppComponent);
    expect(fixture.componentInstance.isLoggedIn).toBeFalse();
  });

  it('inventory menu contains the gym route', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const routes = fixture.componentInstance.inventoryMenuItems.map(m => m.routerLink);
    expect(routes).toContain('/inventory/gym');
  });

  it('schedule menu contains the weekly schedule route', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const routes = fixture.componentInstance.scheduleMenuItems.map(m => m.routerLink);
    expect(routes).toContain('/schedule/week');
  });

  it('isActive returns empty string for a route that does not match the current path', () => {
    const fixture = TestBed.createComponent(AppComponent);
    expect(fixture.componentInstance.isActive('/xyz-nonexistent-route')).toBe('');
  });

  it('isActive returns "active" for a route that matches the current path prefix', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const currentPath = window.location.pathname;
    expect(fixture.componentInstance.isActive(currentPath)).toBe('active');
  });
});
