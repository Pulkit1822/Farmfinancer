import { Component, OnInit } from '@angular/core';
import { LoanService } from 'src/app/services/loan.service';
import { LoanApplication } from 'src/app/models/loanapplication.model';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';
import { DateFormatPipe } from 'src/app/pipes/date-format.pipe';
import { TruncatePipe } from 'src/app/pipes/truncate.pipe';
@Component({
  selector: 'app-userappliedloan',
  templateUrl: './userappliedloan.component.html',
  styleUrls: ['./userappliedloan.component.css']
})
export class UserappliedloanComponent implements OnInit {
  loanApplications: LoanApplication[] = [];
  filteredApplications: LoanApplication[] = [];
  searchText: string = '';
  showModal: boolean = false;
  selectedLoanId?: number;
  userId: number; // Replace with actual user ID logic
  isLoading: boolean = true; // ✅ Loading state
  
  constructor(
    private loanService: LoanService,
    public authService: AuthService,
    private datePipe: DateFormatPipe,
    private truncatePipe: TruncatePipe
  ) {}
  
  ngOnInit(): void {
    this.userId = this.authService.getUserId();
    
    // Show loading animation for at least 2.5 seconds
    const minLoadingTime = new Promise(resolve => setTimeout(resolve, 2500));
    
    // Load data
    const dataLoaded = this.loadAppliedLoansPromise();
    
    // Wait for both the minimum time and data to load
    Promise.all([minLoadingTime, dataLoaded]).then(() => {
      this.isLoading = false;
    });
  }

  loadAppliedLoansPromise(): Promise<void> {
    return new Promise((resolve) => {
      this.loanService.getAppliedLoans(this.userId).subscribe({
        next: (data) => {
          this.loanApplications = data;
          this.filteredApplications = data;
          resolve();
        },
        error: () => {
          console.error('Failed to load applied loans');
          resolve();
        }
      });
    });
  }

  loadAppliedLoans(): void {
    this.loanService.getAppliedLoans(this.userId).subscribe({
      next: (data) => {
        this.loanApplications = data;
        this.filteredApplications = data;
      },
      error: () => console.error('Failed to load applied loans')
    });
  }
  filterLoans(): void {
    const term = this.searchText.toLowerCase();
    this.filteredApplications = this.loanApplications.filter(app =>
      app.FarmPurpose.toLowerCase().includes(term)
    );
  }
  
  confirmDelete(id: number): void {
    // Get the loan application to show details in confirmation
    const loanApp = this.loanApplications.find(app => app.LoanApplicationId === id);
    
    Swal.fire({
      title: 'Delete Loan Application?',
      text: loanApp ? `Are you sure you want to delete the application for ${loanApp.FarmPurpose}?` : 'Are you sure you want to delete this loan application?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#e74c3c',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
      customClass: {
        confirmButton: 'delete-confirm'
      }
    }).then((result) => {
      if (result.isConfirmed) {
        this.deleteLoan(id);
      }
    });
  }
  
  deleteLoan(id: number): void {
    this.loanService.deleteLoanApplication(id).subscribe({
      next: () => {
        // Reload the data after deletion
        this.loadAppliedLoans();

        // Refresh Ag-Grid immediately
        if (this.gridApi) {
          this.gridApi.refreshCells({ force: true });
        }

        // Show success message
        Swal.fire({
          icon: 'success',
          title: 'Deleted!',
          text: 'Your loan application has been deleted successfully.',
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
          title: 'Deletion Failed',
          text: 'Failed to delete loan application. Please try again.',
          confirmButtonText: 'OK',
          customClass: {
            confirmButton: 'gold-confirm'
          }
        });
      }
    });
  }

  closeModal(): void {
    this.showModal = false;
    this.selectedLoanId = undefined;
  }

  gridApi: any;

  defaultColDef = {
    resizable: true,
    sortable: true,
    filter: true
  };

  columnDefs = [
    { headerName: 'S.No', valueGetter: 'node.rowIndex + 1', width: 80 },
    { headerName: 'Farm Location', field: 'FarmLocation', flex: 1 },
    { 
      headerName: 'Farmer Address', 
      field: 'FarmerAddress', 
      flex: 2,
      valueFormatter: (params: any) => this.truncatePipe.transform(params.value, 100)
    },
    { headerName: 'Farm Size (acres)', field: 'FarmSizeInAcres', flex: 1 },
    { 
      headerName: 'Farm Purpose', 
      field: 'FarmPurpose', 
      flex: 2,
      valueFormatter: (params: any) => this.truncatePipe.transform(params.value, 100)
    },
    {
      headerName: 'Submission Date',
      field: 'SubmissionDate',
      flex: 1,
      valueFormatter: (params: any) => this.datePipe.transform(params.value, 'long')
    },
    {
      headerName: 'Status',
      field: 'LoanStatus',
      flex: 1,
      valueFormatter: params => {
        switch (params.value) {
          case 0: return 'Pending';
          case 1: return 'Approved';
          case 2: return 'Rejected';
          default: return 'Unknown';
        }
      }
    },
    {
      headerName: 'Action',
      cellRenderer: params => {
        const isApproved = params.data.LoanStatus === 1;
        return `<button class="btn-delete ${isApproved ? 'disabled' : ''}" ${isApproved ? 'disabled' : ''}>Delete</button>`;
      },
      width: 120
    }
  ];
  
  onCellClicked(event: any): void {
    if (
      event.colDef.headerName === 'Action' &&
      event.event.target.classList.contains('btn-delete')
    ) {
      if (event.data.LoanStatus === 1) {
        Swal.fire({
          icon: 'warning',
          title: 'Cannot Delete',
          text: 'Approved loans cannot be deleted.',
          confirmButtonText: 'OK',
          customClass: {
            confirmButton: 'gold-confirm'
          }
        });
        return;
      }
  
      if (event.data.LoanApplicationId) {
        this.confirmDelete(event.data.LoanApplicationId);
      } else {
        console.error('LoanApplicationId not found in row data:', event.data);
      }
    }
  }

  onGridReady(params: any): void {
    this.gridApi = params.api;
  }

}
 