import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

import { DefineEventsComponent } from './define-events.component';
import { NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA, inject } from '@angular/core';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';
import { MatTableModule, MatSidenavModule, MatRadioModule, MatCheckboxModule, MatSelectModule, MatSnackBarModule, MatRadioChange, MatRadioButton, MatCheckboxChange, MatCheckbox } from '@angular/material';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AlertsNotifServiceComponent } from 'src/app/Core/Service/alerts-notification.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SnackMessageComponent } from 'src/app/Core/MatSnackBarCom/snack-message/snack-message.component';
import { MAT_SNACK_BAR_DATA, SimpleSnackBar, MatSnackBar } from '@angular/material';

var getUsers=require('src/assets/json/mock.getUsers.json');//data-mock getUsers

describe('DefineEventsComponent', () => {
  let x:any;
  let httpMock:HttpTestingController;
  let component: DefineEventsComponent;
  let fixture: ComponentFixture<DefineEventsComponent>;


  i:Number;
  criteria:[
    'I-L',
    'D-L',
    'A-O',
    'U-L'
  ];

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DefineEventsComponent ],
      schemas: [NO_ERRORS_SCHEMA,CUSTOM_ELEMENTS_SCHEMA],//noerror schema and custom element schema is added to avoid any template errors
      imports: [FormsModule,BrowserAnimationsModule,ReactiveFormsModule,BrowserModule,RouterTestingModule.withRoutes([]),HttpClientModule,MatTableModule,MatSidenavModule,MatRadioModule, MatCheckboxModule, MatSelectModule, MatSnackBarModule,HttpClientTestingModule ],
      providers: [ AlertsNotifServiceComponent]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DefineEventsComponent);
    component = fixture.componentInstance;
    httpMock=TestBed.get(HttpTestingController);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it(`calling getAssets api- sould get called`, () => {  
    const alertsNotifServiceComponent = fixture.debugElement.injector.get(AlertsNotifServiceComponent);
    fixture.detectChanges();
    let req=httpMock.expectOne(`${alertsNotifServiceComponent._URL}/api/assets/getAssets`);//http mock-mocking the api call 
    expect(req.request.method).toBe('GET');//expecting the request method
    expect(req.request.responseType).toBe('json');//expecting the response type
    req.flush(null);//flushing any response body and putting mock data that we have created
  });

  it(`calling getUsers api- sould get called`, () => {  
    const alertsNotifServiceComponent = fixture.debugElement.injector.get(AlertsNotifServiceComponent);
    fixture.detectChanges();
    let req=httpMock.expectOne(`${alertsNotifServiceComponent._URL}/api/alerts/getUsers`);//http mock-mocking the api call 
    expect(req.request.method).toBe('GET');//expecting the request method
    expect(req.request.responseType).toBe('json');//expecting the response type
    req.flush(null);//flushing any response body and putting mock data that we have created
  });


  it(`calling createEvent api- sould get called........`, () => {  
    const alertsNotifServiceComponent = fixture.debugElement.injector.get(AlertsNotifServiceComponent);
    const defineEventsComponent = fixture.debugElement.injector.get(DefineEventsComponent);

    //providing necessary values for function to excecute
    defineEventsComponent.emailCheck='';
    defineEventsComponent.assetName='has value';
    defineEventsComponent.criteriaForCurrentDay="";
    defineEventsComponent.fg.controls.th1.setValue(90);

    defineEventsComponent.PostData();
    fixture.detectChanges();
    let req=httpMock.expectOne(`${alertsNotifServiceComponent._URL}/api/alerts/createEvent`);//http mock-mocking the api call 
    expect(req.request.method).toBe('POST');//expecting the request method
    // expect(req.request.responseType).toBe('json');//expecting the response type
    req.flush(null);//flushing any response body and putting mock data that we have created
  });



  //*************************test cases for failure*************************//
  it(`calling createEvent api- sould get called with Email`, () => {  
    const alertsNotifServiceComponent = fixture.debugElement.injector.get(AlertsNotifServiceComponent);
    const defineEventsComponent = fixture.debugElement.injector.get(DefineEventsComponent);

    //providing necessary values for function to excecute
    defineEventsComponent.emailCheck='chethan.munikrishna@in.bosch.com';//adding value for negative testcase
    defineEventsComponent.assetName='';
    defineEventsComponent.criteriaForCurrentDay="I-L";
    defineEventsComponent.usersList=getUsers;

    defineEventsComponent.PostData();
    fixture.detectChanges();
    // let req=httpMock.expectOne(`${alertsNotifServiceComponent._URL}/api/alerts/createEvent`);//http mock-mocking the api call 
    expect(defineEventsComponent.stop).toBe(true);//expecting the request method
  });

  it(`calling createEvent api- sould get called without assetName `, () => {  
    const alertsNotifServiceComponent = fixture.debugElement.injector.get(AlertsNotifServiceComponent);
    const defineEventsComponent = fixture.debugElement.injector.get(DefineEventsComponent);

    //providing necessary values for function to excecute
    defineEventsComponent.emailCheck='chethan.munikrishna@in.bosch.com';
    defineEventsComponent.assetName='';//removing value for negative testcase
    defineEventsComponent.criteriaForCurrentDay="I-L";
    defineEventsComponent.fg.controls.level1.setValue('0');
    defineEventsComponent.fg.controls.level1.setValue('cmu6kor');
    defineEventsComponent.usersList=getUsers;

    defineEventsComponent.PostData();
    fixture.detectChanges(); 
    expect(defineEventsComponent.stop).toBe(true);//expecting the request method
  });


  it(`calling createEvent api- sould get called without assetName `, () => {  
    const alertsNotifServiceComponent = fixture.debugElement.injector.get(AlertsNotifServiceComponent);
    const defineEventsComponent = fixture.debugElement.injector.get(DefineEventsComponent);

    //providing necessary values for function to excecute
    defineEventsComponent.emailCheck='chethan.munikrishna@in.bosch.com';
    defineEventsComponent.assetName='';//removing value for negative testcase
    defineEventsComponent.criteriaForCurrentDay="I-L";
    defineEventsComponent.fg.controls.level11.setValue('0');
    defineEventsComponent.fg.controls.level11.setValue('cmu6kor');
    defineEventsComponent.usersList=getUsers;

    defineEventsComponent.PostData();
    fixture.detectChanges(); 
    expect(defineEventsComponent.stop).toBe(true);//expecting the request method
  });


  it(`calling createEvent api- sould get called without assetName `, () => {  
    const alertsNotifServiceComponent = fixture.debugElement.injector.get(AlertsNotifServiceComponent);
    const defineEventsComponent = fixture.debugElement.injector.get(DefineEventsComponent);

    //providing necessary values for function to excecute
    defineEventsComponent.emailCheck='chethan.munikrishna@in.bosch.com';
    defineEventsComponent.assetName='';//removing value for negative testcase
    defineEventsComponent.criteriaForCurrentDay="I-L";
    defineEventsComponent.fg.controls.level12.setValue('0');
    defineEventsComponent.fg.controls.level12.setValue('cmu6kor');
    defineEventsComponent.usersList=getUsers;

    defineEventsComponent.PostData();
    fixture.detectChanges(); 
    expect(defineEventsComponent.stop).toBe(true);//expecting the request method
  });


  it(`calling createEvent api- sould get called without assetName `, () => {  
    const alertsNotifServiceComponent = fixture.debugElement.injector.get(AlertsNotifServiceComponent);
    const defineEventsComponent = fixture.debugElement.injector.get(DefineEventsComponent);

    //providing necessary values for function to excecute
    defineEventsComponent.emailCheck='chethan.munikrishna@in.bosch.com';
    defineEventsComponent.assetName='';//removing value for negative testcase
    defineEventsComponent.criteriaForCurrentDay="I-L";
    defineEventsComponent.fg.controls.level2.setValue('0');
    defineEventsComponent.fg.controls.level2.setValue('cmu6kor');
    defineEventsComponent.usersList=getUsers;

    defineEventsComponent.PostData();
    fixture.detectChanges(); 
    expect(defineEventsComponent.stop).toBe(true);//expecting the request method
  });

  it(`calling  api- adding fg.controls.per.setValue('1') `, () => {  
    const alertsNotifServiceComponent = fixture.debugElement.injector.get(AlertsNotifServiceComponent);
    const defineEventsComponent = fixture.debugElement.injector.get(DefineEventsComponent);

    //providing necessary values for function to excecute
    defineEventsComponent.emailCheck='chethan.munikrishna@in.bosch.com';
    defineEventsComponent.assetName='';//removing value for negative testcase
    defineEventsComponent.criteriaForCurrentDay="I-L";
    defineEventsComponent.fg.controls.level3.setValue('0');
    defineEventsComponent.fg.controls.level3.setValue('cmu6kor');
    defineEventsComponent.fg.controls.per.setValue('1','d');
    defineEventsComponent.usersList=getUsers;

    defineEventsComponent.PostData();
    fixture.detectChanges(); 
    expect(defineEventsComponent.stop).toBe(true);//expecting the request method
  });

