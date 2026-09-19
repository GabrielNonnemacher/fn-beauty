import { Component, inject } from '@angular/core';
import { ScheduleService } from '../../services/schedule.service';

@Component({
  selector: 'app-instagram',
  imports: [],
  templateUrl: './instagram.html',
  styleUrl: './instagram.scss',
})
export class Instagram {
  private schedule = inject(ScheduleService);

  openSchedule(): void {
    this.schedule.open();
  }
}