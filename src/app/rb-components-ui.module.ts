import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RbUiComponentsModule } from '@inst-iot/bosch-angular-ui-components';


@NgModule({
  imports: [
    RbUiComponentsModule
  ],
  exports: [
    RbUiComponentsModule
  ]
})
export class RbComponentsUIModule { }
