import { TestBed } from '@angular/core/testing';

import { MagicEffectsService } from './magic-effects.service';

describe('MagicEffectsService', () => {
  let service: MagicEffectsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MagicEffectsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
