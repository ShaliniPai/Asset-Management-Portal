import { LayoutModule } from '@angular/cdk/layout';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule, BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';

import { SuiteAssetFilterComponent } from './suite-asset-filter.component';
import { NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';
import { MatTableModule, MatRadioModule, MatCheckboxModule, MatSelectModule, MatSnackBarModule } from '@angular/material';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AuthService } from '../../../../Core/Service/assets.service';
import { AssetMonitoringService } from '../../../../Core/Service/asset-monitoring.service';
import { TreeHierarchyService } from '../../treeView/tree-hierarchy.service';




describe('SuiteAssetFilterComponent', () => {
  let component: SuiteAssetFilterComponent;
  let fixture: ComponentFixture<SuiteAssetFilterComponent>;
  

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SuiteAssetFilterComponent],
      imports: [
        NoopAnimationsModule,
        LayoutModule,
        MatButtonModule,
        MatIconModule,
        MatListModule,
        MatSidenavModule,
        MatToolbarModule,
        FormsModule,
        BrowserModule,
        RouterTestingModule,
        HttpClientModule,
        MatTableModule,
        MatSidenavModule,
        MatRadioModule, 
        MatCheckboxModule, 
        MatSelectModule, MatSnackBarModule,
        HttpClientTestingModule,BrowserAnimationsModule
      ],
      schemas: [NO_ERRORS_SCHEMA,CUSTOM_ELEMENTS_SCHEMA],//noerror schema and custom element schema is added to avoid any template errors
      
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SuiteAssetFilterComponent);
    component = fixture.componentInstance;
    const suiteAssetFilterComponent = fixture.debugElement.injector.get(SuiteAssetFilterComponent);
    const treeHierarchyService = fixture.debugElement.injector.get(TreeHierarchyService);
    localStorage.setItem('RTM_windowMetric',JSON.stringify('L30D'));
    localStorage.setItem('RTM_did',JSON.stringify('L30D'));
    let config={ 
      url:'someURl',
      dataModel:'value'
    }
    let callback={
      dataChildrens:[1,2]
    }
    let data=[1,2,3];
    treeHierarchyService.SgetTreeviewData(config,callback);
    // treeHierarchyService.onCreateTree(data);
    let ngOnitFn = suiteAssetFilterComponent.ngOnInit = () =>{}; //overriding the ngOnInit method

    fixture.detectChanges();
  });

  it('should compile', () => {
    expect(component).toBeTruthy();
  });

  it('calling OnTreeSelectedItem',() => {
    const suiteAssetFilterComponent = fixture.debugElement.injector.get(SuiteAssetFilterComponent);
    suiteAssetFilterComponent.OnTreeSelectedItem(['1']);
    suiteAssetFilterComponent.onReturnDevices(['1']);
    suiteAssetFilterComponent.assetInfo=['1'];
    suiteAssetFilterComponent.assetInfo.length=1;
    expect(suiteAssetFilterComponent.OnTreeSelectedItem).toHaveBeenCalled;
  });

  it('calling onToggleSideNav',() => {
    const suiteAssetFilterComponent = fixture.debugElement.injector.get(SuiteAssetFilterComponent);
    suiteAssetFilterComponent.onToggleSideNav('asset',false);
    suiteAssetFilterComponent.onToggleSideNav('no-asset',true);
    expect(suiteAssetFilterComponent.onToggleSideNav).toHaveBeenCalled;
  });

  it('calling onLoadFavMachines- getFavMachines api',() => {
    const suiteAssetFilterComponent = fixture.debugElement.injector.get(SuiteAssetFilterComponent);
    localStorage.setItem('RTM_windowMetric',JSON.stringify('L30D'));
    localStorage.setItem('RTM_did',JSON.stringify('L30D'));
    suiteAssetFilterComponent.onLoadFavMachines();
    expect(suiteAssetFilterComponent.onLoadFavMachines).toHaveBeenCalled;
  });

  it('calling onLoadFavMachines- getFavMachines api',() => {
    const suiteAssetFilterComponent = fixture.debugElement.injector.get(SuiteAssetFilterComponent);
    localStorage.clear();
    suiteAssetFilterComponent.onLoadFavMachines();
    expect(suiteAssetFilterComponent.onLoadFavMachines).toHaveBeenCalled;
  });

  it('calling onArrowAssets',() => {
    const suiteAssetFilterComponent = fixture.debugElement.injector.get(SuiteAssetFilterComponent);
    suiteAssetFilterComponent.onArrowAssets(true);
    expect(suiteAssetFilterComponent.onArrowAssets).toHaveBeenCalled;
  });

});
