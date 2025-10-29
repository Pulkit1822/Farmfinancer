import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { Login } from 'src/app/models/login.model';
import Swal from 'sweetalert2';
 
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email:string;
  password:string;
  showCoin: boolean = true;
  
  // Password visibility toggle
  showPassword: boolean = false;
  
  // Live validation error messages
  emailError: string = '';
  passwordError: string = '';
 
  loginData: Login = {
    Email: '',
    Password: ''
  };

  errorMessage: string = '';
  formSubmitted: boolean = false;

  constructor(private authService: AuthService, private router: Router) {}

  // Email validation - live
  validateEmailLive() {
    if (!this.loginData.Email) {
      this.emailError = '';
      return;
    }
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailPattern.test(this.loginData.Email)) {
      this.emailError = 'Please enter a valid email address.';
    } else {
      this.emailError = '';
    }
  }

  // Password validation - live
  validatePasswordLive() {
    if (!this.loginData.Password) {
      this.passwordError = '';
      return;
    }
    if (this.loginData.Password.length < 6) {
      this.passwordError = 'Password must be at least 6 characters long.';
    } else {
      this.passwordError = '';
    }
  }

  // Toggle password visibility
  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
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

  // Navigate to register page
  goToRegister() {
    this.router.navigate(['/registration']);
  }

  onSubmit(): void {
    this.formSubmitted = true;
    this.errorMessage = '';
    
    console.log('Login attempt with:', this.loginData);
    
    if (this.loginData.Email && this.loginData.Password) {
      this.authService.login(this.loginData).subscribe({
        next: (response) => {
          console.log('Full Login response:', response);
          console.log('response.User:', response.User);
          console.log('response.token:', response.token);
          
          const role = response.User ? response.User.UserRole : null;
          console.log('Extracted role:', role);
          
          localStorage.setItem('userRole', role);

          // Show success message
          Swal.fire({
            icon: 'success',
            title: 'Login Successful!',
            text: `Welcome back, ${response.User?.Username || 'User'}!`,
            timer: 1500,
            timerProgressBar: true,
            showConfirmButton: false,
            customClass: {
              timerProgressBar: 'green-progress-bar'
            }
          }).then(() => {
            if (role === 'Admin') {
              console.log('Navigating to admin dashboard');
              this.router.navigate(['/admin']);
            } else if (role === 'User') {
              console.log('Navigating to user dashboard');
              this.router.navigate(['/user']);
            } else {
              console.error('Role is undefined or invalid:', role);
              Swal.fire({
                icon: 'error',
                title: 'Unknown Role',
                text: 'Unable to determine user role.',
                confirmButtonText: 'OK',
                customClass: {
                  confirmButton: 'gold-confirm'
                }
              });
            }
          });
        },
        error: (err) => {
          console.error('Login error:', err);
          console.error('Error details:', err.error);
          const errorMsg = err.error?.Message || err.error?.message || 'Invalid email or password.';
          
          Swal.fire({
            icon: 'error',
            title: 'Login Failed',
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
        title: 'Missing Information',
        text: 'Please enter both email and password.',
        confirmButtonText: 'OK',
        customClass: {
          confirmButton: 'gold-confirm'
        }
      });
    }
  }
}