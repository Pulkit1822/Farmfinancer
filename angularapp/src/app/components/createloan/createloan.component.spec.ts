import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { of, throwError } from 'rxjs';
import { CreateloanComponent } from './createloan.component';
import { LoanService } from 'src/app/services/loan.service';
import { Router } from '@angular/router';

describe('CreateLoanComponent', () => {
  let component: CreateloanComponent;
  let fixture: ComponentFixture<CreateloanComponent>;
  let loanService: jasmine.SpyObj<LoanService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(() => {
    const loanServiceSpy = jasmine.createSpyObj('LoanService', ['addLoan']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      declarations: [CreateloanComponent],
      imports: [FormsModule, RouterTestingModule],
      providers: [
        { provide: LoanService, useValue: loanServiceSpy },
        { provide: Router, useValue: routerSpy },
      ],
    });

    fixture = TestBed.createComponent(CreateloanComponent);
    component = fixture.componentInstance;
    loanService = TestBed.inject(LoanService) as jasmine.SpyObj<LoanService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  fit('Frontend_should_create_createloan_component', () => {
    expect(component).toBeTruthy();
  });

  fit('Frontend_should_contain_create_new_loan_heading_in_the_createloan_component', () => {
    const componentHTML = fixture.debugElement.nativeElement.outerHTML;
    expect(componentHTML).toContain('Create New Loan');
  });

});
