export interface IFTreeHierarchy {
    text: string;
    value: string;
    type: string;
}

export interface IFTree {
    text?: string;
    value?: any;
    children?: IFTree[];
}
/**
 * @url : URl that return the data for treeview
 * @dataModel : Defile the levels, that you are going to draw in tree (Max is 8) each row will be consider as one level.
 * @valCol : dataModel.valCol : This is value will return when select checkbox/radio 
 * @textCol :  dataModel.textCol  this is the text will terun when select chekbox/radio
 * @isNotColumns : dataModel.isNotColumns, This will deside when you are looking for any static values as it is enterned
 * into the valcol as value and textcol as text for treeview
 */
export interface IFTreeConfigDataModel {
    url: string;
    dataModel: IFTreedataModel[];
}


export interface IFTreedataModel {
    valCol: any;
    textCol: any;
    isNotColumns?: boolean;
}