/******************************************************************************************/

  //calling reset() function
  it(`calling reset() function`, () => {  
    const alertsNotifServiceComponent = fixture.debugElement.injector.get(AlertsNotifServiceComponent);
    const defineEventsComponent = fixture.debugElement.injector.get(DefineEventsComponent);

    defineEventsComponent.reset();
    fixture.detectChanges(); 
    expect(defineEventsComponent.reset).toHaveBeenCalled;//expecting the request method
  });

  /******************************************************************************************/

  //calling level1() function - value='0'
  it(`calling level1() function`, () => {  
    const alertsNotifServiceComponent = fixture.debugElement.injector.get(AlertsNotifServiceComponent);
    const defineEventsComponent = fixture.debugElement.injector.get(DefineEventsComponent);

    defineEventsComponent.Level1('0');
    defineEventsComponent.fg.controls.level11.setValue('0');
    defineEventsComponent.fg.controls.level12.setValue('0');
    fixture.detectChanges(); 
    expect(defineEventsComponent.Level1).toHaveBeenCalled;//expecting the request method
  });

  //calling level1() function - value=''
  it(`calling level1() function`, () => {  
    const alertsNotifServiceComponent = fixture.debugElement.injector.get(AlertsNotifServiceComponent);
    const defineEventsComponent = fixture.debugElement.injector.get(DefineEventsComponent);

    defineEventsComponent.Level1('');
    fixture.detectChanges(); 
    expect(defineEventsComponent.Level1).toHaveBeenCalled;//expecting the request method
  });


  /******************************************************************************************/

  //calling level11() function - value='0'
  it(`calling level11() function`, () => {  
    const alertsNotifServiceComponent = fixture.debugElement.injector.get(AlertsNotifServiceComponent);
    const defineEventsComponent = fixture.debugElement.injector.get(DefineEventsComponent);

    defineEventsComponent.Level11('0');
    defineEventsComponent.fg.controls.level1.setValue('0');
    defineEventsComponent.fg.controls.level12.setValue('0');
    fixture.detectChanges(); 
    expect(defineEventsComponent.Level11).toHaveBeenCalled;//expecting the request method
  });

  //calling level11() function - value=''
  it(`calling level11() function`, () => {  
    const alertsNotifServiceComponent = fixture.debugElement.injector.get(AlertsNotifServiceComponent);
    const defineEventsComponent = fixture.debugElement.injector.get(DefineEventsComponent);

    defineEventsComponent.Level11('');
    fixture.detectChanges(); 
    expect(defineEventsComponent.Level11).toHaveBeenCalled;//expecting the request method
  });


  /******************************************************************************************/


  //calling level12() function - value='0'
  it(`calling level12() function`, () => {  
    const alertsNotifServiceComponent = fixture.debugElement.injector.get(AlertsNotifServiceComponent);
    const defineEventsComponent = fixture.debugElement.injector.get(DefineEventsComponent);

    defineEventsComponent.Level12('0');
    defineEventsComponent.fg.controls.level1.setValue('0');
    defineEventsComponent.fg.controls.level11.setValue('0');
    fixture.detectChanges(); 
    expect(defineEventsComponent.Level12).toHaveBeenCalled;//expecting the request method
  });

  //calling level12() function - value=''
  it(`calling level12() function`, () => {  
    const alertsNotifServiceComponent = fixture.debugElement.injector.get(AlertsNotifServiceComponent);
    const defineEventsComponent = fixture.debugElement.injector.get(DefineEventsComponent);

    defineEventsComponent.Level12('');
    fixture.detectChanges(); 
    expect(defineEventsComponent.Level12).toHaveBeenCalled;//expecting the request method
  });



  /***********************************************************************************/

  //calling level2() function - value='0'
  it(`calling level2() function`, () => {  
    const alertsNotifServiceComponent = fixture.debugElement.injector.get(AlertsNotifServiceComponent);
    const defineEventsComponent = fixture.debugElement.injector.get(DefineEventsComponent);

    defineEventsComponent.Level2('0');
    fixture.detectChanges(); 
    expect(defineEventsComponent.Level2).toHaveBeenCalled;//expecting the request method
  });

  //calling level2() function - value=''
  it(`calling level2() function`, () => {  
    const alertsNotifServiceComponent = fixture.debugElement.injector.get(AlertsNotifServiceComponent);
    const defineEventsComponent = fixture.debugElement.injector.get(DefineEventsComponent);

    defineEventsComponent.Level2('');
    fixture.detectChanges(); 
    expect(defineEventsComponent.Level2).toHaveBeenCalled;//expecting the request method
  });


  /*******************************************************************************************/

  //calling onChange() function
  it(`calling onChange() function`, () => {  
    const alertsNotifServiceComponent = fixture.debugElement.injector.get(AlertsNotifServiceComponent);
    const defineEventsComponent = fixture.debugElement.injector.get(DefineEventsComponent);
    let mrChange: MatRadioChange;

    mrChange={
      value:"has value",
      source:null
    }

    defineEventsComponent.onChange(mrChange);
    fixture.detectChanges(); 
    expect(defineEventsComponent.onChange).toHaveBeenCalled;//expecting the request method
  });


   /*******************************************************************************************/

