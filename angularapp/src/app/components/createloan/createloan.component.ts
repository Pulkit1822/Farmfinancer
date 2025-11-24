import { Component } from '@angular/core';
import { LoanService } from 'src/app/services/loan.service';
import { Loan } from 'src/app/models/loan.model';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-createloan',
  templateUrl: './createloan.component.html',
  styleUrls: ['./createloan.component.css']
})
export class CreateLoanComponent {
  loan: Loan = {
    LoanType: '',
    Description: '',
    InterestRate: 0,
    MaximumAmount: 0,
    RepaymentTenure: 0,
    Eligibility: '',
    DocumentsRequired: ''
  };

  successMessage = '';
  errorMessage = '';
  existingLoanTypes: string[] = [];
  showCoin: boolean = true;
  
  // Live validation error messages
  loanTypeError: string = '';
  descriptionError: string = '';
  interestRateError: string = '';
  maxAmountError: string = '';
  repaymentTenureError: string = '';

  constructor(private loanService: LoanService, public rtr:Router) {}

  // Loan Type validation - max 10 characters, min 3 characters
  validateLoanTypeLive() {
    if (!this.loan.LoanType) {
      this.loanTypeError = '';
      return;
    }
    if (this.loan.LoanType.length < 3) {
      this.loanTypeError = 'Loan Type must be at least 3 characters.';
    } else if (this.loan.LoanType.length > 10) {
      this.loanTypeError = 'Loan Type cannot exceed 10 characters.';
      this.loan.LoanType = this.loan.LoanType.substring(0, 10);
    } else {
      this.loanTypeError = '';
    }
  }

  // Description validation - max 20 characters, min 3 characters
  validateDescriptionLive() {
    if (!this.loan.Description) {
      this.descriptionError = '';
      return;
    }
    if (this.loan.Description.length < 3) {
      this.descriptionError = 'Description must be at least 3 characters.';
    } else if (this.loan.Description.length > 20) {
      this.descriptionError = 'Description cannot exceed 20 characters.';
      this.loan.Description = this.loan.Description.substring(0, 20);
    } else {
      this.descriptionError = '';
    }
  }

  // Interest Rate validation - cannot be 0 or negative
  validateInterestRateLive() {
    if (this.loan.InterestRate === null || this.loan.InterestRate === undefined) {
      this.interestRateError = '';
      return;
    }
    if (this.loan.InterestRate <= 0) {
      this.interestRateError = 'Interest Rate must be greater than 0.';
    } else if (this.loan.InterestRate > 100) {
      this.interestRateError = 'Interest Rate cannot exceed 100%.';
    } else {
      this.interestRateError = '';
    }
  }

  // Maximum Amount validation - max 1000000
  validateMaxAmountLive() {
    if (this.loan.MaximumAmount === null || this.loan.MaximumAmount === undefined) {
      this.maxAmountError = '';
      return;
    }
    if (this.loan.MaximumAmount <= 0) {
      this.maxAmountError = 'Maximum Amount must be greater than 0.';
    } else if (this.loan.MaximumAmount > 1000000) {
      this.maxAmountError = 'Maximum Amount cannot exceed ₹10,00,000.';
      this.loan.MaximumAmount = 1000000;
    } else {
      this.maxAmountError = '';
    }
  }

  // Repayment Tenure validation - at least 1 month
  validateRepaymentTenureLive() {
    if (this.loan.RepaymentTenure === null || this.loan.RepaymentTenure === undefined) {
      this.repaymentTenureError = '';
      return;
    }
    if (this.loan.RepaymentTenure < 1) {
      this.repaymentTenureError = 'Repayment Tenure must be at least 1 month.';
    } else if (this.loan.RepaymentTenure > 360) {
      this.repaymentTenureError = 'Repayment Tenure cannot exceed 360 months (30 years).';
    } else {
      this.repaymentTenureError = '';
    }
  }

  // Prevent negative numbers and special characters
  preventNegativeNumbers(event: KeyboardEvent) {
    const key = event.key;
    
    // Allow: backspace, delete, tab, escape, enter, arrows, decimal point
    if (
      key === 'Backspace' || 
      key === 'Delete' || 
      key === 'Tab' || 
      key === 'Escape' || 
      key === 'Enter' ||
      key === 'ArrowLeft' || 
      key === 'ArrowRight' || 
      key === 'ArrowUp' || 
      key === 'ArrowDown' ||
      key === '.' ||
      (event.ctrlKey || event.metaKey) // Allow Ctrl+C, Ctrl+V, etc.
    ) {
      return; // Allow these keys
    }
    
    // Block minus sign and other non-numeric characters
    if (key === '-' || key === '+' || key === 'e' || key === 'E') {
      event.preventDefault();
      Swal.fire({
        icon: 'warning',
        title: 'Invalid Input',
        text: 'Negative numbers and special characters are not allowed.',
        timer: 2000,
        timerProgressBar: true,
        showConfirmButton: false,
        customClass: {
          timerProgressBar: 'gold-progress-bar'
        }
      });
      return;
    }
    
    // Only allow numbers (0-9)
    const isValidChar = /^[0-9]$/.test(key);
    
    if (!isValidChar) {
      event.preventDefault();
    }
  }

