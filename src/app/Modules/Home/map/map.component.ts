import { Component, OnInit, NgZone, ElementRef, ViewChild, Output, EventEmitter } from '@angular/core';
import { MouseEvent, MapsAPILoader } from '@agm/core';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {

  @Output() OPmapCoords = new EventEmitter();
  longitude: number;
  latitude: number;
  zoom: number;
  geoCoder: any;
  address: any;

  @ViewChild('search', { static: false }) public searchElementRef: ElementRef;
  constructor(private mapAPILoader: MapsAPILoader, private ngZone: NgZone) { }

  ngOnInit() {
    // load Places Autocomplete
    this.mapAPILoader.load().then(() => {
      this.setCurretLocation();
      // tslint:disable-next-line: new-parens
      this.geoCoder = new google.maps.Geocoder;

      const autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement, {
        types: ['address']
      });
      autocomplete.addListener('place_changed', () => {
        this.ngZone.run(() => {
          // get the place result
          const place: google.maps.places.PlaceResult = autocomplete.getPlace();

          // verify result
          if (place.geometry === undefined || place.geometry === null) {
            return;
          }

          // set latitude, longitude and zoom
          this.latitude = place.geometry.location.lat();
          this.longitude = place.geometry.location.lng();
          this.zoom = 12;
        });
      });
    });
  }
  setCurretLocation() {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(position => {
        this.longitude = position.coords.longitude;
        this.latitude = position.coords.latitude;
        this.zoom = 15;
        // this.getAddress(this.latitude, this.longitude);
      });
    }
  }

  onMarkerDrag(ev: MouseEvent) {
    this.latitude = ev.coords.lat;
    this.longitude = ev.coords.lng;
    // this.getAddress(this.latitude, this.longitude);
  }

  // getAddress(latitude: number, longitude: number) {
  //   this.geoCoder.geocode({ location: { lat: latitude, lng: longitude } }, (results, status) => {
  //     if (status === 'OK') {
  //       if (results[0]) {
  //         this.zoom = 12;
  //         this.address = results[0].formatted_address;
  //       } else {
  //         console.log('No results found');
  //       }
  //     } else {
  //       console.log('Geocoder failed due to: ' + status);
  //     }
  //   });
  // }

  onSumitCoords() {
    this.OPmapCoords.emit({ latitude: this.latitude, longitude: this.longitude });
  }

}
