import { LoanStatusPipe } from './loan-status.pipe';

describe('LoanStatusPipe', () => {
  it('create an instance', () => {
    const pipe = new LoanStatusPipe();
    expect(pipe).toBeTruthy();
  });
});
