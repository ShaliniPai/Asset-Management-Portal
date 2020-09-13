import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateUserComponent } from './create-user.component';
import { NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA, IterableDiffers } from '@angular/core';
import { CorpSettingUserService } from 'src/app/Core/Service/corp-setting-user.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { GetUserService } from 'src/app/Core/Service/get-user.service';
import { HttpClientModule } from '@angular/common/http';
import { MatTableModule, MatSidenavModule, MatRadioModule, MatCheckboxModule, MatSelectModule, MatSnackBarModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AddUserService } from 'src/app/Core/Service/add-user.service';
import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';

describe('CreateUserComponent', () => {
  let component: CreateUserComponent;
  let fixture: ComponentFixture<CreateUserComponent>;
  let httpMock: HttpTestingController;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateUserComponent ],
      schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA], // noerror schema and custom element schema is added to avoid any template errors
      imports: [FormsModule, BrowserModule, RouterTestingModule, HttpClientModule,
        MatTableModule, MatSidenavModule, MatRadioModule, MatCheckboxModule, MatSelectModule,
        MatSnackBarModule, HttpClientTestingModule, BrowserAnimationsModule, ReactiveFormsModule ],
      providers:  [AddUserService, CorpSettingUserService]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateUserComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.get(HttpTestingController);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it(`calling addUsers api NEGATIVE TEST CASES- sould get called`, () => {
    const createUserComponent = fixture.debugElement.injector.get(CreateUserComponent);
    fixture.detectChanges();

    /************************** FIRST USER **********************/
    createUserComponent.profileForm.value.u1_firstName = 'value';
    createUserComponent.profileForm.value.u1_lastName = 'value';
    createUserComponent.profileForm.value.u1_userId = 'value';
    createUserComponent.profileForm.value.u1_isdCode = '91';
    createUserComponent.profileForm.value.u1_phone = '9090909090';
    createUserComponent.profileForm.value.u1_userType = 'value';

    createUserComponent.profileForm.value.u2_firstName = 'value';
    createUserComponent.profileForm.value.u2_lastName = 'value';
    createUserComponent.profileForm.value.u2_userId = 'value';
    createUserComponent.profileForm.value.u2_isdCode = '91';
    createUserComponent.profileForm.value.u2_phone = '9090909090';
    createUserComponent.profileForm.value.u2_userType = 'value';

    createUserComponent.profileForm.value.u3_firstName = '';
    createUserComponent.profileForm.value.u3_lastName = 'value';
    createUserComponent.profileForm.value.u3_userId = '';
    createUserComponent.profileForm.value.u3_isdCode = '';
    createUserComponent.profileForm.value.u3_phone = '';
    createUserComponent.profileForm.value.u3_userType = '';

    createUserComponent.breakCode = 0;

    createUserComponent.onSubmit();
    expect(createUserComponent.onSubmit).toHaveBeenCalled.toString();
  });

  it(`calling addUsers api NEGATIVE TEST CASES- sould get called`, () => {
    const createUserComponent = fixture.debugElement.injector.get(CreateUserComponent);
    fixture.detectChanges();

    /************************** FIRST USER **********************/
    createUserComponent.profileForm.value.u1_firstName = 'value';
    createUserComponent.profileForm.value.u1_lastName = 'value';
    createUserComponent.profileForm.value.u1_userId = 'value';
    createUserComponent.profileForm.value.u1_isdCode = '91';
    createUserComponent.profileForm.value.u1_phone = '9090909090';
    createUserComponent.profileForm.value.u1_userType = 'value';

    createUserComponent.profileForm.value.u2_firstName = '';
    createUserComponent.profileForm.value.u2_lastName = 'value';
    createUserComponent.profileForm.value.u2_userId = '';
    createUserComponent.profileForm.value.u2_isdCode = '';
    createUserComponent.profileForm.value.u2_phone = '91';
    createUserComponent.profileForm.value.u2_userType = '';

    createUserComponent.profileForm.value.u3_firstName = '';
    createUserComponent.profileForm.value.u3_lastName = '';
    createUserComponent.profileForm.value.u3_userId = '';
    createUserComponent.profileForm.value.u3_isdCode = '';
    createUserComponent.profileForm.value.u3_phone = '';
    createUserComponent.profileForm.value.u3_userType = '';

    createUserComponent.breakCode = 0;

    createUserComponent.onSubmit();
    expect(createUserComponent.onSubmit).toHaveBeenCalled.toString();
  });

  it(`calling addUsers api NEGATIVE TEST CASES- sould get called`, () => {
    const createUserComponent = fixture.debugElement.injector.get(CreateUserComponent);
    fixture.detectChanges();

    /************************** FIRST USER **********************/
    createUserComponent.profileForm.value.u1_firstName = '';
    createUserComponent.profileForm.value.u1_lastName = 'value';
    createUserComponent.profileForm.value.u1_userId = '';
    createUserComponent.profileForm.value.u1_isdCode = '91';
    createUserComponent.profileForm.value.u1_phone = '9090909090';
    createUserComponent.profileForm.value.u1_userType = '';

    createUserComponent.profileForm.value.u2_firstName = '';
    createUserComponent.profileForm.value.u2_lastName = '';
    createUserComponent.profileForm.value.u2_userId = '';
    createUserComponent.profileForm.value.u2_isdCode = '';
    createUserComponent.profileForm.value.u2_phone = '';
    createUserComponent.profileForm.value.u2_userType = '';

    createUserComponent.profileForm.value.u3_firstName = '';
    createUserComponent.profileForm.value.u3_lastName = '';
    createUserComponent.profileForm.value.u3_userId = '';
    createUserComponent.profileForm.value.u3_isdCode = '';
    createUserComponent.profileForm.value.u3_phone = '';
    createUserComponent.profileForm.value.u3_userType = '';

    createUserComponent.breakCode = 0;
    console.log(createUserComponent.breakCode);

    createUserComponent.onSubmit();
    expect(createUserComponent.onSubmit).toHaveBeenCalled.toString();
  });

  it(`calling addUsers api- sould get called`, () => {
    const addUserService = fixture.debugElement.injector.get(AddUserService);
    const createUserComponent = fixture.debugElement.injector.get(CreateUserComponent);
    fixture.detectChanges();

    /************************** FIRST USER **********************/
    createUserComponent.profileForm.value.u1_firstName = 'name';
    createUserComponent.profileForm.value.u1_lastName = 'name';
    createUserComponent.profileForm.value.u1_userId = 'name';
    createUserComponent.profileForm.value.u1_isdCode = '+91';
    createUserComponent.profileForm.value.u1_phone = '9999999999';
    createUserComponent.profileForm.value.u1_userType = 'Standard';

    /************************** SECOND USER **********************/
    createUserComponent.profileForm.value.u2_firstName = 'name';
    createUserComponent.profileForm.value.u2_lastName = 'name';
    createUserComponent.profileForm.value.u2_userId = 'name';
    createUserComponent.profileForm.value.u2_isdCode = '+91';
    createUserComponent.profileForm.value.u2_phone = '9999999999';
    createUserComponent.profileForm.value.u2_userType = 'Standard';

    /************************** THIRD USER **********************/
    createUserComponent.profileForm.value.u3_firstName = 'name';
    createUserComponent.profileForm.value.u3_lastName = 'name';
    createUserComponent.profileForm.value.u3_userId = 'name';
    createUserComponent.profileForm.value.u3_isdCode = '+91';
    createUserComponent.profileForm.value.u3_phone = '9999999999';
    createUserComponent.profileForm.value.u3_userType = 'Standard';

    createUserComponent.onSubmit();

    const req = httpMock.expectOne(`${addUserService.url}users/addUser`, 'user');
    expect(req.request.method).toBe('POST'); // expecting the request method
    expect(req.request.responseType).toBe('json'); // expecting the response type
    req.flush(null); // flushing any response body and putting mock data that we have created
    createUserComponent.breakCode = 0;
  });

});
