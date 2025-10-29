import { TestBed } from '@angular/core/testing';

import { FeedbackService } from './feedback.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('FeedbackService', () => {
  let service: FeedbackService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(FeedbackService);
  });

  fit('Frontend_should_create_feedback_service', () => {
    expect(service).toBeTruthy();
  });
});
