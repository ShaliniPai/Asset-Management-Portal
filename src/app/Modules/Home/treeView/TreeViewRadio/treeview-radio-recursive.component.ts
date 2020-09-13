import { Component, EventEmitter, Input, Output, TemplateRef } from '@angular/core';
import { isNil } from 'lodash';
import { TreeviewItem, TreeviewConfig, TreeviewItemTemplateContext } from 'ngx-treeview';

@Component({
  selector: 'app-treeview-radio-recursive',
  templateUrl: './treeview-radio-recursive.component.html',
  styleUrls: ['./treeview-radio-recursive.component.scss']
})
export class TreeviewRadioRecursiveComponent {

  @Input() config: TreeviewConfig;
  @Input() template: TemplateRef<TreeviewItemTemplateContext>;
  @Input() item: TreeviewItem;
  @Output() checkedChange = new EventEmitter<boolean>();

  constructor(
    private defaultConfig: TreeviewConfig
  ) {
    this.config = this.defaultConfig;
  }

  onCollapseExpand = () => {
    this.item.collapsed = !this.item.collapsed;
  }

  onCheckedChange = () => {
    const checked = this.item.checked;
    if (!isNil(this.item.children) && !this.config.decoupleChildFromParent) {
      this.item.children.forEach(child => child.setCheckedRecursive(checked));
    }
    this.checkedChange.emit(checked);
  }

  onChildCheckedChange(child: TreeviewItem, checked: boolean) {
    if (!this.config.decoupleChildFromParent) {
      let itemChecked: boolean = null;
      for (const childItem of this.item.children) {
        if (itemChecked === null) {
          itemChecked = childItem.checked;
        } else if (itemChecked !== childItem.checked) {
          itemChecked = undefined;
          break;
        }
      }

      if (itemChecked === null) {
        itemChecked = false;
      }

      if (this.item.checked !== itemChecked) {
        this.item.checked = itemChecked;
      }

    }

    this.checkedChange.emit(checked);
  }
}
