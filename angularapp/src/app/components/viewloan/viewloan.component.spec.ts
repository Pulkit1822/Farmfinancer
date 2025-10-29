import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ViewloanComponent } from './viewloan.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('ViewloanComponent', () => {
  let component: ViewloanComponent;
  let fixture: ComponentFixture<ViewloanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, RouterTestingModule, HttpClientTestingModule, FormsModule],
      declarations: [ ViewloanComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewloanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  fit('Frontend_should_create_viewloan_component', () => {
    expect(component).toBeTruthy();
  });

  fit('Frontend_should_contain_Loans_Details_heading_in_the_viewloan_component', () => {
    const componentHTML = fixture.debugElement.nativeElement.outerHTML;
    expect(componentHTML).toContain('Loan Details');
  });
});
