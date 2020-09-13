import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RadioTreeComponent } from './radio-tree.component';

describe('RadioTreeComponent', () => {
  let component: RadioTreeComponent;
  let fixture: ComponentFixture<RadioTreeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RadioTreeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RadioTreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
