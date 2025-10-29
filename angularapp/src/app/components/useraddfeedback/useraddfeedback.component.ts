import { Component, OnInit } from '@angular/core';
import { FeedbackService } from 'src/app/services/feedback.service';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { Feedback } from 'src/app/models/feedback.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-user-add-feedback',
  templateUrl: './useraddfeedback.component.html',
  styleUrls: ['./useraddfeedback.component.css']
})
export class UseraddfeedbackComponent implements OnInit {
  userId: number = 0;
  feedbackText: string = '';
  submitted: boolean = false;
  showValidationError: boolean = false;

  constructor(
    private feedbackService: FeedbackService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const user = this.authService.currentUserValue;
    if (user && user.UserId) {
      this.userId = user.UserId;
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'User not logged in.',
        confirmButtonText: 'Go to Login',
        customClass: {
          confirmButton: 'gold-confirm'
        }
      });
      this.router.navigate(['/login']);
    }
  }

  onSubmit(): void {
    this.submitted = true;

    // Trim the feedback text
    const trimmedFeedback = this.feedbackText.trim();

    // Validate length (minimum 10, maximum 100 characters)
    if (trimmedFeedback.length < 10) {
      this.showValidationError = true;
      Swal.fire({
        title: 'Feedback Too Short',
        text: 'Feedback must be at least 10 characters long.',
        icon: 'error',
        confirmButtonColor: '#d4af37',
        allowOutsideClick: false
      });
      return;
    }

    if (trimmedFeedback.length > 100) {
      this.showValidationError = true;
      Swal.fire({
        title: 'Feedback Too Long',
        text: 'Feedback must not exceed 100 characters.',
        icon: 'error',
        confirmButtonColor: '#d4af37',
        allowOutsideClick: false
      });
      return;
    }

    // Validate content (only letters, numbers, and spaces)
    const isValidFeedback = /^[a-zA-Z0-9\s]+$/.test(trimmedFeedback);

    if (!isValidFeedback) {
      this.showValidationError = true;
      Swal.fire({
        title: 'Invalid Feedback',
        text: 'Feedback must contain only letters, numbers, and spaces.',
        icon: 'error',
        confirmButtonColor: '#d4af37',
        allowOutsideClick: false
      });
      return;
    }

    const feedback: Feedback = {
      UserId: this.userId,
      FeedbackText: trimmedFeedback,
      Date: new Date()
    };

    this.feedbackService.sendFeedback(feedback).subscribe({
      next: () => {
        Swal.fire({
          title: 'Feedback Submitted!',
          text: 'Thank you for your feedback.',
          icon: 'success',
          timer: 2500,
          timerProgressBar: true,
          showConfirmButton: false,
          customClass: {
            timerProgressBar: 'green-progress-bar'
          }
        }).then(() => {
          this.router.navigate(['/user/userviewfeedback']);
        });
      },
      error: (err) => {
        console.error('Error submitting feedback:', err);
        Swal.fire({
          title: 'Submission Failed',
          text: 'Failed to submit feedback. Please try again.',
          icon: 'error',
          confirmButtonText: 'OK',
          customClass: {
            confirmButton: 'gold-confirm'
          }
        });
      }
    });

    this.showValidationError = false;
    this.feedbackText = '';
    this.submitted = false;
  }
}