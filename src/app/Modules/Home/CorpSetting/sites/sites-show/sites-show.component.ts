import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ClassSites } from 'src/app/Core/Class/class.sites';
import { SitesService } from 'src/app/Core/Service/sites.service';
import { RbSpinnerService } from 'src/app/Core/Service/rb-spinner.service';

@Component({
  selector: 'app-sites-show',
  templateUrl: './sites-show.component.html',
  styleUrls: ['./sites-show.component.scss']
})
export class SitesShowComponent implements OnInit {

  @Output() siteEmit = new EventEmitter();
  Sites: ClassSites[];
  tbColumns = ['sno', 'zone', 'name', 'view'];
  zoneFilter: any[];
  siteFilter: any[];
  itemsSiteFitler: any[];
  itemsZoneFitler: any[];
  allZoneFilter: any[];
  allSiteFilter: any[];
  /// Backup Variable when do filter from table
  backupSites: ClassSites[];
  constructor(private self$: SitesService, private spinner: RbSpinnerService) { }

  ngOnInit() {
    /** Load the Sites on Page load */
    this.onLoadSites();
  }

  /**
   * Default call to load when page load
   */
  onLoadSites() {
    this.onSpinner(true);
    this.self$.getSites().subscribe(
      (res: any[]) => {
        const temp = res.map(ele => new ClassSites(ele));
        this.Sites = temp.sort(function(a, b) {
          return (a.zone.toLowerCase() > b.zone.toLowerCase()) ? 1
            : ((a.zone.toLowerCase() === b.zone.toLowerCase()) ? ((a.siteName.toLowerCase() > b.siteName.toLowerCase()) ? 1 : -1) : -1);
        });

        this.onConfigFilter(this.Sites);
        this.onSpinner(false);
      },
      err => {
        console.log(err);
        this.onSpinner(false);
      });
  }

  onView(row: ClassSites) {
    console.log(row);
    
    this.siteEmit.emit(row);
  }

  /**
   * Fitler the table based on selection
   */
  onFilterChange() {
    const zonedata = [];
    const data = [];
    /// Level 1 : Check first any zones are selected
    this.itemsZoneFitler.forEach(ele => {
      this.backupSites.forEach((row) => {
        if (row.zone === ele) {
          zonedata.push(row);
        }
      });
    });
    /// Level 2 : Check selecond any sitenames are selected
    this.itemsSiteFitler.forEach(ele => {
      zonedata.forEach((row) => {
        if (row.siteName === ele) {
          data.push(row);
        }
      });
    });

    /// Check the All checkbox when all the items selected
    if (this.siteFilter.length === this.itemsSiteFitler.length) {
      this.allSiteFilter = ['all'];
    } else {
      this.allSiteFilter = [];
    }
    if (this.zoneFilter.length === this.itemsZoneFitler.length) {
      this.allZoneFilter = ['all'];
    } else {
      this.allZoneFilter = [];
    }
    this.Sites = [...data];
  }

  /**
   * COnfig the fitler items
   * @param data Data that are going to bind to table
   */
  onConfigFilter(data: ClassSites[]) {
    this.backupSites = data;
    this.siteFilter = data.map(ele => ele.siteName).filter((item, i, source) => source.indexOf(item) === i).sort();
    this.zoneFilter = data.map(ele => ele.zone).filter((val, i, source) => source.indexOf(val) === i).sort();
    this.itemsZoneFitler = this.zoneFilter;
    this.itemsSiteFitler = this.siteFilter;
    this.allSiteFilter = ['all'];
    this.allZoneFilter = ['all'];
  }

  /**
   * Select ALL checkbox (Zone & Sitename)
   * @param col column name when click on select all checkbox
   */
  onFilterSelectAll(col: string) {
    if (col === 'zone') {
      if (this.allZoneFilter && this.allZoneFilter.length) {
        this.itemsZoneFitler = this.backupSites.map(ele => ele.zone).filter((val, i, source) => source.indexOf(val) === i).sort();
      } else {
        this.itemsZoneFitler = [];
      }
    } else {
      if (this.allSiteFilter && this.allSiteFilter.length) {
        this.itemsSiteFitler = this.backupSites.map(ele => ele.siteName).filter((item, i, source) => source.indexOf(item) === i).sort();
      } else {
        this.itemsSiteFitler = [];
      }
    }
    this.onFilterChange();
  }

  /**
   * Return the Image Name when filter applied
   * @param col Column name which is selected
   */
  onImageFitler(col: string): string {
    if (col === 'zone') {
      if (this.allZoneFilter && this.allZoneFilter.length) {
        return 'fillterICON_NoFill';
      }
      return 'filterICON';
    } else {
      if (this.allSiteFilter && this.allSiteFilter.length) {
        return 'fillterICON_NoFill';
      }
      return 'filterICON';
    }
    return 'fillterICON_NoFill';
  }

  onSpinner(bool: boolean) {
    setTimeout(() => {
      this.spinner.onRBSpinner$(bool);
    });
  }

}
