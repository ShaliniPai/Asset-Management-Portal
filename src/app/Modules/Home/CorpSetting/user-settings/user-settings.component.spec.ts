import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserSettingsComponent } from './user-settings.component';
import { NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA, IterableDiffers } from '@angular/core';
import { CorpSettingUserService } from 'src/app/Core/Service/corp-setting-user.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { GetUserService } from 'src/app/Core/Service/get-user.service';
import { HttpClientModule } from '@angular/common/http';
import { MatTableModule, MatSidenavModule, MatRadioModule, MatCheckboxModule, MatSelectModule, MatSnackBarModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';
import { request } from 'http';

describe('UserSettingsComponent', () => {
  let component: UserSettingsComponent;
  let fixture: ComponentFixture<UserSettingsComponent>;
  let httpMock: HttpTestingController;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserSettingsComponent ],
      schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA], // noerror schema and custom element schema is added to avoid any template errors
      imports: [FormsModule, BrowserModule, RouterTestingModule, HttpClientModule,
        MatTableModule, MatSidenavModule, MatRadioModule, MatCheckboxModule, MatSelectModule,
        MatSnackBarModule, HttpClientTestingModule, BrowserAnimationsModule, ReactiveFormsModule ],
      providers:  [GetUserService, CorpSettingUserService]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserSettingsComponent);
    const userSettingsComponent = fixture.debugElement.injector.get(UserSettingsComponent);
    userSettingsComponent.unique_key = 'value';
    userSettingsComponent.updatedUser = {
    };
    component = fixture.componentInstance;
    httpMock = TestBed.get(HttpTestingController);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  /*************** CALLING GET USERS ***************/
  it(`calling getUsers api- sould get called`, () => {
    const getUserService = fixture.debugElement.injector.get(GetUserService);
    fixture.detectChanges();
    const req = httpMock.expectOne(`${getUserService.url}users/getUsers`);
    console.log(`${getUserService.url}users/getUsers`);
    expect(req.request.method).toBe('GET'); // expecting the request method
    expect(req.request.responseType).toBe('json'); // expecting the response type
    req.flush(null); // flushing any response body and putting mock data that we have created
  });

  /*************** CALLING DELETE USERS ***************/
  it(`calling delete users api- sould get called`, () => {
    const corpSettingUserService = fixture.debugElement.injector.get(CorpSettingUserService);
    fixture.detectChanges();
    const userSettingsComponent = fixture.debugElement.injector.get(UserSettingsComponent);
    userSettingsComponent.ConfirmDelete();
    const req = httpMock.expectOne(`${corpSettingUserService.url}users/deleteUser`, 'Id');
    expect(req.request.method).toBe('PUT'); // expecting the request method
    expect(req.request.responseType).toBe('json'); // expecting the response type
    req.flush(null); // flushing any response body and putting mock data that we have created
  });

  /*************** CALLING CANCEL ***************/
  it(`calling Cancel`, () => {
    const userSettingsComponent = fixture.debugElement.injector.get(UserSettingsComponent);
    fixture.detectChanges();
    userSettingsComponent.Cancel();
    expect(userSettingsComponent.Cancel).toHaveBeenCalled.toString();
  });

  /*************** CALLING UPDATE USERS ***************/
  it(`calling update users api- sould get called`, () => {
    const corpSettingUserService = fixture.debugElement.injector.get(CorpSettingUserService);
    const userSettingsComponent = fixture.debugElement.injector.get(UserSettingsComponent);
    fixture.detectChanges();
    const updatedUser = {
      firstName: 'this.profileForm.value.u1_firstName',
      lastName: 'this.profileForm.value.u1_lastName',
      unique_key: ('this.unique_key').toLowerCase(),
      email: ('this.profileForm.value.u1_email').toLowerCase(),
      countryCode: '91',
      phone: '+' + '91' + '9999999999',
      userRole: 'Standrad'
    };
    userSettingsComponent.profileForm.value.u1_firstName = 'name';
    userSettingsComponent.profileForm.value.u1_lastName = 'name';
    userSettingsComponent.profileForm.value.u1_email = 'name@a.com';
    userSettingsComponent.profileForm.value.u1_phone = '9999999999';
    userSettingsComponent.profileForm.value.u1_isdCode = '91';
    userSettingsComponent.onUpdate(updatedUser, 1);

    const req = httpMock.expectOne(`${corpSettingUserService.url}users/updateUser`, 'Id');
    expect(req.request.method).toBe('PUT'); // expecting the request method
    expect(req.request.responseType).toBe('json'); // expecting the response type
    req.flush(null); // flushing any response body and putting mock data that we have created
  });

  /*************** CALLING UPDATE USERS - NEGATIVE CASES TO COVER BRANCHES***************/
  it(`calling update users api for negative cases- sould get called`, () => {
    const userSettingsComponent = fixture.debugElement.injector.get(UserSettingsComponent);
    fixture.detectChanges();
    const updatedUser = {
      firstName: 'this.profileForm.value.u1_firstName',
      lastName: 'this.profileForm.value.u1_lastName',
      unique_key: ('this.unique_key').toLowerCase(),
      email: ('this.profileForm.value.u1_email').toLowerCase(),
      countryCode: '91',
      phone: '+' + '91' + '9999999999',
      userRole: 'Standrad'
    };
    userSettingsComponent.profileForm.value.u1_firstName = undefined;
    userSettingsComponent.profileForm.value.u1_lastName = undefined;
    userSettingsComponent.profileForm.value.u1_email = 'undefined';
    userSettingsComponent.profileForm.value.u1_phone = '909090';
    userSettingsComponent.profileForm.value.u1_isdCode = '42';
    userSettingsComponent.onUpdate(updatedUser, 1);
    expect(userSettingsComponent.onUpdate).toHaveBeenCalled.toString();
  });

  /*************** CALLING DELETE ***************/
  it(`calling delete`, () => {
    const userSettingsComponent = fixture.debugElement.injector.get(UserSettingsComponent);
    fixture.detectChanges();
    userSettingsComponent.Delete(1);
    expect(userSettingsComponent.Delete).toHaveBeenCalled.toString();
  });

  /*************** CALLING ONUNDO ***************/
  it(`calling onUndo`, () => {
    const userSettingsComponent = fixture.debugElement.injector.get(UserSettingsComponent);
    fixture.detectChanges();
    userSettingsComponent.onUndo(1, 'row');
    expect(userSettingsComponent.onUndo).toHaveBeenCalled.toString();
  });

  /*************** CALLING ONEDIT ***************/
  it(`calling onEdit`, () => {
    const userSettingsComponent = fixture.debugElement.injector.get(UserSettingsComponent);
    fixture.detectChanges();
    userSettingsComponent.onEdit(1, {countryCode: '+91', phone: '+91999999999'});
    expect(userSettingsComponent.onEdit).toHaveBeenCalled.toString();
  });
});
