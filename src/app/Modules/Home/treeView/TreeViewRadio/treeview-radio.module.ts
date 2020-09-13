import { NgModule } from '@angular/core';
import { TreeviewRadioComponent } from './treeview-radio.component';
import { TreeviewRadioRecursiveComponent } from './treeview-radio-recursive.component';
import { TreeviewModule } from 'ngx-treeview';
// import { TreeviewRadioParserService } from './treeview-radio-parser.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatRadioModule } from '@angular/material/radio';
import { RadioTreeComponent } from '../radio-tree/radio-tree.component';
import { HttpClientModule } from '@angular/common/http';
import { CheckboxTreeComponent } from '../checkbox-tree/checkbox-tree.component';

@NgModule({
  imports: [
    TreeviewModule.forRoot(),
    FormsModule,
    CommonModule,
    MatRadioModule, HttpClientModule
  ],
  declarations: [
    TreeviewRadioComponent,
    TreeviewRadioRecursiveComponent,
    RadioTreeComponent,
    CheckboxTreeComponent
  ],
  exports: [TreeviewRadioComponent, RadioTreeComponent, CheckboxTreeComponent],
  providers: []
})
export class TreeviewRadioModule { }
