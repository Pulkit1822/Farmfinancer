
import { TestBed } from '@angular/core/testing';

import { LoanService } from './loan.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('LoanService', () => {
  let service: LoanService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(LoanService);
  });

  fit('Frontend_should_create_loan_service', () => {
    expect(service).toBeTruthy();
  });
});
