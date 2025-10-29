import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserviewloanComponent } from './userviewloan.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('UserviewloanComponent', () => {
  let component: UserviewloanComponent;
  let fixture: ComponentFixture<UserviewloanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, RouterTestingModule, HttpClientTestingModule, FormsModule],
      declarations: [ UserviewloanComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserviewloanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  fit('Frontend_should_create_userviewloan_component', () => {
    expect(component).toBeTruthy();
  });

  fit('Frontend_should_contain_available_loans_heading_in_the_userviewloan_component', () => {
    const componentHTML = fixture.debugElement.nativeElement.outerHTML;
    expect(componentHTML).toContain('Available Loans');
  });
});
