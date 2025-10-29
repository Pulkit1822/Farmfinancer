import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserappliedloanComponent } from './userappliedloan.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('UserappliedloanComponent', () => {
  let component: UserappliedloanComponent;
  let fixture: ComponentFixture<UserappliedloanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, RouterTestingModule, HttpClientTestingModule, FormsModule],
      declarations: [ UserappliedloanComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserappliedloanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  fit('Frontend_should_create_userappliedloan_component', () => {
    expect(component).toBeTruthy();
  });

  fit('Frontend_should_contain_applied_loans_heading_in_the_userappliedloan_component', () => {
    const componentHTML = fixture.debugElement.nativeElement.outerHTML;
    expect(componentHTML).toContain('Applied Loans');
  });
});
