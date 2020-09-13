import { Component, OnInit } from '@angular/core';
import { Router} from '@angular/router';

@Component({
    selector: 'app-phantom',
    templateUrl: './home.html',
    styleUrls: ['./home.component.scss']
})
export class HomeMainComponent implements OnInit {
    showSpinner: Boolean = true;
    constructor(private router$: Router) {
        // this.router$.events.subscribe((routerEvent: Event) => {
        //     if (routerEvent instanceof (NavigationStart)) {
        //         this.showSpinner = true;
        //     }
        //     if (routerEvent instanceof (NavigationEnd) ||
        //         routerEvent instanceof (NavigationCancel) ||
        //         routerEvent instanceof (NavigationError)) {
        //         this.showSpinner = false;
        //     }
        // });
    }
    ngOnInit() {}
}


