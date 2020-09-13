import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { TreeviewConfig, TreeviewItem, TreeviewI18n, TreeviewI18nDefault } from 'ngx-treeview';
import { TreeHierarchyService } from '../tree-hierarchy.service';
@Component({
  selector: 'app-checkbox-tree',
  templateUrl: './checkbox-tree.component.html',
  styleUrls: ['./checkbox-tree.component.scss'],
  providers: [{
    provide: TreeviewI18n, useValue: Object.assign(new TreeviewI18nDefault(), {
      getFilterPlaceholder(): string {
        return 'Select Asset';
      },
    }
    ),
  }]
})
export class CheckboxTreeComponent implements OnInit {

  listdDefaultCheckList: any[];
  @Input() OPTreeViewHirarchyModel;
  @Input() OPDefaultCheckList: any[];

  @Output() opTreeSelectedItem = new EventEmitter();
  bTreeConfig = TreeviewConfig.create({
    hasAllCheckBox: false,
    hasFilter: true,
    decoupleChildFromParent: false,
    hasCollapseExpand: false,
    maxHeight: 1550
  });
  value: any[];
  bTreeitems: TreeviewItem[];
  count = 0;
  constructor(private treeData$: TreeHierarchyService) { }

  ngOnInit() {
    this.onGetMachileList();

  }
  /// SRS ID: FD_IMPL_PCE_3_10.2
  onGetMachileList() {
    // this.realtime$.fs_machineInfoUsingTenantID('machinesList').subscribe(
    //   (data: any[]) => {
    this.treeData$.SgetTreeviewData(this.OPTreeViewHirarchyModel, data => {
      // this.bTreeitems;
      const temp = data;
      this.funRecursive([], temp);
      const value = temp.map(ele => new TreeviewItem(ele));
      this.fun_FormatJsonData(value, this.OPDefaultCheckList);
      /// Adding new item for disable the parent radio button in defined events page
      /// this.itemsRadio[0]['Disable_parent'] = this.DisableParent;
    });
    //   },
    //   error => console.error(error)
    // );
  }
  /**
   * 
   * @param value : Set of tree Node lists (Ex: [{text:.. value:.. children:[{....}]}])
   * @param defaultValueListToCheck : Default selection in the treeview (ex : ['45622',46665, 'Gana']).
   * That means, when select will auto happens this list will matches to values in treeview
   */
  fun_FormatJsonData(value: any[], defaultValueListToCheck: any[]) {
    if (defaultValueListToCheck && defaultValueListToCheck.length > 0) {
      const selectedVal = defaultValueListToCheck;
      const treeItmes = value;
      // if (data.result.machines) {
      this.funRecursive(selectedVal, treeItmes);
      // }
      this.bTreeitems = treeItmes.map(ele => new TreeviewItem(ele));
    } else {
      const treeData = value;
      this.funRecursive([], treeData);
      this.bTreeitems = treeData.map(ele => new TreeviewItem(ele));
    }

  }

  /**
   * On Check Tree Item
   * Emit this Value to Parent Compnent
   */
  onCheckTreeItem(ev) {
    if (ev) {
      this.opTreeSelectedItem.emit(ev);
    }
  }

  /**
   * This recursive function will help us to save the date based on login user selected machines
   * @param item such as favourite selected machines name
   * @param data tree data ([text:.., value:.., children[{...}]])
   */
  funRecursive(item: any[], data: any[]) {
    if (data) {
      data.forEach((val, i) => {
        const bool = item.findIndex(ele => ele === val.value.value);
        // console.log('recursive Vluae : ' + bool, + +' .... ' + JSON.stringify(val));
        val.checked = bool !== -1 ? true : false;
        if (val.children) {
          this.funRecursive(item, val.children);
        }
      });
    }
  }
}
