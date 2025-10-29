
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { AdmineditloanComponent } from './admineditloan.component';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';

describe('AdmineditloanComponent', () => {
  let component: AdmineditloanComponent;
  let fixture: ComponentFixture<AdmineditloanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule , HttpClientTestingModule , FormsModule],
      declarations: [ AdmineditloanComponent ],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({ id: 123 }),
            snapshot: {
              paramMap: {
                get: () => '123',  
              },
            },
          }
        }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdmineditloanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  fit('Frontend_should_create_admineditloan_component', () => {
    expect(component).toBeTruthy();
  });

  fit('Frontend_should_contain_edit_loan_heading_in_the_admineditloan_component', () => {
    const componentHTML = fixture.debugElement.nativeElement.outerHTML;
    expect(componentHTML).toContain('Edit Loan');
  }); 



});
