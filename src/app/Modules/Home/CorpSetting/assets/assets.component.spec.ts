import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetsComponent } from './assets.component';
import { NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA, IterableDiffers, ViewChild } from '@angular/core';
import { CorpSettingUserService } from 'src/app/Core/Service/corp-setting-user.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { GetUserService } from 'src/app/Core/Service/get-user.service';
import { HttpClientModule } from '@angular/common/http';
import {
  MatTableModule, MatSidenavModule, MatRadioModule, MatTable,
  MatCheckboxModule, MatSelectModule, MatSnackBarModule, MatMenu, MatMenuModule, MatTableDataSource
} from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AssetManagerService } from 'src/app/Core/Service/asset-manager.service';
import { SitesService } from 'src/app/Core/Service/sites.service';
import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';
import { CdkTable } from '@angular/cdk/table';



describe('AssetsComponent', () => {
  let component: AssetsComponent;
  let fixture: ComponentFixture<AssetsComponent>;
  let httpMock: HttpTestingController;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AssetsComponent],
      schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA], // noerror schema and custom element schema is added to avoid any template errors
      imports: [FormsModule, BrowserModule, RouterTestingModule, HttpClientModule,
        MatTableModule, MatSidenavModule, MatRadioModule, MatCheckboxModule, MatSelectModule, MatMenuModule,
        MatSnackBarModule, HttpClientTestingModule, BrowserAnimationsModule, ReactiveFormsModule],
      providers: [CorpSettingUserService, AssetManagerService,
        { provide: CdkTable, useExisting: MatTable },
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssetsComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.get(HttpTestingController);
    const assetsComponent = fixture.debugElement.injector.get(AssetsComponent);
    assetsComponent.siteList = [{
      _id: '5eba806d4f32a40011cdbad7', locId: 'Elevator', des: 'Test68', status: 'active'
    }];
    assetsComponent.assets = [
      {
        _id: '5eba806d4f32a40011cdbad7', assetCategory: 'Elevator', assetName: 'Test68', status: 'active'
      },
      {
        _id: '5eba806d4f32a40011cdbad8', assetCategory: 'Elevators', assetName: 'Test68', status: 'new'
      },
    ];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('Sort should get called', () => {
    const assetsComponent = fixture.debugElement.injector.get(AssetsComponent);
    fixture.detectChanges();
    assetsComponent.sortedAssets = [{ assetName: 'abc', assetCategory: 'new', status: 'new' }];
    const event = {
      target: {
        value: 'assteType'
      }
    };
    assetsComponent.sortAsset(event);
    expect(assetsComponent.sortAsset).toHaveBeenCalled.toString();
  });

  it('Sort should get called', () => {
    const assetsComponent = fixture.debugElement.injector.get(AssetsComponent);
    fixture.detectChanges();
    assetsComponent.sortedAssets = [{ assetName: 'abc', assetCategory: 'new', status: 'new' }];
    const event = {
      target: {
        value: 'assetName'
      }
    };
    assetsComponent.sortAsset(event);
    expect(assetsComponent.sortAsset).toHaveBeenCalled.toString();
  });

  it('Sort assetState should get called', () => {
    const assetsComponent = fixture.debugElement.injector.get(AssetsComponent);
    fixture.detectChanges();
    assetsComponent.sortedAssets = [{ assetName: 'abc', assetCategory: 'new', status: 'new' }];
    const event = {
      target: {
        value: 'assetState'
      }
    };
    assetsComponent.sortAsset(event);
    expect(assetsComponent.sortAsset).toHaveBeenCalled.toString();
  });

  /************************* CALLING GET SITES *********************/
  it(`calling showAssets api- sould get called`, () => {
    const assetsComponent = fixture.debugElement.injector.get(AssetsComponent);
    const sitesService = fixture.debugElement.injector.get(SitesService);
    assetsComponent.getSites();
    fixture.detectChanges();
    const req = httpMock.expectOne(`${sitesService.url}site/get`);
    expect(req.request.method).toBe('GET'); // expecting the request method
    expect(req.request.responseType).toBe('json'); // expecting the response type
    req.flush([{
      _id: '5eba806d4f32a40011cdbad7', locId: 'Elevator', des: 'Test68', status: 'active'
    }]); // flushing any response body and putting mock data that we have created
    // httpMock.expectOne(`${assetManagerService.url}assets/showAssets`);
  });

  /************************* CALLING SHOW ASSETS *********************/
  it(`calling showAssets api- sould get called`, () => {
    const assetManagerService = fixture.debugElement.injector.get(AssetManagerService);
    fixture.detectChanges();
    const req = httpMock.expectOne(`${assetManagerService.url}assets/showAssets`);
    expect(req.request.method).toBe('GET'); // expecting the request method
    expect(req.request.responseType).toBe('json'); // expecting the response type
    const res = {
      data: [
        {
          _id: '5eba806d4f32a40011cdbad7', assetCategory: 'Elevator', assetName: 'Test68', status: 'active', enabled: true, maintDt: ''
        },
        {
          _id: '5eba806d4f32a40011cdbad8', assetCategory: 'Elevators', assetName: 'Test68', status: 'new', enabled: true, maintDt: ''
        },
      ]
    };
    req.flush(res); // flushing any response body and putting mock data that we have created
  });


  /************************* CALLING UPDATE HW ID *********************/
  it(`calling update HW Id api- sould get called`, () => {
    const assetsComponent = fixture.debugElement.injector.get(AssetsComponent);
    const assetManagerService = fixture.debugElement.injector.get(AssetManagerService);
    assetsComponent.onUpdate(1,{assetName: 'name'});
    assetsComponent.profileForm.value.sensorHwId = '12345';
    fixture.detectChanges();
    const req = httpMock.expectOne(`${assetManagerService.url}assets/addDevice`);
    expect(req.request.method).toBe('POST'); // expecting the request method
    expect(req.request.responseType).toBe('json'); // expecting the response type
    req.flush({message: 'done'});
  });

  /************************* CALLING ONFILTER *********************/
  it(`calling OnFilterSelectAll api- sould get called`, () => {
    const assetsComponent = fixture.debugElement.injector.get(AssetsComponent);
    assetsComponent.backupAssetTypes = [
      {
        _id: '5eba806d4f32a40011cdbad7', bname: 'BBMP', assetCategory: 'Elevator', assetType: 'type',
        assetName: 'Test68', status: 'active', enabled: true, maintDt: '', zone: 'zone'
      },
      {
        _id: '5eba806d4f32a40011cdbad8', bname: 'BBMP', assetCategory: 'Elevators', assetType: 'type',
      assetName: 'Test68', status: 'new', enabled: true, maintDt: '', zone: 'zone'
      },
    ];
    assetsComponent.itemsZoneFilter = [
      {
        _id: '5eba806d4f32a40011cdbad7', bname: 'BBMP', assetCategory: 'Elevator', assetType: 'type',
        assetName: 'Test68', status: 'active', enabled: true, maintDt: '', siteName : 'name', zone: 'zone'
      },
      {
        _id: '5eba806d4f32a40011cdbad8', bname: 'BBMP', assetCategory: 'Elevators', assetType: 'type',
      assetName: 'Test68', status: 'new', enabled: true, maintDt: '', siteName : 'name', zone: 'zone'
      },
    ];
    assetsComponent.itemsSiteFilter = [
      {
        _id: '5eba806d4f32a40011cdbad7', bname: 'BBMP', assetCategory: 'Elevator', assetType: 'type',
        assetName: 'Test68', status: 'active', enabled: true, maintDt: '', siteName : 'name', zone: 'zone'
      },
      {
        _id: '5eba806d4f32a40011cdbad8', bname: 'BBMP', assetCategory: 'Elevators', assetType: 'type',
      assetName: 'Test68', status: 'new', enabled: true, maintDt: '', siteName : 'name', zone: 'zone'
      },
    ];
    assetsComponent.itemsAssetStateFilter = ['new', 'active'];
    assetsComponent.siteFilter = [
      {
        _id: '5eba806d4f32a40011cdbad7', bname: 'BBMP', assetCategory: 'Elevator', assetType: 'type',
        assetName: 'Test68', status: 'active', enabled: true, maintDt: '', siteName : 'name', zone: 'zone'
      },
      {
        _id: '5eba806d4f32a40011cdbad8', bname: 'BBMP', assetCategory: 'Elevators', assetType: 'type',
      assetName: 'Test68', status: 'new', enabled: true, maintDt: '', siteName : 'name', zone: 'zone'
      },
    ];
    assetsComponent.zoneFilter = [
      {
        _id: '5eba806d4f32a40011cdbad7', bname: 'BBMP', assetCategory: 'Elevator', assetType: 'type',
        assetName: 'Test68', status: 'active', enabled: true, maintDt: '', siteName : 'name', zone: 'zone'
      },
      {
        _id: '5eba806d4f32a40011cdbad8', bname: 'BBMP', assetCategory: 'Elevators', assetType: 'type',
      assetName: 'Test68', status: 'new', enabled: true, maintDt: '', siteName : 'name', zone: 'zone'
      },
    ];
    fixture.detectChanges();
    const arrOfFilter = ['assetType', 'zone', 'siteName', 'assetState'];
    arrOfFilter.forEach(element => {
      assetsComponent.onFilterSelectAll(element);
      console.log(element);
    });
    assetsComponent.onFilterSelectAll('assetType');
    expect(assetsComponent.onFilterSelectAll).toHaveBeenCalled.toString();
  });

  /******************** CALLING ONIMAGE FILTER ********************/
  it('calling onimage filter should get called', () => {
    const assetsComponent = fixture.debugElement.injector.get(AssetsComponent);
    assetsComponent.allSiteFilter = ['all'];
    assetsComponent.allZoneFilter = ['all'];
    assetsComponent.allAssetTypesFilter = ['all'];
    assetsComponent.allAssetStatesFilter = ['all'];
    fixture.detectChanges();
    const arrOfFilter = ['assetType', 'zone', 'siteName', 'assetState'];
    arrOfFilter.forEach(element => {
      assetsComponent.onImageFitler(element);
      console.log(element);
    });
    expect(assetsComponent.onImageFitler).toHaveBeenCalled.toString();
  });

  /******************** CALLING VIEW ASSET ********************/
  it('calling viewAsset should get called', () => {
    const assetsComponent = fixture.debugElement.injector.get(AssetsComponent);
    fixture.detectChanges();
    assetsComponent.viewAsset(
      {
        _id: '5eba806d4f32a40011cdbad7', bname: 'BBMP', assetCategory: 'Elevator', assetType: 'type',
        assetName: 'Test68', status: 'active', enabled: true, maintDt: '', siteName : 'name', zone: 'zone'
      }
    );
    expect(assetsComponent.viewAsset).toHaveBeenCalled.toString();
  });

  /******************** CALLING ONEDIT  ********************/
  it('calling onEdit should get called', () => {
    const assetsComponent = fixture.debugElement.injector.get(AssetsComponent);
    fixture.detectChanges();
    assetsComponent.onEdit(1,
      {
        _id: '5eba806d4f32a40011cdbad7', bname: 'BBMP', assetCategory: 'Elevator', assetType: 'type',
        assetName: 'Test68', status: 'active', enabled: true, maintDt: '', siteName : 'name', zone: 'zone'
      }
    );
    expect(assetsComponent.onEdit).toHaveBeenCalled.toString();
  });


  /******************** CALLING ONEDIT  ********************/
  it('calling onUndo should get called', () => {
    const assetsComponent = fixture.debugElement.injector.get(AssetsComponent);
    fixture.detectChanges();
    assetsComponent.onUndo(1,
      {
        _id: '5eba806d4f32a40011cdbad7', bname: 'BBMP', assetCategory: 'Elevator', assetType: 'type',
        assetName: 'Test68', status: 'active', enabled: true, maintDt: '', siteName : 'name', zone: 'zone'
      }
    );
    expect(assetsComponent.onUndo).toHaveBeenCalled.toString();
  });


});
