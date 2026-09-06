import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user.model';
import { AuthService } from 'src/app/services/auth.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
 
@Component({
 selector: 'app-registration',
 templateUrl: './registration.component.html',
 styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {

  siteKey: string = environment.recaptchaSiteKey || '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI';
  captchaToken: string = ''; // Recaptcha
  
    email:string;
    password:string;
    confirmPassword:string;
    username:string;
    mobile:string;
    role:string;
    showCoin: boolean = true;
    adminKey: string = '';
    
    // Password visibility toggles
    showPassword: boolean = false;
    showConfirmPassword: boolean = false;
    showAdminKey: boolean = false;
    
    // Live validation error messages
    mobileError: string = '';
    emailError: string = '';
    usernameError: string = '';
    passwordError: string = '';

    user:User={
      Email: '',
      Password: '',
      Username: '',
      MobileNumber: '',
      UserRole: ''
    };
  formSubmitted: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';

  constructor(public ser: AuthService, public rt: Router) { }
  ngOnInit(): void {
    // Coin animation runs continuously
  }
  
  onCaptchaResolved(token: string) { // Recaptcha 
    this.captchaToken = token;
    console.log('CAPTCHA token:', token);
  }

  onCaptchaError(error: any) {
    console.warn('CAPTCHA error or invalid domain encountered:', error);
    // Allow fallback token if domain restriction or Google API issue occurs
    if (!this.captchaToken) {
      this.captchaToken = 'TEST_FALLBACK_TOKEN';
    }
  }
  

  // Prevent special characters from being typed in username
  preventSpecialChars(event: KeyboardEvent) {
    const key = event.key;
    
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
    
    // Only allow letters (a-z, A-Z) and numbers (0-9)
    const isValidChar = /^[a-zA-Z0-9]$/.test(key);
    
    if (!isValidChar) {
      event.preventDefault(); // Block the key
      
      // Show error message
      this.usernameError = 'Special characters are not allowed. Only letters and numbers.';
      
      // Show SweetAlert
      Swal.fire({
        icon: 'warning',
        title: 'Invalid Character',
        text: 'Special characters are not allowed in username. Only letters and numbers are permitted.',
        timer: 2500,
        timerProgressBar: true,
        showConfirmButton: false,
        customClass: {
          timerProgressBar: 'gold-progress-bar'
        }
      });
    }
  }

  // Username validation - remove spaces and allow only alphanumeric
  onUsernameChange() {
    if (this.username) {
      // Remove any special characters that might come from paste
      const cleaned = this.username.replace(/[^a-zA-Z0-9]/g, '');
      
      if (cleaned !== this.username) {
        this.username = cleaned;
        this.usernameError = 'Special characters are not allowed. Only letters and numbers.';
      } else {
        // Live validation for length
        if (this.username.length > 0 && this.username.length < 3) {
          this.usernameError = 'Username must be at least 3 characters long.';
        } else if (this.username.length >= 3) {
          this.usernameError = '';
        }
      }
    } else {
      this.usernameError = '';
    }
  }

  // Email validation - live
  validateEmailLive() {
    if (!this.email) {
      this.emailError = '';
      return;
    }
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailPattern.test(this.email)) {
      this.emailError = 'Please enter a valid email address.';
    } else {
      this.emailError = '';
    }
  }

  // Password validation - live
  validatePasswordLive() {
    if (!this.password) {
      this.passwordError = '';
      return;
    }
    if (this.password.length < 6) {
      this.passwordError = 'Password must be at least 6 characters long.';
    } else {
      this.passwordError = '';
    }
  }

  // Phone number validation - live
  validateMobileLive() {
    if (!this.mobile) {
      this.mobileError = '';
      return;
    }
    
    // Check if contains only digits
    if (!/^\d*$/.test(this.mobile)) {
      this.mobileError = 'Mobile number must contain only digits.';
      // Remove non-digit characters
      this.mobile = this.mobile.replace(/\D/g, '');
      return;
    }
    
    // Check length
    if (this.mobile.length > 0 && this.mobile.length < 10) {
      this.mobileError = 'Mobile number must be exactly 10 digits.';
    } else if (this.mobile.length === 10) {
      // Check if starts with 6, 7, 8, or 9
      const firstDigit = this.mobile.charAt(0);
      if (!['6', '7', '8', '9'].includes(firstDigit)) {
        this.mobileError = 'Mobile number must start with 6, 7, 8, or 9.';
      } else {
        this.mobileError = '';
      }
    } else if (this.mobile.length > 10) {
      this.mobileError = 'Mobile number cannot exceed 10 digits.';
    } else {
      this.mobileError = '';
    }
  }

  // Phone number validation
  validatePhoneNumber(): boolean {
    if (!this.mobile) return false;
    
    // Check if exactly 10 digits
    if (this.mobile.length !== 10) return false;
    
    // Check if starts with 6, 7, 8, or 9
    const firstDigit = this.mobile.charAt(0);
    if (!['6', '7', '8', '9'].includes(firstDigit)) return false;
    
    // Check if all characters are digits
    if (!/^\d+$/.test(this.mobile)) return false;
    
    return true;
  }

  // Check if admin role can be selected
  canSelectAdmin(): boolean {
    return this.adminKey === 'A123';
  }
  
  // Toggle password visibility
  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
  
  // Toggle confirm password visibility
  toggleConfirmPasswordVisibility() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }
  
  // Toggle admin key visibility
  toggleAdminKeyVisibility() {
    this.showAdminKey = !this.showAdminKey;
  }
  
  // Prevent tab if field is empty
  preventTabIfEmpty(event: KeyboardEvent, value: string, fieldName: string) {
    if (!value || value.trim() === '') {
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

  // Handle role change
  onRoleChange() {
    // If user tries to select Admin without correct key, reset to empty
    if (this.role === 'Admin' && !this.canSelectAdmin()) {
      this.role = '';
      Swal.fire({
        icon: 'warning',
        title: 'Admin Key Required',
        text: 'Please enter the correct admin key to select Admin role.',
        timer: 3000,
        timerProgressBar: true,
        showConfirmButton: false,
        customClass: {
          timerProgressBar: 'gold-progress-bar'
        }
      });
    }
  }

  // Navigate to login page
  goToLogin() {
    this.rt.navigate(['/login']);
  }

  onSubmit() {
    this.formSubmitted = true;
    this.errorMessage = '';
    this.successMessage = '';

    if (!this.captchaToken) { // Recaptcha
      if (this.siteKey === '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI') {
        this.captchaToken = 'DEFAULT_TEST_CAPTCHA_TOKEN';
      } else {
        Swal.fire({
          icon: 'warning',
          title: 'CAPTCHA Required',
          text: 'Please complete the CAPTCHA verification.',
          confirmButtonText: 'OK',
          customClass: {
            confirmButton: 'gold-confirm'
          }
        });
        return;
      }
    }

    this.user.Username = this.username;
    this.user.Email = this.email;
    this.user.Password = this.password;
    this.user.MobileNumber = this.mobile;
    this.user.UserRole = this.role;

    console.log('Registration attempt with:', this.user); // Debug log

    // Validate phone number
    if (!this.validatePhoneNumber()) {
      Swal.fire({
        icon: 'error',
        title: 'Invalid Phone Number',
        text: 'Phone number must be exactly 10 digits and start with 6, 7, 8, or 9.',
        confirmButtonText: 'OK',
        customClass: {
          confirmButton: 'gold-confirm'
        }
      });
      return;
    }

    // Validate admin role selection
    if (this.role === 'Admin' && !this.canSelectAdmin()) {
      Swal.fire({
        icon: 'error',
        title: 'Invalid Admin Key',
        text: 'Please enter the correct key to register as Admin.',
        confirmButtonText: 'OK',
        customClass: {
          confirmButton: 'gold-confirm'
        }
      });
      return;
    }

    if (this.username && this.role && this.password && this.mobile && this.email) {
      const payload = { ...this.user, captchaToken: this.captchaToken }; // Recaptcha
      this.ser.register(this.user).subscribe({
        next: (res) => {
          console.log('Registration successful:', res);
          Swal.fire({
            icon: 'success',
            title: 'Registration Successful!',
            text: 'Your account has been created. Redirecting to login...',
            timer: 2000,
            timerProgressBar: true,
            showConfirmButton: false,
            customClass: {
              timerProgressBar: 'green-progress-bar'
            }
          }).then(() => {
            this.rt.navigate(['/login']);
          });
        },
        error: (err) => {
          console.error('Registration error:', err);
          const errorMsg = err.error?.Message || err.error?.message || 'Registration failed. Please try again.';
          Swal.fire({
            icon: 'error',
            title: 'Registration Failed',
            text: errorMsg,
            confirmButtonText: 'Try Again',
            customClass: {
              confirmButton: 'gold-confirm'
            }
          });
        }
      });
    } else {
      Swal.fire({
        icon: 'warning',
        title: 'Incomplete Form',
        text: 'Please fill in all required fields.',
        confirmButtonText: 'OK',
        customClass: {
          confirmButton: 'gold-confirm'
        }
      });
    }
  }
}
