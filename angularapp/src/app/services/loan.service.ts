import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Loan } from '../models/loan.model';
import { LoanApplication } from '../models/loanapplication.model';

@Injectable({
  providedIn: 'root'
})
export class LoanService {
 public apiUrl='https://8080-decdbdbfbbdcdbdafdeaaabcfdceffaacaaae.premiumproject.examly.io'
  constructor(public http:HttpClient) { }
  
 private getAuthHeaders(): HttpHeaders {
  const token = localStorage.getItem('token');
  return new HttpHeaders({
    Authorization: `Bearer ${token}`
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
    headers: this.getAuthHeaders()
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
    headers: this.getAuthHeaders()
  });
}
updateLoan(id:number,requestObject:Loan):Observable<Loan>{
  return this.http.put<Loan>(`${this.apiUrl}/api/Loan/${id}`,requestObject,
  {
    headers: this.getAuthHeaders()
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
    headers: this.getAuthHeaders()
  });
}

addLoanApplication(data:LoanApplication):Observable<LoanApplication>{
  return this.http.post<LoanApplication>(`${this.apiUrl}/api/LoanApplication`,data,
  {
    headers: this.getAuthHeaders()
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
