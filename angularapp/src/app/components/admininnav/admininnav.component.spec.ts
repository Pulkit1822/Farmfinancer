import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdmininnavComponent } from './admininnav.component';

describe('AdmininnavComponent', () => {
  let component: AdmininnavComponent;
  let fixture: ComponentFixture<AdmininnavComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdmininnavComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdmininnavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
