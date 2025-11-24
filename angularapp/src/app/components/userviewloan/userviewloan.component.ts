import { Component, OnInit } from '@angular/core';
import { LoanService } from 'src/app/services/loan.service';
import { Router } from '@angular/router';
import { Loan } from 'src/app/models/loan.model';
import { LoanApplication } from 'src/app/models/loanapplication.model';
import { AuthService } from 'src/app/services/auth.service';
import { CurrencyFormatPipe } from 'src/app/pipes/currency-format.pipe';
import { TruncatePipe } from 'src/app/pipes/truncate.pipe';
@Component({
  selector: 'app-userviewloan',
  templateUrl: './userviewloan.component.html',
  styleUrls: ['./userviewloan.component.css']
})
export class UserviewloanComponent implements OnInit {
  loans: Loan[] = [];
  appliedLoanIds: number[] = [];
  userId: number = 0;
  gridApi: any; //  Declare gridApi
  isLoading: boolean = true; // Loading state

  defaultColDef = {
    resizable: true,
    sortable: true,
    filter: true
  };

  columnDefs = [
    { headerName: 'S.No', valueGetter: 'node.rowIndex + 1', width: 80 },
    { headerName: 'Loan Type', field: 'LoanType', flex: 1 },
    { 
      headerName: 'Loan Description', 
      field: 'Description', 
      flex: 2,
      valueFormatter: (params: any) => this.truncatePipe.transform(params.value, 100)
    },
    { 
      headerName: 'Interest Rate', 
      field: 'InterestRate', 
      flex: 1,
      valueFormatter: (params: any) => params.value ? `${params.value}% p.a.` : ''
    },
    { 
      headerName: 'Maximum Amount', 
      field: 'MaximumAmount', 
      flex: 1,
      valueFormatter: (params: any) => this.currencyPipe.transform(params.value)
    },
    { 
      headerName: 'Repayment Tenure (Months)', 
      field: 'RepaymentTenure', 
      flex: 1,
      valueFormatter: (params: any) => params.value ? `${params.value} months` : ''
    },
    { 
      headerName: 'Eligibility', 
      field: 'Eligibility', 
      flex: 2,
      valueFormatter: (params: any) => this.truncatePipe.transform(params.value, 80)
    },
    { 
      headerName: 'Documents Required', 
      field: 'DocumentsRequired', 
      flex: 2,
      valueFormatter: (params: any) => this.truncatePipe.transform(params.value, 80)
    },
    {
      headerName: 'Action',
      cellRenderer: (params: any) => {
        return this.isApplied(params.data.LoanId)
          ? `<button class="applied-btn" disabled>Applied</button>`
          : `<button class="btn-apply">Apply</button>`;
      },
      width: 150
    }
  ];

  constructor(
    private loanService: LoanService,
    private router: Router,
    private authService: AuthService,
    private currencyPipe: CurrencyFormatPipe,
    private truncatePipe: TruncatePipe
  ) {}

  ngOnInit(): void {
    this.userId = this.authService.getUserId();
    
    // Show loading animation for at least 2.5 seconds
    const minLoadingTime = new Promise(resolve => setTimeout(resolve, 2500));
    
    // Load data
    const dataLoaded = Promise.all([
      this.loadLoansPromise(),
      this.loadAppliedLoansPromise()
    ]);
    
    // Wait for both the minimum time and data to load
    Promise.all([minLoadingTime, dataLoaded]).then(() => {
      this.isLoading = false;
    });
  }

  onGridReady(params: any): void {
    this.gridApi = params.api; // Capture gridApi
  }

  loadLoansPromise(): Promise<void> {
    return new Promise((resolve) => {
      this.loanService.getAllLoans().subscribe({
        next: (data) => {
          this.loans = data;
          resolve();
        },
        error: () => {
          console.error('Failed to load loans');
          resolve();
        }
      });
    });
  }

  loadAppliedLoansPromise(): Promise<void> {
    return new Promise((resolve) => {
      this.loanService.getAppliedLoans(this.userId).subscribe({
        next: (data: LoanApplication[]) => {
          this.appliedLoanIds = data.map(app => app.LoanId!);
          if (this.gridApi) {
            this.gridApi.refreshCells({ force: true });
          }
          resolve();
        },
        error: () => {
          console.error('Failed to load applied loans');
          resolve();
        }
      });
    });
  }

  loadLoans(): void {
    this.loanService.getAllLoans().subscribe({
      next: (data) => this.loans = data,
      error: () => console.error('Failed to load loans')
    });
  }

  loadAppliedLoans(): void {
    this.loanService.getAppliedLoans(this.userId).subscribe({
      next: (data: LoanApplication[]) => {
        this.appliedLoanIds = data.map(app => app.LoanId!);
        if (this.gridApi) {
          this.gridApi.refreshCells({ force: true }); // Refresh cells
        }
      },
      error: () => console.error('Failed to load applied loans')
    });
  }
  
  isApplied(loanId: number): boolean {
    return this.appliedLoanIds.includes(loanId);
  }
  
  applyLoan(loanId: number): void {
    this.router.navigate(['/user/loanform', loanId]);
  }
  
  onCellClicked(event: any): void {
    if (event.colDef.headerName === 'Action' && event.event.target.classList.contains('btn-apply')) {
      this.applyLoan(event.data.LoanId);
    }
  }

}

