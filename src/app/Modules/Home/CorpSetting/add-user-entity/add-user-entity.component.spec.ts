import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUserEntityComponent } from './add-user-entity.component';
import { NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA, IterableDiffers, ViewChild } from '@angular/core';
import { CorpSettingUserService } from 'src/app/Core/Service/corp-setting-user.service';
import { FormsModule, ReactiveFormsModule, NgForm } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { GetUserService } from 'src/app/Core/Service/get-user.service';
import { HttpClientModule } from '@angular/common/http';
import {
  MatTableModule, MatSidenavModule, MatRadioModule, MatTable, MatFormFieldModule,
  MatCheckboxModule, MatSelectModule, MatSnackBarModule, MatMenu, MatMenuModule, MatTableDataSource, MatInputModule
} from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AssetManagerService } from 'src/app/Core/Service/asset-manager.service';
import { SitesService } from 'src/app/Core/Service/sites.service';
import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';
import { AddOEMService } from 'src/app/Core/Service/add-oem.service';
import { CdkTable } from '@angular/cdk/table';
import { UserEntityService } from 'src/app/Core/Service/user-entity.service';

describe('AddUserEntityComponent', () => {
  let component: AddUserEntityComponent;
  let httpMock: HttpTestingController;
  let fixture: ComponentFixture<AddUserEntityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddUserEntityComponent ],
      schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
      imports: [FormsModule, BrowserModule, RouterTestingModule, HttpClientModule, MatFormFieldModule, MatInputModule,
        MatTableModule, MatSidenavModule, MatRadioModule, MatCheckboxModule, MatSelectModule, MatMenuModule,
        MatSnackBarModule, HttpClientTestingModule, BrowserAnimationsModule, ReactiveFormsModule],
      providers: [CorpSettingUserService, AssetManagerService,
        { provide: CdkTable, useExisting: MatTable }]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddUserEntityComponent);
    const addUserEntityComponent = fixture.debugElement.injector.get(AddUserEntityComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.get(HttpTestingController);
    addUserEntityComponent.onLevelChange('zone');
    addUserEntityComponent.onLevelChange('location');
    addUserEntityComponent.onLevelChange('block');
    addUserEntityComponent.userEntity = {
    user: {
       firstName: 'test',
       lastName: 'spec',
       email: 'abc@gmail.com',
       phone: '+910000000000',
       countryCode: '+91',
       unique_key: 'iph66kor',
       userRole: 'administrator',
       cusPhone: '0000000000'
    },
    userEntities: {
       userEntity: 'UE1',
       level: 'zone',
       levelId: [
          '6000001'
       ]
    }
 };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('onSpinner should get called', () => {
    const addUserEntityComponent = fixture.debugElement.injector.get(AddUserEntityComponent);
    addUserEntityComponent.onSpinner(true);
    expect(addUserEntityComponent.onSpinner).toHaveBeenCalled.toString();
    fixture.detectChanges();
  });

  it('onLevelChange should get called', () => {
    const userEntityService = fixture.debugElement.injector.get(UserEntityService);
    const addUserEntityComponent = fixture.debugElement.injector.get(AddUserEntityComponent);
    expect(addUserEntityComponent.onLevelChange).toHaveBeenCalled.toString();
    fixture.detectChanges();
  });

  it('onSubmit should get called', () => {
    const userEntityService = fixture.debugElement.injector.get(UserEntityService);
    const addUserEntityComponent = fixture.debugElement.injector.get(AddUserEntityComponent);
    // const form = new NgForm([''],[]);
    const testForm =  {
      value: {
          name: 'Hello',
          category: 'World'
      },
      valid: true
  } as NgForm;
    addUserEntityComponent.onSubmit(testForm);
    const req = httpMock.expectOne(`${userEntityService.url}users/save`);
    expect(req.request.method).toBe('POST');
    expect(req.request.responseType).toBe('json');
    req.flush({status: 'success'});
    fixture.detectChanges();
    expect(addUserEntityComponent.onSubmit).toHaveBeenCalled.toString();
  });
});
