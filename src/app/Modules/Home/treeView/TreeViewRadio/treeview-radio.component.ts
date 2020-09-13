import { Component, Input, Output, EventEmitter, SimpleChanges, OnChanges, TemplateRef, OnInit } from '@angular/core';
import { isNil, includes } from 'lodash';
import {
  TreeviewItem,
  TreeviewSelection, TreeviewI18n, TreeviewConfig, TreeviewEventParser, TreeviewItemTemplateContext, TreeviewHelper
} from 'ngx-treeview';
import { TreeviewHeaderTemplateContext } from 'ngx-treeview/src/treeview-header-template-context';
import { TreeviewRadioParserService } from './treeview-radio-parser.service';
// import { Tparser } from './Tparser';

class FilterTreeviewItem extends TreeviewItem {
  private readonly refItem: TreeviewItem;
  constructor(item: TreeviewItem) {
    super({
      text: item.text,
      value: item.value,
      disabled: item.disabled,
      checked: item.checked,
      collapsed: item.collapsed,
      children: item.children
    });
    this.refItem = item;
  }

  updateRefChecked() {
    this.children.forEach(child => {
      if (child instanceof FilterTreeviewItem) {
        child.updateRefChecked();
      }
    });

    let refChecked = this.checked;
    if (refChecked) {
      for (const refChild of this.refItem.children) {
        if (!refChild.checked) {
          refChecked = false;
          break;
        }
      }
    }
    this.refItem.checked = refChecked;
  }
}
@Component({
  selector: 'app-treeview-radio',
  templateUrl: './treeview-radio.component.html',
  styleUrls: ['./treeview-radio.component.scss']
})
export class TreeviewRadioComponent implements OnChanges {
  selectedValue;
  @Input() headerTemplate: TemplateRef<TreeviewHeaderTemplateContext>;
  @Input() itemTemplate: TemplateRef<TreeviewItemTemplateContext>;
  @Input() items: TreeviewItem[];
  @Input() config: TreeviewConfig;
  @Output() selectedChange = new EventEmitter<any[]>();
  @Output() filterChange = new EventEmitter<string>();

  @Input() set DefaultSelector(value) {
    if (value) {
      this.itemDefault = value;
      this.onSetDefaultValue();
    }
  }
  get DefaultSelector() {
    return this.itemDefault;
  }
  Disable_parent = false;
  headerTemplateContext: TreeviewHeaderTemplateContext;
  allItem: TreeviewItem;
  filterText = '';
  filterItems: TreeviewItem[];
  selection: TreeviewSelection;
  itemDefault: IFTreeHierarchy;
  constructor(
    public i18n: TreeviewI18n,
    private defaultConfig: TreeviewConfig,
    private eventParser: TreeviewRadioParserService
  ) {
    this.config = this.defaultConfig;
    this.allItem = new TreeviewItem({ text: 'All', value: undefined });
    this.createHeaderTemplateContext();
  }


  ngOninit() {
    // this.selectedValue = 'kl02030001';
    // this.selectedValue = ([{ 'value': 'MangalMac_03', 'text': 'Mangal 0403_MACHINE' }]);
    //console.log({"filter-items":this,items})

  }
  get hasFilterItems(): boolean {

    return !isNil(this.filterItems) && this.filterItems.length > 0;
  }

  get maxHeight(): string {
    return `${this.config.maxHeight}`;
  }

  ngOnChanges(changes: SimpleChanges) {
    const itemsSimpleChange = changes['items'];
    if (!isNil(itemsSimpleChange)) {
      if (!isNil(this.items)) {
        this.updateFilterItems();
        this.updateCollapsedOfAll();
        this.raiseSelectedChange();
      }
    }
    this.createHeaderTemplateContext();
    if (this.items) {
      const getDisableParentValue = (this.items.length > 0) ? this.items[0]['Disable_parent'] : false;
      this.Disable_parent = (getDisableParentValue === true) ? true : false;
    }
  }

  onAllCollapseExpand() {
    this.allItem.collapsed = !this.allItem.collapsed;
    this.filterItems.forEach(item => item.setCollapsedRecursive(this.allItem.collapsed));
  }

  onFilterTextChange(text: string) {
    this.filterText = text;
    this.filterChange.emit(text);
    this.updateFilterItems();
  }

  onAllCheckedChange() {
    const checked = this.allItem.checked;
    this.filterItems.forEach(item => {
      item.setCheckedRecursive(checked);
      if (item instanceof FilterTreeviewItem) {
        item.updateRefChecked();
      }
    });

    this.raiseSelectedChange();
  }

