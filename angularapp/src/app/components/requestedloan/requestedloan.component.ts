import { Component, OnInit } from '@angular/core';
import { LoanService } from 'src/app/services/loan.service';
import { LoanApplication } from 'src/app/models/loanapplication.model';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';
import { TruncatePipe } from 'src/app/pipes/truncate.pipe';

@Component({
  selector: 'app-requestedloan',
  templateUrl: './requestedloan.component.html',
  styleUrls: ['./requestedloan.component.css']
})
export class RequestedloanComponent implements OnInit {
  loanApplications: LoanApplication[] = [];
  quickFilterText = '';
  selectedStatus: string = '';
  showModal = false;
  selectedApplication?: LoanApplication;
  gridApi: any;
  isLoading: boolean = true; // ✅ Loading state

  defaultColDef = {
    sortable: true,
    filter: true,
    floatingFilter: true,
    resizable: true,
    flex: 1,
    minWidth: 100
  };

  columnDefs = [
    { headerName: 'S.No', valueGetter: 'node.rowIndex + 1', flex: 0, width: 80, minWidth: 80 },
    { 
      headerName: 'User ID', 
      field: 'UserId', 
      filter: 'agNumberColumnFilter', 
      flex: 1, 
      minWidth: 120,
      valueFormatter: (params: any) => params.value ? `#${params.value}` : ''
    },
    { 
      headerName: 'Loan ID', 
      field: 'LoanId', 
      filter: 'agNumberColumnFilter', 
      flex: 1, 
      minWidth: 120,
      valueFormatter: (params: any) => params.value ? `#${params.value}` : ''
    },
    { 
      headerName: 'Farm Purpose', 
      field: 'FarmPurpose', 
      filter: 'agTextColumnFilter', 
      flex: 2, 
      minWidth: 200,
      valueFormatter: (params: any) => this.truncatePipe.transform(params.value, 100)
    },
    {
      headerName: 'Status', 
      field: 'LoanStatus', 
      filter: 'agNumberColumnFilter',
      valueFormatter: (params: any) => this.getStatusText(params.value),
      flex: 1,
      minWidth: 120
    },
    {
      headerName: 'Action',
      cellRenderer: (params: any) => `
        <button class="btn-approve" ${params.data.LoanStatus === 1 ? 'disabled' : ''}>Approve</button>
        <button class="btn-reject" ${params.data.LoanStatus === 2 ? 'disabled' : ''}>Reject</button>
      `,
      flex: 0,
      width:300,
      minWidth: 220
    },
    {
      headerName: 'Details',
      cellRenderer: () => `<button class="btn-details">Details</button>`,
      flex: 0,
      width: 120,
      minWidth: 120
    }
  ];

  constructor(
    private loanService: LoanService, 
    public authService: AuthService,
    private truncatePipe: TruncatePipe
  ) {}

  ngOnInit(): void {
    // Show loading animation for at least 2.5 seconds
    const minLoadingTime = new Promise(resolve => setTimeout(resolve, 2500));
    
    // Load data
    const dataLoaded = this.fetchLoanApplicationsPromise();
    
    // Wait for both the minimum time and data to load
    Promise.all([minLoadingTime, dataLoaded]).then(() => {
      this.isLoading = false;
    });
  }

  fetchLoanApplicationsPromise(): Promise<void> {
    return new Promise((resolve) => {
      this.loanService.getAllLoanApplications().subscribe({
        next: (data) => {
          this.loanApplications = data;
          resolve();
        },
        error: (err) => {
          console.error('Error fetching loan applications', err);
          resolve();
        }
      });
    });
  }

  fetchLoanApplications(): void {
    this.loanService.getAllLoanApplications().subscribe({
      next: (data) => this.loanApplications = data,
      error: (err) => console.error('Error fetching loan applications', err)
    });
  }

  onGridReady(params: any): void {
    this.gridApi = params.api;
  }

  onQuickFilterChanged(event: any): void {
    this.quickFilterText = event.target.value;
  }

  
  applyStatusFilter(): void {
    if (this.gridApi) {
      const filterModel = this.selectedStatus
        ? { LoanStatus: { type: 'equals', filter: parseInt(this.selectedStatus, 10) } }
        : {};
      this.gridApi.setFilterModel(filterModel);
      this.gridApi.onFilterChanged();
    }
  }


  onCellClicked(event: any): void {
    if (event.colDef.headerName === 'Action') {
      if (event.event.target.classList.contains('btn-approve')) {
        this.approveLoan(event.data);
        this.gridApi.refreshCells({ force: true });
      } else if (event.event.target.classList.contains('btn-reject')) {
        this.rejectLoan(event.data);
        
      }
    } else if (event.colDef.headerName === 'Details' && event.event.target.classList.contains('btn-details')) {
      this.showDetails(event.data);
    }
  }

  approveLoan(app: LoanApplication): void {
    Swal.fire({
      title: 'Approve Loan Application?',
      text: `Are you sure you want to approve this loan application for ${app.FarmPurpose}?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#28a745',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Yes, approve it!',
      cancelButtonText: 'Cancel',
      customClass: {
        confirmButton: 'success-confirm'
      }
    }).then((result) => {
      if (result.isConfirmed) {
        const updatedApp = { ...app, LoanStatus: 1 };
        this.loanService.updateLoanStatus(app.LoanApplicationId!, updatedApp).subscribe({
          next: () => {
            app.LoanStatus = 1; // Update locally
            this.gridApi.refreshCells({ force: true });
            Swal.fire({
              icon: 'success',
              title: 'Approved!',
              text: 'Loan application has been approved successfully.',
              timer: 2500,
              timerProgressBar: true,
              showConfirmButton: false,
              customClass: {
                timerProgressBar: 'green-progress-bar'
              }
            });
          },
          error: () => {
            Swal.fire({
              icon: 'error',
              title: 'Approval Failed',
              text: 'Failed to approve loan application. Please try again.',
              confirmButtonText: 'OK',
              customClass: {
                confirmButton: 'gold-confirm'
              }
            });
          }
        });
      }
    });
  }
  
  rejectLoan(app: LoanApplication): void {
    Swal.fire({
      title: 'Reject Loan Application?',
      text: `Are you sure you want to reject this loan application for ${app.FarmPurpose}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#e74c3c',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Yes, reject it!',
      cancelButtonText: 'Cancel',
      customClass: {
        confirmButton: 'delete-confirm'
      }
    }).then((result) => {
      if (result.isConfirmed) {
        const updatedApp = { ...app, LoanStatus: 2 };
        this.loanService.updateLoanStatus(app.LoanApplicationId!, updatedApp).subscribe({
          next: () => {
            app.LoanStatus = 2; // Update locally
            this.gridApi.refreshCells({ force: true });
            Swal.fire({
              icon: 'info',
              title: 'Rejected',
              text: 'Loan application has been rejected.',
              timer: 2500,
              timerProgressBar: true,
              showConfirmButton: false,
              customClass: {
                timerProgressBar: 'blue-progress-bar'
              }
            });
          },
          error: () => {
            Swal.fire({
              icon: 'error',
              title: 'Rejection Failed',
              text: 'Failed to reject loan application. Please try again.',
              confirmButtonText: 'OK',
              customClass: {
                confirmButton: 'gold-confirm'
              }
            });
          }
        });
      }
    });
  }

  showDetails(app: LoanApplication): void {
    this.selectedApplication = app;
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.selectedApplication = undefined;
  }

  getStatusText(status: number): string {
    switch (status) {
      case 0: return 'Pending';
      case 1: return 'Approved';
      case 2: return 'Rejected';
      default: return 'Unknown';
    }
  }
}