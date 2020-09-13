import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-view-user-details',
  templateUrl: './view-user-details.component.html',
  styleUrls: ['./view-user-details.component.scss']
})
export class ViewUserDetailsComponent implements OnInit {
  _ModuleType;
  onEmit_TreeRadio;
  childmessage;
  constructor() { }

  ngOnInit() {
  }

}
