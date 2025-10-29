import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RequestedloanComponent } from './requestedloan.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('RequestedloanComponent', () => {
  let component: RequestedloanComponent;
  let fixture: ComponentFixture<RequestedloanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, RouterTestingModule, HttpClientTestingModule, FormsModule],
      declarations: [ RequestedloanComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestedloanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  fit('Frontend_should_create_requestedloan_component', () => {
    expect(component).toBeTruthy();
  });

  fit('Frontend_should_contain_loan_requests_for_approval_heading_in_the_requestedloan_component', () => {
    const componentHTML = fixture.debugElement.nativeElement.outerHTML;
    expect(componentHTML).toContain('Loan Requests for Approval');
  });
});
