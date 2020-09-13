import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SitesManageComponent } from './sites-manage.component';

describe('SitesManageComponent', () => {
  let component: SitesManageComponent;
  let fixture: ComponentFixture<SitesManageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SitesManageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SitesManageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
