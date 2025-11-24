import { Component, OnInit } from '@angular/core';
import { FeedbackService } from 'src/app/services/feedback.service';
import { Feedback } from 'src/app/models/feedback.model';

@Component({
  selector: 'app-adminviewfeedback',
  templateUrl: './adminviewfeedback.component.html',
  styleUrls: ['./adminviewfeedback.component.css']
})
export class AdminviewfeedbackComponent implements OnInit {
  feedbackList: Feedback[] = [];
  paginatedFeedbackList: Feedback[] = [];
  selectedFeedbackUser: Feedback | null = null;
  showModal = false;
  noData = false;
  errorMessage = '';

  currentPage = 1;
  itemsPerPage = 10;
  totalPages = 0;

  constructor(private feedbackService: FeedbackService) {}

  ngOnInit(): void {
    this.loadFeedbacks();
  }

  loadFeedbacks(): void {
    this.feedbackService.getAllFeedbacks().subscribe({
      next: (data) => {
        this.feedbackList = data;
        this.noData = data.length === 0;
        this.goToPage(1);
      },
      error: (error) => {
        console.error('Error fetching feedbacks', error);
        this.errorMessage = 'Could not load feedback data. Please try again later.';
        this.feedbackList = [];
        this.noData = true;
      }
    });
  }

  openProfile(feedback: Feedback): void {
    this.selectedFeedbackUser = feedback;
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    setTimeout(() => {
      this.selectedFeedbackUser = null;
    }, 300);
  }

  updatePaginatedFeedbacks(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedFeedbackList = this.feedbackList.slice(startIndex, endIndex);
  }

  goToPage(page: number): void {
    if (page < 1) page = 1;
    this.totalPages = Math.ceil(this.feedbackList.length / this.itemsPerPage);
    if (page > this.totalPages && this.totalPages > 0) page = this.totalPages;
    this.currentPage = page;
    this.updatePaginatedFeedbacks();
  }

  goToPreviousPage(): void {
    if (this.currentPage > 1) {
      this.goToPage(this.currentPage - 1);
    }
  }

  goToNextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.goToPage(this.currentPage + 1);
    }
  }

  get pages(): number[] {
    if (this.totalPages <= 0) return [];
    return Array(this.totalPages).fill(0).map((_, i) => i + 1);
  }
}