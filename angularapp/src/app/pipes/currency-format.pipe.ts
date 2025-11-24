import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'currencyFormat'
})
export class CurrencyFormatPipe implements PipeTransform {

  transform(value: number | string, currencySymbol: string = '₹'): string {
    if (value === null || value === undefined) {
      return '';
    }

    const numValue = typeof value === 'string' ? parseFloat(value) : value;

    if (isNaN(numValue)) {
      return '';
    }

    // Format the number with Indian numbering system (lakhs and crores)
    const formattedValue = numValue.toLocaleString('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });

    return `${currencySymbol} ${formattedValue}`;
  }

}
