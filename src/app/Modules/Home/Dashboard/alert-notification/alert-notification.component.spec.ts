import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AlertNotificationComponent } from './alert-notification.component';
import { NotificationsReceivedComponent } from './notifications-received/notifications-received.component';
import { NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';
import { MatTableModule, MatSidenavModule, MatRadioModule, MatCheckboxModule, MatSelectModule, MatSnackBarModule } from '@angular/material';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AlertsNotifServiceComponent } from 'src/app/Core/Service/alerts-notification.service';

describe('AlertNotificationComponent', () => {
  let component: AlertNotificationComponent;
  let fixture: ComponentFixture<AlertNotificationComponent>;
  let httpMock:HttpTestingController;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NotificationsReceivedComponent ],
      schemas: [NO_ERRORS_SCHEMA,CUSTOM_ELEMENTS_SCHEMA],//noerror schema and custom element schema is added to avoid any template errors
      imports: [FormsModule,BrowserAnimationsModule,ReactiveFormsModule,BrowserModule,RouterTestingModule,HttpClientModule,MatTableModule,MatSidenavModule,MatRadioModule, MatCheckboxModule, MatSelectModule, MatSnackBarModule,HttpClientTestingModule ],
      providers: [ AlertsNotifServiceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotificationsReceivedComponent);
    component = fixture.componentInstance;
    httpMock=TestBed.get(HttpTestingController);
    fixture.detectChanges();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