  // Prevent typing if max amount would exceed 1000000
  preventExceedMaxAmount(event: KeyboardEvent) {
    const key = event.key;
    const input = event.target as HTMLInputElement;
    const currentValue = input.value;
    const selectionStart = input.selectionStart || 0;
    const selectionEnd = input.selectionEnd || 0;
    
    // Allow: backspace, delete, tab, escape, enter, arrows
    if (
      key === 'Backspace' || 
      key === 'Delete' || 
      key === 'Tab' || 
      key === 'Escape' || 
      key === 'Enter' ||
      key === 'ArrowLeft' || 
      key === 'ArrowRight' || 
      key === 'ArrowUp' || 
      key === 'ArrowDown' ||
      (event.ctrlKey || event.metaKey) // Allow Ctrl+C, Ctrl+V, etc.
    ) {
      return; // Allow these keys
    }
    
    // Block minus sign and other non-numeric characters
    if (key === '-' || key === '+' || key === 'e' || key === 'E' || key === '.') {
      event.preventDefault();
      return;
    }
    
    // Only allow numbers (0-9)
    const isValidChar = /^[0-9]$/.test(key);
    
    if (!isValidChar) {
      event.preventDefault();
      return;
    }
    
    // Calculate what the new value would be after this keypress
    const newValue = currentValue.substring(0, selectionStart) + key + currentValue.substring(selectionEnd);
    const newNumericValue = parseInt(newValue, 10);
    
    // Prevent if it would exceed 1000000
    if (newNumericValue > 1000000) {
      event.preventDefault();
      Swal.fire({
        icon: 'warning',
        title: 'Maximum Limit Reached',
        text: 'Maximum Amount cannot exceed ₹10,00,000.',
        timer: 2000,
        timerProgressBar: true,
        showConfirmButton: false,
        customClass: {
          timerProgressBar: 'gold-progress-bar'
        }
      });
    }
  }

  // Prevent tab if field is empty
  preventTabIfEmpty(event: KeyboardEvent, value: any, fieldName: string) {
    if (!value || (typeof value === 'string' && value.trim() === '') || value === 0) {
      event.preventDefault();
      Swal.fire({
        icon: 'warning',
        title: 'Required Field',
        text: `${fieldName} cannot be empty.`,
        timer: 2000,
        timerProgressBar: true,
        showConfirmButton: false,
        customClass: {
          timerProgressBar: 'gold-progress-bar'
        }
      });
    }
  }

  ngOnInit(): void {
    this.loanService.getAllLoans().subscribe({
      next: (data) => {
        this.existingLoanTypes = data.map(l => l.LoanType);
      },
      error: (err) => console.error('Error fetching existing loans', err)
    });
  }

  onSubmit(form: any): void {
    this.successMessage = '';
    this.errorMessage = '';

    if (form.invalid) {
      form.control.markAllAsTouched();
      return;
    }
    
    // Validate all fields before submission
    if (this.loan.InterestRate <= 0) {
      Swal.fire({
        icon: 'error',
        title: 'Invalid Interest Rate',
        text: 'Interest Rate must be greater than 0.',
        confirmButtonText: 'OK',
        customClass: {
          confirmButton: 'gold-confirm'
        }
      });
      return;
    }
    
    if (this.loan.MaximumAmount > 1000000) {
      Swal.fire({
        icon: 'error',
        title: 'Invalid Maximum Amount',
        text: 'Maximum Amount cannot exceed ₹10,00,000.',
        confirmButtonText: 'OK',
        customClass: {
          confirmButton: 'gold-confirm'
        }
      });
      return;
    }
    
    if (this.loan.RepaymentTenure < 1) {
      Swal.fire({
        icon: 'error',
        title: 'Invalid Repayment Tenure',
        text: 'Repayment Tenure must be at least 1 month.',
        confirmButtonText: 'OK',
        customClass: {
          confirmButton: 'gold-confirm'
        }
      });
      return;
    }
    
    if (this.loan.LoanType.length < 3 || this.loan.LoanType.length > 10) {
      Swal.fire({
        icon: 'error',
        title: 'Invalid Loan Type',
        text: 'Loan Type must be between 3 and 10 characters.',
        confirmButtonText: 'OK',
        customClass: {
          confirmButton: 'gold-confirm'
        }
      });
      return;
    }
    
    if (this.loan.Description.length < 3 || this.loan.Description.length > 20) {
      Swal.fire({
        icon: 'error',
        title: 'Invalid Description',
        text: 'Description must be between 3 and 20 characters.',
        confirmButtonText: 'OK',
        customClass: {
          confirmButton: 'gold-confirm'
        }
      });
      return;
    }
    
    if (this.existingLoanTypes.includes(this.loan.LoanType)) {
      this.errorMessage = 'Loan with the same type already exists';
      Swal.fire({
        icon: 'error',
        title: 'Duplicate Loan Type',
        text: 'A loan with this type already exists.',
        confirmButtonText: 'OK',
        customClass: {
          confirmButton: 'gold-confirm'
        }
      });
      return;
    }
 
    this.loanService.addLoan(this.loan).subscribe({
      next: () => {
        this.successMessage = 'Successfully Added!';
        Swal.fire({
          icon: 'success',
          title: 'Loan Added Successfully',
          text: 'Your loan has been added to the catalogue.',
          timer: 2500,
          timerProgressBar: true,
          showConfirmButton: false,
          customClass: {
            timerProgressBar: 'green-progress-bar',
            confirmButton: 'success-confirm'
          }
        });
        form.resetForm();
        this.rtr.navigate(['/admin']);
      },
      error: () => {
        this.errorMessage = 'Failed to add loan';
        Swal.fire({
          icon: 'error',
          title: 'Failed to Add Loan',
          text: 'Unable to add loan to your catalogue. Please try again.',
          confirmButtonText: 'OK',
          customClass: {
            confirmButton: 'gold-confirm'
          }
        });
        return;
      }
    });
  }
}