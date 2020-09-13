import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddAssetComponent } from './add-asset.component';
import { NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA, IterableDiffers, ViewChild } from '@angular/core';
import { CorpSettingUserService } from 'src/app/Core/Service/corp-setting-user.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
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

describe('AddAssetComponent', () => {
  let component: AddAssetComponent;
  let httpMock: HttpTestingController;
  let fixture: ComponentFixture<AddAssetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddAssetComponent ],
      schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA], // noerror schema and custom element schema is added to avoid any template errors
      imports: [FormsModule, BrowserModule, RouterTestingModule, HttpClientModule, MatFormFieldModule, MatInputModule,
        MatTableModule, MatSidenavModule, MatRadioModule, MatCheckboxModule, MatSelectModule, MatMenuModule,
        MatSnackBarModule, HttpClientTestingModule, BrowserAnimationsModule, ReactiveFormsModule],
      providers: [CorpSettingUserService, AssetManagerService,
        { provide: CdkTable, useExisting: MatTable }]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddAssetComponent);
    const addAssetComponent = fixture.debugElement.injector.get(AddAssetComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.get(HttpTestingController);
    addAssetComponent.assetList = [{assetName: 'new name', siteName: 'site name'}];
    addAssetComponent.siteList = [{assetName: 'new name', siteName: 'site name'}];
    addAssetComponent.assetDetail = { assetCategory: 'string', locId: 'string', oemName: 'string', oemModelName: 'any' };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('validateForm should get called', () => {
    const addAssetComponent = fixture.debugElement.injector.get(AddAssetComponent);
    addAssetComponent.assetGroup.controls.assetName.setValue('name');
    addAssetComponent.assetGroup.controls.bottomFloor.setValue(1);
    addAssetComponent.assetGroup.controls.topFloor.setValue(12);
    addAssetComponent.assetGroup.controls.siteName.setValue('site Name1');
    addAssetComponent.assetGroup.controls.wingBlock.setValue('wing name');
    addAssetComponent.assetGroup.controls.selectOEM.setValue('');
    addAssetComponent.assetGroup.controls.selectCriterion.setValue('Usage - No. of trips');
    addAssetComponent.assetGroup.controls.unitValue.setValue(1);
    addAssetComponent.assetGroup.controls.date.setValue(new Date());
    addAssetComponent.assetGroup.controls.selectUnits.setValue(1);
    addAssetComponent.assetGroup.controls.monday.setValue(1);
    addAssetComponent.assetGroup.controls.tuesday.setValue(1);
    addAssetComponent.assetGroup.controls.wednesday.setValue(1);
    addAssetComponent.assetGroup.controls.thrusday.setValue(1);
    addAssetComponent.assetGroup.controls.friday.setValue(1);
    addAssetComponent.assetGroup.controls.saturday.setValue(1);
    addAssetComponent.assetGroup.controls.sunday.setValue(1);
    addAssetComponent.assetList = [{assetName: 'new name', siteName: 'site name'}];
    addAssetComponent.siteList = [{assetName: 'new name', siteName: 'site name'}];

    fixture.detectChanges();
    addAssetComponent.validateForm();
    expect(addAssetComponent.validateForm).toHaveBeenCalled.toString();
  });

  it('ADD ASSET should get called', () => {
    const addAssetComponent = fixture.debugElement.injector.get(AddAssetComponent);
    const assetManagerService = fixture.debugElement.injector.get(AssetManagerService);
    addAssetComponent.addAsset();
    fixture.detectChanges();
    const req = httpMock.expectOne(`${assetManagerService.url}assets/addAsset`);
    expect(req.request.method).toBe('POST');
    expect(req.request.responseType).toBe('json');
    req.flush({message: 'success!!!'});
  });

  it('GET OEM NAMES should get called', () => {
    const addOEMService = fixture.debugElement.injector.get(AddOEMService);
    // addAssetComponent.getOemNames();
    fixture.detectChanges();
    const req = httpMock.expectOne(`${addOEMService.url}assets/getOemNames`);
    expect(req.request.method).toBe('GET');
    expect(req.request.responseType).toBe('json');
    req.flush([{name: 'oemname'}]);
  });

  it('getSites should get called', () => {
    const sitesService = fixture.debugElement.injector.get(SitesService);
    fixture.detectChanges();
    const req = httpMock.expectOne(`${sitesService.url}site/get`);
    expect(req.request.method).toBe('GET');
    expect(req.request.responseType).toBe('json');
    req.flush([{siteName : 'site Name1'}]);
  });

  it('Add block should get called', () => {
    const addAssetComponent = fixture.debugElement.injector.get(AddAssetComponent);
    const asetManagerService = fixture.debugElement.injector.get(AssetManagerService);
    addAssetComponent.recentSelectedAsset = 'recent';
    addAssetComponent.selectedSite = { tenant: 'any', wifiPassword: 'any', wifiSSID: 'any', zid: 'any', locId: 'any',
      loc: { latitude: 'any', longitude: 'any'}, opHours : {
      weekdays : {
        time : {
          from : {
            hh : 12,
            mm : 0,
            meridiem : 'AM'
          },
          to : {
            hh : 12,
            mm : 0,
            meridiem : 'AM'
          }
        },
        days : [
          1,
          2,
          3,
          4,
          5
        ]
      },
      weekend : {
        time : {
          from : {
            hh : 12,
            mm : 0,
            meridiem : 'AM'
          },
          to : {
            hh : 12,
            mm : 0,
            meridiem : 'AM'
          }
        },
        days : [
          6,
          7
        ]
      }
    },
    des: 'any', zone: 'string', siteName: 'string',
  };
    addAssetComponent.addWnigBlock('newBlock');
    fixture.detectChanges();
    const req = httpMock.expectOne(`${asetManagerService.url}assets/addBlock`);
    expect(req.request.method).toBe('POST');
    expect(req.request.responseType).toBe('json');
    req.flush({message: 'success!!!'});
  });


  it('getAssetData should get called', () => {
    const assetManagerService = fixture.debugElement.injector.get(AssetManagerService);
    fixture.detectChanges();
    const req = httpMock.expectOne(`${assetManagerService.url}assets/showAssets`);
    expect(req.request.method).toBe('GET');
    expect(req.request.responseType).toBe('json');
    req.flush({data: [{assetName: 'new name', siteName: 'site name'}]});
  });

  it('getExistingAsset should get called', () => {
    const addAssetComponent = fixture.debugElement.injector.get(AddAssetComponent);
    const assetManagerService = fixture.debugElement.injector.get(AssetManagerService);
    addAssetComponent.hideOtherOemName('oem');
    addAssetComponent.hideOtherOemName('Other');
    addAssetComponent.siteOpHours('site name');
    addAssetComponent.recentSelectedAsset = 'recent';
    addAssetComponent.getExistingAsset( addAssetComponent.recentSelectedAsset);
    addAssetComponent.assetDetail = { assetCategory: 'string', locId: 'string', oemName: 'string', oemModelName: 'any' };
    fixture.detectChanges();
    const req = httpMock.expectOne(`${assetManagerService.url}assets/showAssets/assetDetails`);
    expect(req.request.method).toBe('POST');
    expect(req.request.responseType).toBe('json');
    req.flush({data: [{assetName: 'new name', siteName: 'site name',
    opHours : {
      weekdays : {
        time : {
          from : {
            hh : 12,
            mm : 0,
            meridiem : 'AM'
          },
          to : {
            hh : 12,
            mm : 0,
            meridiem : 'AM'
          }
        },
        days : [
          1,
          2,
          3,
          4,
          5,
          6,
          7
        ]
      },
      weekend : {
        time : {
          from : {
            hh : 12,
            mm : 0,
            meridiem : 'AM'
          },
          to : {
            hh : 12,
            mm : 0,
            meridiem : 'AM'
          }
        },
        days : [
          1,
          2,
          3,
          4,
          5,
          6,
          7
        ]
      }
    }
  }]});
  });
});
