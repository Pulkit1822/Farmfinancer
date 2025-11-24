import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'loanStatus'
})
export class LoanStatusPipe implements PipeTransform {

  transform(status: string): string {
    if (!status) {
      return 'Unknown';
    }

    const statusMap: { [key: string]: string } = {
      'pending': 'Pending Approval',
      'approved': 'Approved',
      'rejected': 'Rejected',
      'active': 'Active',
      'closed': 'Closed',
      'cancelled': 'Cancelled',
      'processing': 'Processing',
      'in review': 'In Review',
      'submitted': 'Submitted'
    };

    return statusMap[status.toLowerCase()] || status;
  }

}
