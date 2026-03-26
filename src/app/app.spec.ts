import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { App } from './app';
import { routes } from './app.routes';
import { StorageService } from './core/services/storage.service';
import { NotificationService } from './core/services/notification.service';

describe('App', () => {
  beforeEach(async () => {
    const storageSpy = jasmine.createSpyObj('StorageService', ['readState', 'writeState']);
    storageSpy.readState.and.returnValue(Promise.resolve(null));
    storageSpy.writeState.and.returnValue(Promise.resolve());

    const notifSpy = jasmine.createSpyObj('NotificationService', ['sendWarning', 'sendRespawnReady']);

    spyOn(window, 'fetch').and.returnValue(
      Promise.resolve({ json: () => Promise.resolve({ bosses: [] }) } as Response),
    );

    await TestBed.configureTestingModule({
      imports: [App],
      providers: [
        provideRouter(routes),
        { provide: StorageService, useValue: storageSpy },
        { provide: NotificationService, useValue: notifSpy },
      ],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render the nav bar', () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.nav-title')?.textContent).toContain('RO MVP Timer');
  });
});
