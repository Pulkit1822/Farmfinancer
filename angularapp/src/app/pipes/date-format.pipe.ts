import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dateFormat'
})
export class DateFormatPipe implements PipeTransform {

  transform(value: string | Date, format: string = 'short'): string {
    if (!value) {
      return '';
    }

    const date = typeof value === 'string' ? new Date(value) : value;

    if (isNaN(date.getTime())) {
      return '';
    }

    switch (format) {
      case 'short':
        // DD/MM/YYYY
        return this.formatShortDate(date);
      case 'long':
        // DD Month YYYY
        return this.formatLongDate(date);
      case 'full':
        // Day, DD Month YYYY
        return this.formatFullDate(date);
      case 'time':
        // HH:MM AM/PM
        return this.formatTime(date);
      case 'datetime':
        // DD/MM/YYYY HH:MM AM/PM
        return `${this.formatShortDate(date)} ${this.formatTime(date)}`;
      default:
        return this.formatShortDate(date);
    }
  }

  private formatShortDate(date: Date): string {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  private formatLongDate(date: Date): string {
    const day = date.getDate();
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'];
    const month = monthNames[date.getMonth()];
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  }

  private formatFullDate(date: Date): string {
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const dayName = dayNames[date.getDay()];
    return `${dayName}, ${this.formatLongDate(date)}`;
  }

  private formatTime(date: Date): string {
    let hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    return `${hours}:${minutes} ${ampm}`;
  }

}