  onItemCheckedChange(item: TreeviewItem, checked: boolean) {
    if (item instanceof FilterTreeviewItem) {
      item.updateRefChecked();
    }

    this.updateCheckedOfAll();
    this.raiseSelectedChange();
  }

  raiseSelectedChange() {
    this.generateSelection();
    const values = this.eventParser.getSelectedChange(this);
    this.selectedChange.emit(values);
  }

  private createHeaderTemplateContext() {
    this.headerTemplateContext = {
      config: this.config,
      item: this.allItem,
      onCheckedChange: () => this.onAllCheckedChange(),
      onCollapseExpand: () => this.onAllCollapseExpand(),
      onFilterTextChange: (text) => this.onFilterTextChange(text)
    };
  }

  private generateSelection() {
    let checkedItems: TreeviewItem[] = [];
    let uncheckedItems: TreeviewItem[] = [];
    if (!isNil(this.items)) {
      const selection = TreeviewHelper.concatSelection(this.items, checkedItems, uncheckedItems);
      checkedItems = selection.checked;
      uncheckedItems = selection.unchecked;
    }

    this.selection = {
      checkedItems: checkedItems,
      uncheckedItems: uncheckedItems
    };
  }

  private updateFilterItems() {
    if (this.filterText !== '') {
      const filterItems: TreeviewItem[] = [];
      const filterText = this.filterText.toLowerCase();
      this.items.forEach(item => {
        const newItem = this.filterItem(item, filterText);
        if (!isNil(newItem)) {
          filterItems.push(newItem);
        }
      });
      this.filterItems = filterItems;
    } else {
      this.filterItems = this.items;
    }

    this.updateCheckedOfAll();
  }

  private filterItem(item: TreeviewItem, filterText: string): TreeviewItem {
    const isMatch = includes(item.text.toLowerCase(), filterText);
    if (isMatch) {
      return item;
    } else {
      if (!isNil(item.children)) {
        const children: TreeviewItem[] = [];
        item.children.forEach(child => {
          const newChild = this.filterItem(child, filterText);
          if (!isNil(newChild)) {
            children.push(newChild);
          }
        });
        if (children.length > 0) {
          const newItem = new FilterTreeviewItem(item);
          newItem.collapsed = false;
          newItem.children = children;
          return newItem;
        }
      }
    }

    return undefined;
  }

  private updateCheckedOfAll() {
    let itemChecked: boolean = null;
    for (const filterItem of this.filterItems) {
      if (itemChecked === null) {
        itemChecked = filterItem.checked;
      } else if (itemChecked !== filterItem.checked) {
        itemChecked = undefined;
        break;
      }
    }

    if (itemChecked === null) {
      itemChecked = false;
    }

    this.allItem.checked = itemChecked;
  }

  private updateCollapsedOfAll() {
    let hasItemExpanded = false;
    for (const filterItem of this.filterItems) {
      if (!filterItem.collapsed) {
        hasItemExpanded = true;
        break;
      }
    }

    this.allItem.collapsed = !hasItemExpanded;
  }

  //#region
  /**
   * Own Custom Settings
  */
  OnclickRadio(value: any, text: any) {
    this.selectedValue = value.value;
    // const type = this.onlevelType(value.value);
    this.selectedChange.emit([{
      value, text
    }]);
  }


  // OnclickRadio(value: any, text: any) {
  //   this.selectedValue = value;
  //  // const type = this.onlevelType(value);
  //   this.selectedChange.emit([{ value: value, text: text, type: type }]);
  // }

  onlevelType(value: string) {
    const split = value.split(' ');
    const company = localStorage.getItem('cmTenantId');
    if (company && company.toString() === value.toString()) {
      return 'industry';
    }
    if (split.length >= 2) {
      let type;
      switch (split[0].toLowerCase().trim()) {
        case 'location': type = 'location'; break;
        case 'plant': type = 'plant'; break;
        case 'group': type = 'group'; break;
        default: type = 'asset'; break;
      }
      return type;
    } else {
      return 'asset';
    }
  }

  onSetDefaultValue() {
    // this.selectedValue = 'MangalMac_03';
    // this.selectedChange.emit([{ 'value': 'MangalMac_03', 'text': 'Mangal 0403_MACHINE', type: 'asset' }]);
    this.selectedValue = this.itemDefault.value;
    this.selectedChange.emit([this.itemDefault]);
  }
  //#endregion

}

export interface IFTreeHierarchy {
  text: string;
  value: string;
  type: string;
}
