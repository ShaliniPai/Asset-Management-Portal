import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { TreeviewConfig, TreeviewItem, TreeviewI18n, TreeviewI18nDefault } from 'ngx-treeview';
import { TreeHierarchyService } from '../tree-hierarchy.service';
import { IFTreeHierarchy } from '../TreeViewRadio/treeview-radio.component';

@Component({
  selector: 'app-radio-tree',
  templateUrl: './radio-tree.component.html',
  styleUrls: ['./radio-tree.component.scss'],
  providers: [{
    provide: TreeviewI18n, useValue: Object.assign(new TreeviewI18nDefault(), {
      getFilterPlaceholder(): string {
        return 'Select Asset';
      },
    }
    ),
  }]
})
export class RadioTreeComponent implements OnInit {
  bTreeitems: any[];
  bKey: IFTreeHierarchy;
  @Output() OPEmitSelectedValue = new EventEmitter();
  @Input() IPUsedPage;
  @Input() IPtreeviewHeight;
  @Input() DisableParent: any;
  @Input() OPTreeViewHirarchyModel;
  // @Input()
  // set items(value) {
  //   if (value) {
  //     this.bTreeitems = value;
  //    // this.onGetMachileList([]);
  //     this.ngOnInit();
  //   }
  // }
  // get items() {
  //   return this.bTreeitems;
  // }
  @Input()
  set key(value) {
    if (value) {
      this.bKey = value;
      this.onSetDefaultValue(this.bKey);
    }
  }
  get key() {
    return this.bKey;
  }

  oSelectedValue: IFTreeHierarchy;
  itemsRadio: TreeviewItem[];
  tempData: any[];
  bTreeConfig: any;
  isInitLoad = true;
  constructor(private treeData$: TreeHierarchyService) { }
  ngOnInit() {
    this.onGetMachileList();
    this.bTreeConfig = TreeviewConfig.create({
      hasAllCheckBox: false,
      hasFilter: true,
      decoupleChildFromParent: false,
      hasCollapseExpand: false,
      maxHeight: this.IPtreeviewHeight || 1550
    });
    // this.items_radio = t.map(ele => new TreeviewItem(ele));
    //   },
    //   error => console.error(error)
    // );

  }
  onChange(value) {
    if (value) {
      console.log(value);
      this.OPEmitSelectedValue.emit(value);
    }
  }

  // onGetMachileList(defaultItems: any[]) {
  //   // this.realtime$.fs_machineInfoUsingTenantID('machinesList').subscribe(
  //   //   (data: any[]) => {
  //   const t = this.bTreeitems;
  //   this.funRecursive(defaultItems, this.bTreeitems);
  //   this.items_radio = t.map(ele => new TreeviewItem(ele));
  //   //   },
  //   //   error => console.error(error)
  //   // );
  // }

  onGetMachileList() {
    // this.realtime$.fs_machineInfoUsingTenantID('machinesList').subscribe(
    //   (data: any[]) => {
    this.treeData$.SgetTreeviewData(this.OPTreeViewHirarchyModel, data => {
      // this.bTreeitems;
      const temp = data;
      this.funRecursive([], temp);
      this.itemsRadio = temp.map(ele => new TreeviewItem(ele));
      // Adding new item for disable the parent radio button in defined events page
      this.itemsRadio[0]['Disable_parent'] = this.DisableParent;
    });
    //   },
    //   error => console.error(error)
    // );
  }


  /**
   * This recursive function will help us to save the date based on login user selected machines
   * @param item such as favourite selected machines name
   * @param data Machine list tree data
   */
  funRecursive(item: any[], data: any[]) {
    if (data) {
      data.forEach((val, i) => {
        const bool = item.findIndex(ele => ele === val.value);
        // console.log('recursive Vluae : ' + bool, + +' .... ' + JSON.stringify(val));
        val.checked = bool !== -1 ? true : false;
        /**  Help you to collapse at perticular level 
        val.collapsed = val.value.type === 'wing' ? true : false;
        */
        if (val.children) {
          this.funRecursive(item, val.children);
        }
      });
    }
  }

  onSetDefaultValue(value: IFTreeHierarchy) {
    this.oSelectedValue = value;
  }
}

