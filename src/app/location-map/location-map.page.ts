import {
  Component,
  OnInit,
} from "@angular/core";
import {  ActivatedRoute } from "@angular/router";
import { PetcloudApiService } from "../api/petcloud-api.service";
import { Map, tileLayer, marker, icon } from 'leaflet';
declare var google: any;
@Component({
  selector: "app-location-map",
  templateUrl: "./location-map.page.html",
  styleUrls: ["./location-map.page.scss"],
})
export class LocationMapPage implements OnInit {
  map;
  public locationName: any = "";

  constructor(public route: ActivatedRoute, public api: PetcloudApiService) {}

  ngOnInit() {
    this.route.params.subscribe(async (params) => {
      this.locationName = params.locationName;
      if (this.locationName == undefined) {
        this.locationName = "";
      }
      await this.loadMap(params.lat, params.lng);
    });
  }

  ionViewDidLeave() {
    if (this.map) {
      this.map._panes.markerPane.remove();
      this.map.remove();
    }
  }

  /**
   * Load Google Map
   */
  async loadMap(lat, long) {
    this.api.showLoader();
    setTimeout(() => {
      this.api.hideLoader();
      this.map = new Map("map").setView([lat, long], 15);
      tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 18,
        minZoom: 10,
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(this.map);

      marker([lat, long])
        .addTo(this.map)
        .openPopup();
    }, 5000);
  }
}
