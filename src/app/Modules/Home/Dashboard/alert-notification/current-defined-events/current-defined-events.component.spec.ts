import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CurrentDefinedEventsComponent } from './current-defined-events.component';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';
import { NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MatTableModule, MatSidenavModule, MatRadioModule, MatCheckboxModule, MatSelectModule, MatSnackBarModule } from '@angular/material';
import { AlertsNotifServiceComponent } from '../../../../../Core/Service/alerts-notification.service';
import { HttpTestingController,HttpClientTestingModule } from '@angular/common/http/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

var mockData=require('src/assets/json/mock.events.json');//data- mock events
var deleteEventMock=require('src/assets/json/mock.deleteEvent.json');
var createEventMock=require('src/assets/json/mock.createEvent.json');

describe('CurrentDefinedEventsComponent', () => {
  let x:any;
  let httpMock:HttpTestingController
  let component: CurrentDefinedEventsComponent;
  let fixture: ComponentFixture<CurrentDefinedEventsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CurrentDefinedEventsComponent ],
      schemas: [NO_ERRORS_SCHEMA,CUSTOM_ELEMENTS_SCHEMA],//noerror schema and custom element schema is added to avoid any template errors
      imports: [FormsModule,BrowserModule,RouterTestingModule,HttpClientModule,MatTableModule,MatSidenavModule,MatRadioModule, MatCheckboxModule, MatSelectModule, MatSnackBarModule,HttpClientTestingModule,BrowserAnimationsModule ],
      providers: [ AlertsNotifServiceComponent ]
      
    })
    
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CurrentDefinedEventsComponent);
    component = fixture.componentInstance;
    httpMock=TestBed.get(HttpTestingController);
    fixture.detectChanges();
  });

  it('should create', () => {//sample case to verify the jest functionality 
    expect(component).toBeTruthy;
  });

  it(`calling getEvents api-sould return the events object`, () => {  
    const alertsNotifServiceComponent = fixture.debugElement.injector.get(AlertsNotifServiceComponent);
    const currentDefinedEventsComponent = fixture.debugElement.injector.get(CurrentDefinedEventsComponent);
    fixture.detectChanges();
    let req=httpMock.expectOne(`${alertsNotifServiceComponent._URL}/api/alerts/getEvents`);//http mock-mocking the api call 
    expect(req.request.method).toBe('GET');//expecting the request method
    expect(req.request.responseType).toBe('json');//expecting the response type
    
    req.flush(mockData);//flushing any response body and putting mock data that we have created
  });

  it(`calling deleteEvents api-sould return the delete response object`, () => {  
    const alertsNotifServiceComponent = fixture.debugElement.injector.get(AlertsNotifServiceComponent);
    const currentDefinedEventsComponent = fixture.debugElement.injector.get(CurrentDefinedEventsComponent);
    currentDefinedEventsComponent.response=deleteEventMock;
    currentDefinedEventsComponent.response.deletedCount=1;
    currentDefinedEventsComponent.ConfirmDelete();
    fixture.detectChanges();
    let req=httpMock.expectOne(`${alertsNotifServiceComponent._URL}/api/alerts/deleteEvent`);//http mock-mocking the api call 
    expect(req.request.method).toBe('PUT');//expecting the request method
    expect(req.request.body).toBeDefined();//expecting the response type
    req.flush(deleteEventMock);//flushing any response body and putting mock data that we have created
  });

  it(`calling deleteEvents - response.deletedCount= 1`, () => {  
    const alertsNotifServiceComponent = fixture.debugElement.injector.get(AlertsNotifServiceComponent);
    const currentDefinedEventsComponent = fixture.debugElement.injector.get(CurrentDefinedEventsComponent);
    currentDefinedEventsComponent.ConfirmDelete();
    fixture.detectChanges();
    let req=httpMock.expectOne(`${alertsNotifServiceComponent._URL}/api/alerts/deleteEvent`);//http mock-mocking the api call 
    expect(req.request.method).toBe('PUT');//expecting the request method
    expect(req.request.body).toBeDefined();//expecting the response type
    req.flush(deleteEventMock);//flushing any response body and putting mock data that we have created
  });

  it(`calling delete method`, () => {  
    const alertsNotifServiceComponent = fixture.debugElement.injector.get(AlertsNotifServiceComponent);
    const currentDefinedEventsComponent = fixture.debugElement.injector.get(CurrentDefinedEventsComponent);
    currentDefinedEventsComponent.Delete('object iD');
    fixture.detectChanges();
    
    expect(currentDefinedEventsComponent.Delete).toHaveBeenCalled;//expecting the response type
  });
 
});
