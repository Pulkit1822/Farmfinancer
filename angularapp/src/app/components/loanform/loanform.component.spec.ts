import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoanformComponent } from './loanform.component';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('LoanformComponent', () => {
  let component: LoanformComponent;
  let fixture: ComponentFixture<LoanformComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, RouterTestingModule , HttpClientTestingModule],
      declarations: [ LoanformComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoanformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  fit('Frontend_should_create_loanform_component', () => {
    expect(component).toBeTruthy();
  });

  fit('Frontend_should_contain_loan_application_form_heading_in_the_loanform_component', () => {
    const componentHTML = fixture.debugElement.nativeElement.outerHTML;
    expect(componentHTML).toContain('Loan Application Form');
  });
});
