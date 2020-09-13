import { Injectable } from '@angular/core';
import saveAs from 'file-saver';
import domtoimage from 'dom-to-image';
@Injectable({
  providedIn: 'root'
})
export class ExportAsService {


  constructor() { }
  /**
   * Export Image form DOM
   * @param fileName File Name of Image without extension
   * @param fileData div content using by id
   */
  fs_exportAsImageJPEG(fileName: string, fileData: any) {
    fileName += '.jpeg';
    domtoimage.toBlob(fileData)
      .then((blob) => {
        saveAs(blob, fileName);
      });
  }

  /**
   * Save file
   */
  private saveFile(blobData: any, fileName: string) {
    saveAs(blobData, fileName);
  }
}
