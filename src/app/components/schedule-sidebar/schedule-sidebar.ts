import { Component, computed, effect, ElementRef, inject, signal } from '@angular/core';
import { ScheduleService } from '../../services/schedule.service';

const WHATSAPP_URL = 'https://wa.me/5551995172451';
const MONTH_NAMES = [
  'Janeiro',
  'Fevereiro',
  'Março',
  'Abril',
  'Maio',
  'Junho',
  'Julho',
  'Agosto',
  'Setembro',
  'Outubro',
  'Novembro',
  'Dezembro',
];

type DayCell = { key: string; date: Date | null };

@Component({
  selector: 'app-schedule-sidebar',
  imports: [],
  templateUrl: './schedule-sidebar.html',
  styleUrl: './schedule-sidebar.scss',
})
export class ScheduleSidebar {
  private schedule = inject(ScheduleService);
  private elementRef = inject(ElementRef);

  readonly isOpen = this.schedule.isOpen;
  readonly selectedDate = signal('');
  readonly dropdownOpen = signal(false);
  readonly today = this.toIso(new Date());
  readonly weekdays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

  private cursor = signal(new Date(new Date().getFullYear(), new Date().getMonth(), 1));

  readonly monthLabel = computed(() => {
    const current = this.cursor();
    return `${MONTH_NAMES[current.getMonth()]} ${current.getFullYear()}`;
  });

  readonly days = computed<DayCell[]>(() => {
    const current = this.cursor();
    const year = current.getFullYear();
    const month = current.getMonth();
    const startOffset = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const cells: DayCell[] = [];
    for (let i = 0; i < startOffset; i++) {
      cells.push({ key: `blank-${i}`, date: null });
    }
    for (let day = 1; day <= daysInMonth; day++) {
      cells.push({ key: `day-${day}`, date: new Date(year, month, day) });
    }
    while (cells.length % 7 !== 0) {
      cells.push({ key: `trail-${cells.length}`, date: null });
    }
    return cells;
  });

  constructor() {
    effect(() => {
      document.body.style.overflow = this.isOpen() ? 'hidden' : '';
      if (!this.isOpen()) {
        this.dropdownOpen.set(false);
      }
    });

    effect(() => {
      if (!this.dropdownOpen()) {
        return;
      }
      const handler = (event: MouseEvent) => {
        const host = this.elementRef.nativeElement as HTMLElement;
        if (!host.contains(event.target as Node)) {
          this.dropdownOpen.set(false);
        }
      };
      document.addEventListener('click', handler);
      return () => document.removeEventListener('click', handler);
    });
  }

  close(): void {
    this.schedule.close();
  }

  toggleDropdown(): void {
    this.dropdownOpen.update((value) => !value);
  }

  prevMonth(): void {
    const current = this.cursor();
    this.cursor.set(new Date(current.getFullYear(), current.getMonth() - 1, 1));
  }

  nextMonth(): void {
    const current = this.cursor();
    this.cursor.set(new Date(current.getFullYear(), current.getMonth() + 1, 1));
  }

  isSelected(date: Date): boolean {
    return this.toIso(date) === this.selectedDate();
  }

  isToday(date: Date): boolean {
    return this.toIso(date) === this.today;
  }

  isDisabled(date: Date): boolean {
    return this.toIso(date) < this.today;
  }

  select(date: Date): void {
    this.selectedDate.set(this.toIso(date));
    this.dropdownOpen.set(false);
  }

  confirm(): void {
    const date = this.selectedDate();
    if (!date) {
      return;
    }

    const text = [
      'Olá, gostaria de agendar um horário na FN Beauty!',
      `Você tem disponibilidade de horário no dia ${this.formatDate(date)}?`,
    ].join(' ');

    window.open(`${WHATSAPP_URL}?text=${encodeURIComponent(text)}`, '_blank', 'noopener');
    this.schedule.close();
  }

  formatDate(iso: string): string {
    const [year, month, day] = iso.split('-');
    return `${day}/${month}/${year}`;
  }

  private toIso(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}
