import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetMonitoringComponent } from './asset-monitoring.component';
import { NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA, IterableDiffers } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';
import { MatTableModule, MatSidenavModule, MatRadioModule, MatCheckboxModule, MatSelectModule, MatSnackBarModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';
import { AssetMonitoringService } from 'src/app/Core/Service/asset-monitoring.service';
import { ClassAMWidget } from 'src/app/Core/Class/class-widget-AssetMoni';

describe('AssetMonitoringComponent', () => {
  let component: AssetMonitoringComponent;
  let fixture: ComponentFixture<AssetMonitoringComponent>;
  let httpMock:HttpTestingController;
  let favMachineMockData={
    "metricWindow":
    {
      'value':"L30D",
      'text':"Last 30 days"
    },
    "devices":["99999031","99999045"],
    "_id":"5e5378f1d49f807e627170ad"
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssetMonitoringComponent ],
      schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],//noerror schema and custom element schema is added to avoid any template errors
      imports: [FormsModule, BrowserModule,RouterTestingModule,HttpClientModule,MatTableModule,MatSidenavModule,MatRadioModule, MatCheckboxModule, MatSelectModule, MatSnackBarModule,HttpClientTestingModule,BrowserAnimationsModule ],
      providers:  [AssetMonitoringService ]
    })
    .compileComponents();
    
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssetMonitoringComponent);
    component = fixture.componentInstance;
    httpMock=TestBed.get(HttpTestingController);
    let ev={
      pageSize:10,
      pageIndex:5,
    };
    localStorage.setItem('RTM_did',JSON.stringify('present'));
    localStorage.setItem('LS_userPagination', JSON.stringify(ev));
    const assetMonitoringComponent = fixture.debugElement.injector.get(AssetMonitoringComponent);
    // assetMonitoringComponent.ngOnInit() =>{}
    fixture.detectChanges();
  });

  it('should create', () => {
    let res={
      energy:2,
      type:'elevator'
    }
    var classAMWidget: ClassAMWidget = new ClassAMWidget(res);
    classAMWidget.onRoundPercent(200);
    classAMWidget.onRoundPercent(10);
    classAMWidget.onRoundPercent(-1);
    expect(component).toBeTruthy();
  });

  it('calling getFavMachines api - should get called', () => {
    const assetMonitoringService = fixture.debugElement.injector.get(AssetMonitoringService);
    const assetMonitoringComponent = fixture.debugElement.injector.get(AssetMonitoringComponent);
    assetMonitoringComponent.slideState=2;

    let req=httpMock.expectOne(`${assetMonitoringService.url}metrics/fav`);//http mock-mocking the api call 
    expect(req.request.method).toBe('GET');//expecting the request method
    expect(req.request.responseType).toBe('json');//expecting the response type
    
    req.flush(favMachineMockData);//flushing any response body and putting mock data that we have created

    fixture.detectChanges();
  })


  it('calling getFavMachines api - should get called', () => {
    const assetMonitoringService = fixture.debugElement.injector.get(AssetMonitoringService);
    const assetMonitoringComponent = fixture.debugElement.injector.get(AssetMonitoringComponent);

    assetMonitoringService.getAPIMetric('rtm',1582655400000,1582711555891,["99999031", "99999045"],'total');
    expect(assetMonitoringService.getAPIMetric).toHaveBeenCalled;
  })

  it('calling onFontSize function - should get called', () => {
    const assetMonitoringService = fixture.debugElement.injector.get(AssetMonitoringService);
    const assetMonitoringComponent = fixture.debugElement.injector.get(AssetMonitoringComponent);
    assetMonitoringComponent.onFontSize(4);
    assetMonitoringComponent.onFontSize(121212121);
    assetMonitoringComponent.onFontSize(null);
    expect(assetMonitoringComponent.onFontSize).toHaveBeenCalled;
  })

  it('calling putFavmachiens function - should get called', () => {
    const assetMonitoringService = fixture.debugElement.injector.get(AssetMonitoringService);
    const assetMonitoringComponent = fixture.debugElement.injector.get(AssetMonitoringComponent);

    assetMonitoringService.putFavmachiens({devices: ["99999031"]});
    expect(assetMonitoringService.putFavmachiens).toHaveBeenCalled;
  })

  it('calling putFavmachiens function - should get called', () => {
    const assetMonitoringService = fixture.debugElement.injector.get(AssetMonitoringService);
    const assetMonitoringComponent = fixture.debugElement.injector.get(AssetMonitoringComponent);

    assetMonitoringService.onRxUpdateWindowItem("any");
    expect(assetMonitoringService.onRxUpdateWindowItem).toHaveBeenCalled;
  })

  it('calling onRxTreeDevices function - should get called', () => {
    const assetMonitoringService = fixture.debugElement.injector.get(AssetMonitoringService);
    const assetMonitoringComponent = fixture.debugElement.injector.get(AssetMonitoringComponent);

    assetMonitoringService.onRxTreeDevices(["99999031"]);
    expect(assetMonitoringService.onRxTreeDevices).toHaveBeenCalled;
  })


  it('calling onRxTreeDevices function - should get called', () => {
    const assetMonitoringService = fixture.debugElement.injector.get(AssetMonitoringService);
    const assetMonitoringComponent = fixture.debugElement.injector.get(AssetMonitoringComponent);

    assetMonitoringService.onRxTreeDevices(["99999031"]);
    expect(assetMonitoringService.onRxTreeDevices).toHaveBeenCalled;
  });

  it('calling onClick_ShowDetails function', () => {
    const assetMonitoringService = fixture.debugElement.injector.get(AssetMonitoringService);
    const assetMonitoringComponent = fixture.debugElement.injector.get(AssetMonitoringComponent);
    let row={
      status:'training'
    }
    let row1={
      status:'else'
    }

    assetMonitoringComponent.onClick_ShowDetails(row);
    assetMonitoringComponent.onClick_ShowDetails(row1);
    expect(assetMonitoringComponent.onClick_ShowDetails).toHaveBeenCalled;
  });

  it('calling onClass function', () => {
    const assetMonitoringService = fixture.debugElement.injector.get(AssetMonitoringService);
    const assetMonitoringComponent = fixture.debugElement.injector.get(AssetMonitoringComponent);
  
    assetMonitoringComponent.onClass('firstname','lastname');
    expect(assetMonitoringComponent.onClass).toHaveBeenCalled;
  });

  it('calling onPerCentRoundTO100 function', () => {
    const assetMonitoringService = fixture.debugElement.injector.get(AssetMonitoringService);
    const assetMonitoringComponent = fixture.debugElement.injector.get(AssetMonitoringComponent);
  
    assetMonitoringComponent.onPerCentRoundTO100(2000.1201);
    assetMonitoringComponent.onPerCentRoundTO100(null);
    expect(assetMonitoringComponent.onPerCentRoundTO100).toHaveBeenCalled;
  });

  it('calling onInitLoadRTM function', () => {
    const assetMonitoringService = fixture.debugElement.injector.get(AssetMonitoringService);
    const assetMonitoringComponent = fixture.debugElement.injector.get(AssetMonitoringComponent);

    let AssetMonSidenavState={
      type:"asset1",
      isOpened:true
    }

    let AssetMonSidenavState2={
      type:"asset",
      isOpened:true
    }
  
    localStorage.setItem('AssetMonSidenavState',JSON.stringify(AssetMonSidenavState));
    localStorage.setItem('RTM_windowMetric',JSON.stringify(123));
    localStorage.setItem('RTM_did',JSON.stringify(123));
    assetMonitoringComponent.onInitLoadRTM();
    // localStorage.setItem('AssetMonSidenavState',JSON.stringify(AssetMonSidenavState2));
    // assetMonitoringComponent.onInitLoadRTM();
    
    expect(assetMonitoringComponent.onInitLoadRTM).toHaveBeenCalled;
  });

  

  it('calling fun_LoadData function', () => {
    const assetMonitoringService = fixture.debugElement.injector.get(AssetMonitoringService);
    const assetMonitoringComponent = fixture.debugElement.injector.get(AssetMonitoringComponent);
  
    assetMonitoringComponent.fun_LoadData(['1','2'],'present');
    expect(assetMonitoringComponent.fun_LoadData).toHaveBeenCalled;
  });  

  it('calling loadFavMachines function', () => {
    const assetMonitoringService = fixture.debugElement.injector.get(AssetMonitoringService);
    const assetMonitoringComponent = fixture.debugElement.injector.get(AssetMonitoringComponent);
  
    assetMonitoringComponent.loadFavMachines();
    expect(assetMonitoringComponent.loadFavMachines).toHaveBeenCalled;
  });  

  it('calling onPageChange function', () => {
    const assetMonitoringService = fixture.debugElement.injector.get(AssetMonitoringService);
    const assetMonitoringComponent = fixture.debugElement.injector.get(AssetMonitoringComponent);
  
    assetMonitoringComponent.onPageChange({
      pageSize:10,
      pageIndex:5,
    });
    expect(assetMonitoringComponent.onPageChange).toHaveBeenCalled;
  });  

  it('calling onAppyPagination function', () => {
    const assetMonitoringService = fixture.debugElement.injector.get(AssetMonitoringService);
    const assetMonitoringComponent = fixture.debugElement.injector.get(AssetMonitoringComponent);
  
    assetMonitoringComponent.onAppyPagination(['1212222','122211']);
    expect(assetMonitoringComponent.onAppyPagination).toHaveBeenCalled;
  });

  it('calling onPaginationSideNavAutoPageSize function', () => {
    const assetMonitoringService = fixture.debugElement.injector.get(AssetMonitoringService);
    const assetMonitoringComponent = fixture.debugElement.injector.get(AssetMonitoringComponent);
  
    assetMonitoringComponent.onPaginationSideNavAutoPageSize();
    expect(assetMonitoringComponent.onPaginationSideNavAutoPageSize).toHaveBeenCalled;
  });

});
