import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { Calendar } from '../models/calendarModel';

@Injectable({
  providedIn: 'root',
})
export class CalendarService {
  private apiUrl =
    'https://luegopago.blob.core.windows.net/luegopago-uploads/Pruebas%20LuegoPago/data.json';

  private businessHoursStart = 9 * 60;
  private businessHoursEnd = 17 * 60;
  private minDuration = 30;

  constructor(private http: HttpClient) {}

  getServicePayment(): Observable<Calendar[]> {
    return this.http.get<Calendar[]>(this.apiUrl);
  }

  availableSapces(day: string): Observable<number> {
    return this.getServicePayment().pipe(
      map((citas) => {
        // Filtrar citas solo para el día especificado
        const dateDay = citas.filter((cita) => cita.Day === day);

        // Ordenar las citas por hora de inicio
        dateDay.sort(
          (a, b) => this.convertTime(a.Hour) - this.convertTime(b.Hour)
        );

        // Calcular espacios disponibles entre las citas
        let availableSpaces = 0;
        let endtime = this.businessHoursStart;

        dateDay.forEach((cita) => {
          const startTime = this.convertTime(cita.Hour);

          // Calcular espacio antes de la cita
          availableSpaces += Math.max(0, startTime - endtime);

          // Actualizar la hora final después de la cita
          endtime = startTime + Number(cita.Duration);

          // Verificar la duración mínima de la cita
          if (Number(cita.Duration) < this.minDuration) {
            availableSpaces -= this.minDuration - Number(cita.Duration);
          }
        });

        // Calcular espacio después de la última cita
        availableSpaces += Math.max(0, this.businessHoursEnd - endtime);

        return availableSpaces;
      })
    );
  }

  private convertTime(hour: string): number {
    const [hours, minutes] = hour.split(':').map(Number);
    return hours * 60 + minutes;
  }
}
