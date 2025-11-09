import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { Feedback } from '../models/feedback.model';
 
 
@Injectable({
  providedIn: 'root'
})
export class FeedbackService {
  private apiUrl = 'https://8080-decdbdbfbbdcdbdafdeaaabcfdceffaacaaae.premiumproject.examly.io'; // Adjust to your backend URL
 
  constructor(
    private http: HttpClient
   
  ) {}
  
 private getAuthHeaders(): HttpHeaders {
  const token = localStorage.getItem('token');
  return new HttpHeaders({
    Authorization: `Bearer ${token}`
  });
}

 
  // POST /api/feedback - Send feedback
  sendFeedback(feedback: Feedback): Observable<Feedback> {
    return this.http.post<Feedback>(
      `${this.apiUrl}/api/Feedback`,feedback,
      {
        headers: this.getAuthHeaders()
      }
    );
  }
 
  // GET /api/feedback/user/{userId} - Get all feedbacks by user
  getAllFeedbacksByUserId(userId: number): Observable<Feedback[]> {
    return this.http.get<Feedback[]>(
      `${this.apiUrl}/api/Feedback/${userId}`,
      {
        headers: this.getAuthHeaders()
      }
      
    );
  }
 
  // DELETE /api/feedback/{feedbackId} - Delete feedback
  deleteFeedback(feedbackId: number): Observable<void> {
    return this.http.delete<void>(
      `${this.apiUrl}/api/Feedback/${feedbackId}`,
      {
        headers: this.getAuthHeaders()
      }
     
    );
  }
 
  // GET /api/feedback - Get all feedbacks (Admin only)
  getAllFeedbacks(): Observable<Feedback[]> {
    return this.http.get<Feedback[]>(
      `${this.apiUrl}/api/Feedback`,
      {
        headers: this.getAuthHeaders()
      }
     
    );
  }
}
 
