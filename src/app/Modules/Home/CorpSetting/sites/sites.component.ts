import { Component, OnInit } from '@angular/core';
import { ClassSites } from 'src/app/Core/Class/class.sites';

@Component({
  selector: 'app-sites',
  templateUrl: './sites.component.html',
  styleUrls: ['./sites.component.scss']
})
export class SitesComponent implements OnInit {

  sites: ClassSites;
  isManageUnabled: boolean;
  constructor() { }
  ngOnInit() {
    /// Shout cut for rediect page to creae/view
    // this.isManageUnabled = true;
  }

  onEmitterSitesInfo(row: any) {
    this.sites = row;
    this.isManageUnabled = true;
  }
  onBack() {
    this.sites = null;
    this.isManageUnabled = false;
  }
  onAddSite() {
    this.isManageUnabled = true;
  }
}
