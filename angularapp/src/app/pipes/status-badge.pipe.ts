import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'statusBadge'
})
export class StatusBadgePipe implements PipeTransform {

  transform(status: string): string {
    if (!status) {
      return '';
    }

    const statusLower = status.toLowerCase();

    switch (statusLower) {
      case 'pending':
      case 'submitted':
        return 'badge-warning';
      case 'approved':
      case 'active':
      case 'accepted':
        return 'badge-success';
      case 'rejected':
      case 'declined':
      case 'cancelled':
        return 'badge-danger';
      case 'in review':
      case 'processing':
        return 'badge-info';
      case 'completed':
      case 'closed':
        return 'badge-secondary';
      default:
        return 'badge-primary';
    }
  }

}
