import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubBookComponent } from './sub-book.component';

describe('SubBookComponent', () => {
  let component: SubBookComponent;
  let fixture: ComponentFixture<SubBookComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubBookComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SubBookComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
