import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-post-a-spot',
  templateUrl: './post-a-spot.page.html',
  styleUrls: ['./post-a-spot.page.scss'],
})
export class PostASpotPage implements OnInit {

  public selectedSpot : any = "";
  public spots = [{
    label: "Accommodation",
    value: 3710
  }, {
    label: "Cafes & Pubs",
    value: 57
  }, {
    label: "Experiences & Activities",
    value: 3716

  }, {
    label: "Services",
    value: 36
  }, {
    label: "Events",
    value: 56
  }, {
    label: "Parks and Beaches",
    value: 58
  }]
  constructor(public router: Router) { }

  ngOnInit() {
  }

  onChangeSpot(event){
    this.selectedSpot = event.detail.value;
  }

  submit(){
    this.router.navigate(["/add-directory-listing"], {
      queryParams: {spot:this.selectedSpot},
    });
  }

}