let mrChange: MatRadioChange[];
mrChange=[{
  value:"D-L",
  source:null
},
{
  value:"I-L",
  source:null
},{
  value:"A-O",
  source:null
},
{
  value:"U-L",
  source:null
}
]
  //calling onChange1() function
  it(`calling onChange1() function`, () => {  
    const alertsNotifServiceComponent = fixture.debugElement.injector.get(AlertsNotifServiceComponent);
    const defineEventsComponent = fixture.debugElement.injector.get(DefineEventsComponent);
    
    for(let i of mrChange)
    defineEventsComponent.onChange1(i);
    fixture.detectChanges(); 
    expect(defineEventsComponent.onChange1).toHaveBeenCalled;
  });



let mrChange2: MatRadioChange[];
mrChange2=[{
  value:"D-D",
  source:null
},
{
  value:"E-D",
  source:null
},
{
  value:"U-LT",
  source:null
}
]
  //calling onChange2() function
  it(`calling onChange2() function`, () => {  
    const alertsNotifServiceComponent = fixture.debugElement.injector.get(AlertsNotifServiceComponent);
    const defineEventsComponent = fixture.debugElement.injector.get(DefineEventsComponent);
    
    for(let i of mrChange2)
    defineEventsComponent.onChange2(i);
    
    fixture.detectChanges(); 
    expect(defineEventsComponent.onChange2).toHaveBeenCalled;
  });

/**********************************************************************************************/

});
