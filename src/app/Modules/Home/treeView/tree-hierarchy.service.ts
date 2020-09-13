import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as lodash from 'lodash';
import { IFTree } from './interface.treehierarchy';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TreeHierarchyService {

  private rxAfterAssetInfo = new BehaviorSubject(null);
  rxAfterTreeInit: Observable<any> = this.rxAfterAssetInfo.asObservable();

  treeValue: IFTree[] = [];
  otenantID;
  countLoop = 0;
  treeHierarchy: any[];
  constructor(private http: HttpClient) { }
  SgetTreeviewData(config, callback) {

    this.treeHierarchy = config.dataModel;
    /**
     * Example
     * this.treeHierarchy
     * Here
     * isNotColumn will help to pass the static code that you passed default common for all the places
     * [
     * { valCol: 'tenantId', textCol: 'customer', isNotColumns: true },
     * { valCol: 'zone', textCol: 'zone', isNotColumns: false },
     * { valCol: 'group', textCol: 'group', isNotColumns: false },
     * { valCol: 'location', textCol: 'location', isNotColumns: false },
     * { valCol: 'wing', textCol: 'wing', isNotColumns: false },
     * { valCol: 'assetID', textCol: 'assetID', isNotColumns: false },]
     */
    this.http.get(config.url).subscribe(
      data => {
        const dataChildrens = this.onTreeHierarchy(data);
        callback(dataChildrens);
        this.rxAfterAssetInfo.next(data);
      },
      error => {
        console.error(error);
      }
    );
  }

  onTreeHierarchy(data) {
    this.treeValue = [];
    this.onCreateTree(data);
    const result = this.joinChildrenRecursively(this.treeValue);
    return result;
  }

  private onCreateTree(data: any[]) {
    data.forEach((ele, index) => {
      this.onPushleaf(ele, index);
    });
  }

  private onPushleaf(item: any, index: number) {
    let isInitPush = true;
    this.treeHierarchy.forEach((value, i) => {
      let listVal;
      let listText;
      /// IsNotColumn help us to set hardcoded values / static values
      if (value.isNotColumns && value.isNotColumns === true) {
        listVal = value.valCol;
        listText = value.textCol;
      } else {
        listVal = item[value.valCol];
        listText = item[value.textCol];
      }
      const tempD = { text: '', value: { value: '', type: '' }, children: [] };
      // loop through same loop to set values
      tempD.text = listText;
      tempD.value.value = listVal;
      tempD.value.type = value.valCol;
      this.treeHierarchy.forEach(colRes => {
        if (colRes.isNotColumns === true) {
          tempD.value[colRes.valCol] = colRes.valCol;
        } else {
          tempD.value[colRes.valCol] = item[colRes.valCol];
        }
      });
      if (this.treeHierarchy.length !== i + 1) {
        tempD.children = [{}];
      }
      if (isInitPush) {
        this.treeValue.push(tempD);
        isInitPush = false;
        i = 1;
      }

      switch (i) {
        case 1:
          this.treeValue[index].children[0] = tempD;
          break;
        case 2:
          this.treeValue[index].children[0].children[0] = tempD;
          break;

        case 3:
          this.treeValue[index].children[0].children[0].children[0] = tempD;
          break;
        case 4:
          this.treeValue[index].children[0].children[0].children[0].children[0] = tempD;
          break;
        case 5:
          this.treeValue[index].children[0].children[0].children[0].children[0].children[0] = tempD;
          break;
        case 6:
          this.treeValue[index].children[0].children[0].children[0].children[0].children[0].children[0] = tempD;
          break;
        case 7:
          this.treeValue[index].children[0].children[0].children[0].children[0].children[0].children[0].children[0] = tempD;
          break;
        case 8:
          this.treeValue[index].children[0].children[0].children[0].children[0].children[0].children[0].children[0].children[0] = tempD;
          break;
      }
    });
  }

  private joinChildren(childrenArray) {
    return lodash.reduce(childrenArray, (memo, o) => {
      const already = lodash.find(memo, (o1) => {
        return o.value.value === o1.value.value;
      });
      return already && o.children ? (already.children = already.children.concat(o.children), memo) : memo.concat(o);
    }, []);
  }

  private joinChildrenRecursively(rootArray) {
    rootArray = this.joinChildren(rootArray);
    lodash.forEach(rootArray, obj => {
      if (lodash.isArray(obj.children)) {
        obj.children = this.joinChildrenRecursively(obj.children);
      }
    });
    return rootArray;
  }

  private onRecLoopChildAppen(item, list, index) {
    if (item.children && item.children.length > 1) {
      this.onRecLoopChildAppen(item.children[0], list, index);
    } else {
      item.children[0] = list;
    }
  }
}
