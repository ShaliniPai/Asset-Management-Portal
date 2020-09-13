import { Component, OnInit } from '@angular/core';
import { AuthorizationService } from 'src/app/Core/Service/authorization.service';

@Component({
  selector: 'app-alert-notification',
  templateUrl: './alert-notification.component.html',
  styleUrls: ['./alert-notification.component.scss']
})
export class AlertNotificationComponent implements OnInit {

  constructor(public $auth: AuthorizationService) { }

  ngOnInit() {
  }

}
