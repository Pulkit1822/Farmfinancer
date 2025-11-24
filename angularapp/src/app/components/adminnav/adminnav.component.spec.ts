import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AdminnavComponent } from './adminnav.component';

describe('AdminnavComponent', () => {
  let component: AdminnavComponent;
  let fixture: ComponentFixture<AdminnavComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule], // import HttpClientTestingModule
      declarations: [ AdminnavComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminnavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  fit('Frontend_should_create_adminnav_component', () => {
    expect(component).toBeTruthy();
  });

});
