import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScheduleSidebar } from './schedule-sidebar';
import { ScheduleService } from '../../services/schedule.service';

describe('ScheduleSidebar', () => {
  let component: ScheduleSidebar;
  let fixture: ComponentFixture<ScheduleSidebar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScheduleSidebar],
    }).compileComponents();

    fixture = TestBed.createComponent(ScheduleSidebar);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should open when the schedule service is opened', async () => {
    const service = TestBed.inject(ScheduleService);
    service.open();
    fixture.detectChanges();
    const panel = fixture.nativeElement.querySelector('.schedule-panel') as HTMLElement;
    expect(panel.classList.contains('schedule-panel--open')).toBe(true);
  });

  it('should render the date trigger and open the calendar', () => {
    fixture.detectChanges();
    const trigger = fixture.nativeElement.querySelector('#schedule-date') as HTMLButtonElement;
    expect(trigger).toBeTruthy();

    trigger.click();
    fixture.detectChanges();
    const calendar = fixture.nativeElement.querySelector('.schedule-calendar');
    expect(calendar).toBeTruthy();
  });

  it('should select a date and enable the confirm button', () => {
    fixture.detectChanges();
    const trigger = fixture.nativeElement.querySelector('#schedule-date') as HTMLButtonElement;
    trigger.click();
    fixture.detectChanges();

    const dayButtons = Array.from(
      fixture.nativeElement.querySelectorAll('button.schedule-calendar__day'),
    ) as HTMLButtonElement[];
    const availableDay = dayButtons.find((day) => !day.disabled) as HTMLButtonElement;
    availableDay.click();
    fixture.detectChanges();

    const confirm = fixture.nativeElement.querySelector(
      '.schedule-panel__confirm',
    ) as HTMLButtonElement;
    expect(confirm.disabled).toBe(false);
  });

  it('should close when the close button is clicked', () => {
    const service = TestBed.inject(ScheduleService);
    service.open();
    fixture.detectChanges();
    const close = fixture.nativeElement.querySelector('.schedule-panel__close') as HTMLElement;
    close.click();
    fixture.detectChanges();
    expect(service.isOpen()).toBe(false);
  });
});