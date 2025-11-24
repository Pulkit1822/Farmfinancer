import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LoanService } from 'src/app/services/loan.service';
import { AuthService } from 'src/app/services/auth.service';
import { LoanApplication } from 'src/app/models/loanapplication.model';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-loanform',
  templateUrl: './loanform.component.html',
  styleUrls: ['./loanform.component.css']
})
export class LoanFormComponent implements OnInit {
  loanForm: FormGroup;
  selectedFile: File | null = null;
  submitting = false;
  private loanId: number = 0;
  private userId: number = 0;

  // Validation error messages
  farmLocationError: string = '';
  farmerAddressError: string = '';
  farmSizeError: string = '';
  loanPurposeError: string = '';

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    public router: Router,
    private loanService: LoanService,
    private authService: AuthService
  ) {
    this.loanForm = this.fb.group({
      farmLocation: ['', Validators.required],
      farmerAddress: ['', Validators.required],
      farmSize: [null, [Validators.required, Validators.min(1)]],
      loanPurpose: ['', Validators.required],
      proof: [null, Validators.required]
    });
  }
  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.loanId = Number(idParam);
    }
    this.userId = this.authService.getUserId();
  }
  get f() {
    return this.loanForm.controls;
  }
  onFileChange(event: any): void {
    const file = event.target.files?.[0];
    if (file) {
      this.selectedFile = file;
      this.loanForm.patchValue({ proof: file });
    }
  }
  onSubmit(): void {
    if (this.loanForm.invalid || !this.selectedFile) {
      this.loanForm.markAllAsTouched();
      Swal.fire({
        icon: 'error',
        title: 'Incomplete Form',
        text: 'Please fill all required fields and upload proof.',
        confirmButtonText: 'OK',
        customClass: {
          confirmButton: 'gold-confirm'
        }
      });
      return;
    }
    this.submitting = true;
    Swal.fire({
      title: 'Submitting Application...',
      text: 'Please wait while we upload your proof and process your request.',
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading()
    });
    const reader = new FileReader();
    reader.onload = () => {
      const fileBase64 = reader.result as string;
      const loanApplication: LoanApplication = {
        UserId: this.userId,
        LoanId: this.loanId,
        SubmissionDate: new Date().toISOString(),
        LoanStatus: 0,
        FarmLocation: this.f.farmLocation.value,
        FarmerAddress: this.f.farmerAddress.value,
        FarmSizeInAcres: this.f.farmSize.value,
        FarmPurpose: this.f.loanPurpose.value,
        File: fileBase64
      };
      this.loanService.addLoanApplication(loanApplication).subscribe({
        next: () => {
          Swal.fire({
            title: 'Application Submitted!',
            text: 'Your loan application has been submitted successfully.',
            icon: 'success',
            timer: 2500,
            timerProgressBar: true,
            showConfirmButton: false,
            customClass: {
              timerProgressBar: 'green-progress-bar'
            }
          }).then(() => {
            this.router.navigate(['/user/userviewloan']);
          });
        },
        error: (err) => {
          console.error('Submission error:', err);
          Swal.fire({
            icon: 'error',
            title: 'Submission Failed',
            text: 'Please try again later.',
            confirmButtonText: 'OK',
            customClass: {
              confirmButton: 'gold-confirm'
            }
          });
          this.submitting = false;
        }
      });
    };
    reader.readAsDataURL(this.selectedFile);
  }
  goBack(): void {
    this.router.navigate(['/user/userviewloan']);
  }

  // Live validation for Farm Location (max 100 characters)
  validateFarmLocationLive(): void {
    const value = this.f.farmLocation.value;
    if (value && value.length > 100) {
      this.loanForm.patchValue({ farmLocation: value.substring(0, 100) });
      this.farmLocationError = 'Farm Location cannot exceed 100 characters';
    } else if (value && value.length > 0 && value.length < 3) {
      this.farmLocationError = 'Farm Location must be at least 3 characters';
    } else if (value && value.length >= 95) {
      this.farmLocationError = `${100 - value.length} characters remaining`;
    } else {
      this.farmLocationError = '';
    }
  }

  // Live validation for Farmer's Address (max 100 characters)
  validateFarmerAddressLive(): void {
    const value = this.f.farmerAddress.value;
    if (value && value.length > 100) {
      this.loanForm.patchValue({ farmerAddress: value.substring(0, 100) });
      this.farmerAddressError = "Farmer's Address cannot exceed 100 characters";
    } else if (value && value.length > 0 && value.length < 3) {
      this.farmerAddressError = "Farmer's Address must be at least 3 characters";
    } else if (value && value.length >= 95) {
      this.farmerAddressError = `${100 - value.length} characters remaining`;
    } else {
      this.farmerAddressError = '';
    }
  }

  // Live validation for Farm Size (min 1 acre)
  validateFarmSizeLive(): void {
    const value = this.f.farmSize.value;
    if (value !== null && value !== '') {
      if (value < 1) {
        this.farmSizeError = 'Farm Size must be at least 1 acre';
      } else {
        this.farmSizeError = '';
      }
    } else {
      this.farmSizeError = '';
    }
  }

  // Live validation for Loan Purpose (max 100 characters)
  validateLoanPurposeLive(): void {
    const value = this.f.loanPurpose.value;
    if (value && value.length > 100) {
      this.loanForm.patchValue({ loanPurpose: value.substring(0, 100) });
      this.loanPurposeError = 'Loan Purpose cannot exceed 100 characters';
    } else if (value && value.length > 0 && value.length < 3) {
      this.loanPurposeError = 'Loan Purpose must be at least 3 characters';
    } else if (value && value.length >= 95) {
      this.loanPurposeError = `${100 - value.length} characters remaining`;
    } else {
      this.loanPurposeError = '';
    }
  }

  // Prevent negative numbers from being typed
  preventNegativeNumbers(event: KeyboardEvent): void {
    const key = event.key;
    if (key === '-' || key === '+' || key === 'e' || key === 'E') {
      event.preventDefault();
    }
  }

  // Prevent tab on empty fields
  preventTabIfEmpty(event: KeyboardEvent, value: any, fieldName: string): void {
    if (event.key === 'Tab' && (!value || value.toString().trim() === '')) {
      event.preventDefault();
      Swal.fire({
        icon: 'warning',
        title: 'Field Required',
        text: `Please fill in the ${fieldName} field before proceeding.`,
        confirmButtonText: 'OK',
        customClass: {
          confirmButton: 'gold-confirm'
        }
      });
    }
  }
}