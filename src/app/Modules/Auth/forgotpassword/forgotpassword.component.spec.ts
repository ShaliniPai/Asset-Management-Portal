import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ForgotpasswordComponent } from './forgotpassword.component';
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


describe('ForgotpasswordComponent', () => {
  let component: ForgotpasswordComponent;
  let fixture: ComponentFixture<ForgotpasswordComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ForgotpasswordComponent ],
      imports: [FormsModule,
        BrowserModule,RouterTestingModule,HttpClientModule ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ForgotpasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });


  it('should create', () => {//sample case to verify the jest functionality 
    expect(component).toBeTruthy;
  });

  // it("should not sign in with empty fields",()=>{
  //   const forgotPassInput = fixture.debugElement.query(By.css("#forgotPass")).nativeElement;
  //   // expect(forgotPassInput.value).not.toBe("");
  //   forgotPassInput.value="w";
  //   expect(forgotPassInput.value).not.toBe("");
  //  });

  //  it("should not sign in with empty fields",()=>{
  //   const forgotPassInput = fixture.debugElement.query(By.css("#forgotPass")).nativeElement;
  //   const resetPassBtn = fixture.debugElement.query(By.css("#resetPassBtn")).nativeElement;
  //   // expect(forgotPassInput.value).not.toBe("");
  //   forgotPassInput.value="e";
  //   // forgotPassInput.
  //   expect(resetPassBtn).toBeTruthy;
  //  });
});
