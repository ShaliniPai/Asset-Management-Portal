import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewAssetDetailsComponent } from './view-asset-details.component';

describe('ViewAssetDetailsComponent', () => {
  let component: ViewAssetDetailsComponent;
  let fixture: ComponentFixture<ViewAssetDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewAssetDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewAssetDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
