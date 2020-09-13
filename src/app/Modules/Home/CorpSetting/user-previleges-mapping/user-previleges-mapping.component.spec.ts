import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserPrevilegesMappingComponent } from './user-previleges-mapping.component';
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
import {UserMappingService} from 'src/app/Core/Service/user-mapping.service';

describe('UserPrevilegesMappingComponent', () => {
  let component: UserPrevilegesMappingComponent;
  let httpMock: HttpTestingController;
  let fixture: ComponentFixture<UserPrevilegesMappingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserPrevilegesMappingComponent ],
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
    fixture = TestBed.createComponent(UserPrevilegesMappingComponent);
    const userPrevilegesMappingComponent = fixture.debugElement.injector.get(UserPrevilegesMappingComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.get(HttpTestingController);
    const userMappingService = fixture.debugElement.injector.get(UserMappingService);
    localStorage.setItem('upUserLevel', 'tenant');
    localStorage.setItem('upUserLevel', 'block');
    fixture.detectChanges();

  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });


  it('onSpinner should get called', () => {
    const userPrevilegesMappingComponent = fixture.debugElement.injector.get(UserPrevilegesMappingComponent);
    userPrevilegesMappingComponent.onSpinner(true);
    expect(userPrevilegesMappingComponent.onSpinner).toHaveBeenCalled.toString();
    fixture.detectChanges();
  });

  it('dataParser should get called - tenant', () => {
    const userPrevilegesMappingComponent = fixture.debugElement.injector.get(UserPrevilegesMappingComponent);
    localStorage.setItem('upUserLevel', 'tenant');
    userPrevilegesMappingComponent.previlages = ['Administrative', 'Gatekeeping', 'Standard', 'Installation'];
    const UserMappingData =  {
      custom: {
        superAdmin: ['Administrative', 'Gatekeeping'],
        standard: ['Standard'],
        administrator: []
      }
  };
    userPrevilegesMappingComponent.dataParser(UserMappingData.custom);
    fixture.detectChanges();
    expect(userPrevilegesMappingComponent.dataParser).toHaveBeenCalled.toString();
  });

  it('dataParser should get called - non-tenant', () => {
    const userPrevilegesMappingComponent = fixture.debugElement.injector.get(UserPrevilegesMappingComponent);
    localStorage.setItem('upUserLevel', 'zone');
    userPrevilegesMappingComponent.previlages = ['Administrative', 'Gatekeeping', 'Standard', 'Installation'];
    const UserMappingData =  {
      custom: {
        superAdmin: ['Administrative', 'Gatekeeping'],
        standard: ['Standard'],
        administrator: []
      }
  };
    userPrevilegesMappingComponent.dataParser(UserMappingData.custom);
    fixture.detectChanges();
    expect(userPrevilegesMappingComponent.dataParser).toHaveBeenCalled.toString();
  });

  it('dataParser should get called - without any upUserlevel', () => {
    const userPrevilegesMappingComponent = fixture.debugElement.injector.get(UserPrevilegesMappingComponent);
    localStorage.setItem('upUserLevel', 'zone');
    userPrevilegesMappingComponent.previlages = ['Administrative', 'Gatekeeping', 'Standard', 'Installation'];
    userPrevilegesMappingComponent.nonTenantUserType = ['1', '2'];
    const UserMappingData =  {
      custom: {
        superAdmin: ['Administrative', 'Gatekeeping'],
        standard: ['Standard'],
        administrator: []
      }
  };
    userPrevilegesMappingComponent.dataParser(UserMappingData.custom);
    fixture.detectChanges();
    expect(userPrevilegesMappingComponent.dataParser).toHaveBeenCalled.toString();
  });

  it('getUserPrevilageMapping should get called-- tenant', () => {
    const userMappingService = fixture.debugElement.injector.get(UserMappingService);
    localStorage.setItem('upUserLevel', 'tenant');
    const userPrevilegesMappingComponent = fixture.debugElement.injector.get(UserPrevilegesMappingComponent);
    fixture.detectChanges();
    const req = httpMock.expectOne(`${userMappingService.url}userMapping/get`);
    expect(req.request.method).toBe('GET');
    expect(req.request.responseType).toBe('json');
    req.flush({tenantUsers: {
      custom: {
        superAdmin: ['Administrative', 'Gatekeeping'],
        standard: ['Standard'],
        administrator: []
      }}});
    expect(userPrevilegesMappingComponent.getUserPrevilageMapping).toHaveBeenCalled.toString();
    localStorage.clear();
  });

  it('getUserPrevilageMapping should get called-- non-tenant', () => {
    localStorage.clear();
    const userMappingService = fixture.debugElement.injector.get(UserMappingService);
    localStorage.setItem('upUserLevel', 'block');
    const userPrevilegesMappingComponent = fixture.debugElement.injector.get(UserPrevilegesMappingComponent);
    fixture.detectChanges();
    const req = httpMock.expectOne(`${userMappingService.url}userMapping/get`);
    expect(req.request.method).toBe('GET');
    expect(req.request.responseType).toBe('json');
    req.flush({nonTenantUsers: {
      custom: {
        superAdmin: ['Administrative', 'Gatekeeping'],
        standard: ['Standard'],
        administrator: []
      }}});
    expect(userPrevilegesMappingComponent.getUserPrevilageMapping).toHaveBeenCalled.toString();
  });

  it('addUserPrevilages should get called-- tenant', () => {
    const userMappingService = fixture.debugElement.injector.get(UserMappingService);
    localStorage.setItem('upUserLevel', 'tenant');
    const userPrevilegesMappingComponent = fixture.debugElement.injector.get(UserPrevilegesMappingComponent);
    const userPrevilageMapping = ({
      userMapType: '',
      data: {
        custom: {
          superAdmin: [],
          standard: [],
          administrator: []
        }
      }
    });
    userPrevilegesMappingComponent.addUserPrevilages();
    fixture.detectChanges();
    const req = httpMock.expectOne(`${userMappingService.url}userMapping/save`);
    expect(req.request.method).toBe('POST');
    expect(req.request.responseType).toBe('json');
    req.flush({tenantUsers: {
      custom: {
        superAdmin: ['Administrative', 'Gatekeeping'],
        standard: ['Standard'],
        administrator: []
      }}});
    expect(userPrevilegesMappingComponent.getUserPrevilageMapping).toHaveBeenCalled.toString();
    localStorage.clear();
  });

  it('addUserPrevilages should get called-- non-tenant', () => {
    localStorage.clear();
    const userMappingService = fixture.debugElement.injector.get(UserMappingService);
    localStorage.setItem('upUserLevel', 'block');
    const userPrevilegesMappingComponent = fixture.debugElement.injector.get(UserPrevilegesMappingComponent);
    const userPrevilageMapping = ({
      userMapType: '',
      data: {
        custom: {
          superAdmin: [],
          standard: [],
          administrator: []
        }
      }
    });
    userPrevilegesMappingComponent.addUserPrevilages();
    fixture.detectChanges();
    const req = httpMock.expectOne(`${userMappingService.url}userMapping/save`);
    expect(req.request.method).toBe('POST');
    expect(req.request.responseType).toBe('json');
    req.flush({nonTenantUsers: {
      custom: {
        superAdmin: ['Administrative', 'Gatekeeping'],
        standard: ['Standard'],
        administrator: []
      }}});
    expect(userPrevilegesMappingComponent.getUserPrevilageMapping).toHaveBeenCalled.toString();
  });
});

