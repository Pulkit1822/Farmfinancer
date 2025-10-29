import { Component, OnInit } from '@angular/core';
import { LoanService } from 'src/app/services/loan.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-viewloan',
  templateUrl: './viewloan.component.html',
  styleUrls: ['./viewloan.component.css']
})
export class ViewloanComponent implements OnInit {
  loans: any[] = [];
  quickFilterText = '';
  gridApi: any;
  isLoading: boolean = true; //  Loading state

  defaultColDef = {
    sortable: true,
    filter: true,           // Enables column filters
    floatingFilter: true,   // Shows filter box under header
    resizable: true,
    flex: 1,
    minWidth: 100
  };

  columnDefs = [
    { headerName: 'S.No', valueGetter: 'node.rowIndex + 1', flex: 0, width: 80, minWidth: 80 },
    { headerName: 'Loan Type', field: 'LoanType', filter: 'agTextColumnFilter', flex: 1.5, minWidth: 150 },
    { headerName: 'Maximum Amount', field: 'MaximumAmount', filter: 'agNumberColumnFilter', flex: 1.2, minWidth: 140 },
    { headerName: 'Interest Rate (%)', field: 'InterestRate', filter: 'agNumberColumnFilter', flex: 1.2, minWidth: 140 },
    { headerName: 'Repayment Tenure', field: 'RepaymentTenure', filter: 'agNumberColumnFilter', flex: 1.3, minWidth: 150 },
    { headerName: 'Eligibility Criteria', field: 'Eligibility', filter: 'agTextColumnFilter', flex: 2, minWidth: 180 },
    { headerName: 'Documents Required', field: 'DocumentsRequired', filter: 'agTextColumnFilter', flex: 2, minWidth: 180 },
    { headerName: 'Description', field: 'Description', filter: 'agTextColumnFilter', flex: 2.5, minWidth: 200 },
    {
      headerName: 'Action',
      cellRenderer: () => `
        <button class="btn-edit">Edit</button>
        <button class="btn-delete">Delete</button>
      `,
      flex: 0,
      width: 300,
      minWidth: 200
    }
  ];

  constructor(private loanService: LoanService, private router: Router) {}

  ngOnInit(): void {
    // Show loading animation for at least 2.5 seconds
    const minLoadingTime = new Promise(resolve => setTimeout(resolve, 2500));
    
    // Load data
    const dataLoaded = this.fetchLoansPromise();
    
    // Wait for both the minimum time and data to load
    Promise.all([minLoadingTime, dataLoaded]).then(() => {
      this.isLoading = false;
    });
  }

  fetchLoansPromise(): Promise<void> {
    return new Promise((resolve) => {
      this.loanService.getAllLoans().subscribe({
        next: (data) => {
          this.loans = data;
          resolve();
        },
        error: (err) => {
          console.error('Error fetching loans', err);
          resolve();
        }
      });
    });
  }

  fetchLoans(): void {
    this.loanService.getAllLoans().subscribe({
      next: (data) => this.loans = data,
      error: (err) => console.error('Error fetching loans', err)
    });
  }

  onGridReady(params: any): void {
    this.gridApi = params.api;
  }

  onQuickFilterChanged(event: any): void {
    this.quickFilterText = event.target.value;
  }

  editLoan(id: number): void {
    this.router.navigate([`/admin/editloan/${id}`]);
  }

  deleteLoan(id: number): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to delete this loan? This action cannot be undone!',
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
        this.loanService.deleteLoan(id).subscribe({
          next: () => {
            Swal.fire({
              icon: 'success',
              title: 'Deleted!',
              text: 'Loan deleted successfully.',
              timer: 2500,
              timerProgressBar: true,
              showConfirmButton: false,
              customClass: {
                timerProgressBar: 'green-progress-bar'
              }
            });
            this.fetchLoans();
          },
          error: () => {
            Swal.fire({
              icon: 'error',
              title: 'Deletion Failed',
              text: 'Loan cannot be deleted. It is referenced in Loan Application.',
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

  onCellClicked(event: any): void {
    if (event.colDef.headerName === 'Action') {
      if (event.event.target.classList.contains('btn-edit')) {
        this.editLoan(event.data.LoanId);
      } else if (event.event.target.classList.contains('btn-delete')) {
        this.deleteLoan(event.data.LoanId);
      }
    }
  }
}