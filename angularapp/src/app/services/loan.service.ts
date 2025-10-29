import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Loan } from '../models/loan.model';
import { LoanApplication } from '../models/loanapplication.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LoanService {
 public apiUrl=environment.apiUrl;
  constructor(public http:HttpClient) { }
  
 private getAuthHeaders(): HttpHeaders {
  const token = localStorage.getItem('jwtToken');
  return new HttpHeaders({
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json'

  });
}

getAllLoans(): Observable<Loan[]> {
  return this.http.get<Loan[]>(`${this.apiUrl}/api/Loan`, 
  {
    headers: this.getAuthHeaders()
  });
}
deleteLoan(loanId:number):Observable<void>{
  return this.http.delete<void>(`${this.apiUrl}/api/Loan/${loanId}`,
  {
    headers: this.getAuthHeaders(),
    responseType: 'text' as 'json'
  });
}
getLoanById(id:number):Observable<Loan>{
  return this.http.get<Loan>(`${this.apiUrl}/api/Loan/${id}`,
  {
    headers: this.getAuthHeaders()
  });
}
addLoan(requestObject:Loan):Observable<Loan>{
  return this.http.post<Loan>(`${this.apiUrl}/api/Loan`,requestObject,
  {
    headers: this.getAuthHeaders(),
    responseType: 'text' as 'json'
  });
}
updateLoan(id:number,requestObject:Loan):Observable<Loan>{
  return this.http.put<Loan>(`${this.apiUrl}/api/Loan/${id}`,requestObject,
  {
    headers: this.getAuthHeaders(),
    responseType: 'text' as 'json'
  });
}
getAppliedLoans(userId:number): Observable<LoanApplication[]> {
  return this.http.get<LoanApplication[]>(`${this.apiUrl}/api/LoanApplication/user/${userId}`, 
  {
    headers: this.getAuthHeaders()
  });
}
deleteLoanApplication(loanId:number):Observable<void>{
  return this.http.delete<void>(`${this.apiUrl}/api/LoanApplication/${loanId}`,
  {
    headers: this.getAuthHeaders(),
    responseType: 'text' as 'json'
  });
}

addLoanApplication(data:LoanApplication):Observable<LoanApplication>{
  return this.http.post<LoanApplication>(`${this.apiUrl}/api/LoanApplication`,data,
  {
    headers: this.getAuthHeaders(),
    responseType: 'text' as 'json'
  });
}
getAllLoanApplications(): Observable<LoanApplication[]> {
  return this.http.get<LoanApplication[]>(`${this.apiUrl}/api/LoanApplication`, 
  {
    headers: this.getAuthHeaders()
  });
}
updateLoanStatus(id:number,loanApplication:LoanApplication):Observable<LoanApplication>{
  return this.http.put<LoanApplication>(`${this.apiUrl}/api/LoanApplication/${id}`,loanApplication,
  {
    headers: this.getAuthHeaders()
  });
}




}
