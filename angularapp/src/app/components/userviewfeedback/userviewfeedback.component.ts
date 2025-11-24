import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FeedbackService } from 'src/app/services/feedback.service';
import { AuthService } from 'src/app/services/auth.service';
import { Feedback } from 'src/app/models/feedback.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-user-view-feedback',
  templateUrl: './userviewfeedback.component.html',
  styleUrls: ['./userviewfeedback.component.css']
})
export class UserviewfeedbackComponent implements OnInit, OnDestroy {
  feedbacks: Feedback[] = [];
  isLoading = true;
  searchText: string = '';
  private userId: number = 0;
  private destroy$ = new Subject<void>();

  constructor(
    private feedbackService: FeedbackService,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const user = this.authService.currentUserValue;
    if (user && user.UserId) {
      this.userId = user.UserId;
      this.loadFeedbacks();
    } else {
      Swal.fire({
        icon: 'warning',
        title: 'Unauthorized',
        text: 'Please login to view your feedbacks.',
        confirmButtonText: 'Go to Login',
        customClass: {
          confirmButton: 'gold-confirm'
        }
      });
      this.router.navigate(['/login']);
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadFeedbacks(): void {
    this.isLoading = true;
    
    // Show loading animation for at least 2.5 seconds
    const minLoadingTime = new Promise(resolve => setTimeout(resolve, 2500));
    
    const dataLoaded = this.feedbackService.getAllFeedbacksByUserId(this.userId).pipe(
      takeUntil(this.destroy$)
    ).toPromise();
    
    Promise.all([minLoadingTime, dataLoaded]).then(([_, response]) => {
      this.feedbacks = response || [];
      this.isLoading = false;
    }).catch((err) => {
      console.error('Error fetching feedbacks:', err);
      this.isLoading = false;
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to load feedbacks.',
        confirmButtonText: 'OK',
        customClass: {
          confirmButton: 'gold-confirm'
        }
      });
    });
  }

  showDeleteConfirmation(feedbackId: number): void {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this action!",
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
        this.deleteFeedback(feedbackId);
      }
    });
  }

  private deleteFeedback(feedbackId: number): void {
    this.feedbackService.deleteFeedback(feedbackId).subscribe({
      next: () => {
        this.feedbacks = this.feedbacks.filter(f => f.FeedbackId !== feedbackId);
        Swal.fire({
          icon: 'success',
          title: 'Deleted!',
          text: 'Your feedback has been successfully deleted.',
          timer: 2500,
          timerProgressBar: true,
          showConfirmButton: false,
          customClass: {
            timerProgressBar: 'green-progress-bar'
          }
        });
      },
      error: (err) => {
        console.error('Error deleting feedback:', err);
        Swal.fire({
          icon: 'error',
          title: 'Error!',
          text: 'Could not delete the feedback. Please try again.',
          confirmButtonText: 'OK',
          customClass: {
            confirmButton: 'gold-confirm'
          }
        });
      }
    });
  }

  goToPostFeedback(): void {
    this.router.navigate(['/user/useraddfeedback']);
  }
}