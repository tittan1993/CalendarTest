import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { CalendarService } from './services/calendar.service';
import { HttpClientModule } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, HttpClientModule, FormsModule],
  providers: [CalendarService],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  selectedDay: string = '';
  days = [
    { id: 1, name: 'lunes' },
    { id: 2, name: 'martes' },
    { id: 3, name: 'miércoles' },
    { id: 4, name: 'jueves' },
    { id: 5, name: 'viernes' },
  ];
  spacesAvailable$: Observable<number>;

  constructor(private service: CalendarService) {
    this.selectedDay = this.days.length > 0 ? this.days[0].name : '';
    this.spacesAvailable$ = this.service.availableSapces(this.selectedDay);
  }

  setValue(day: string) {
        this.spacesAvailable$ = this.service.availableSapces(day);
  }
}
