import { Component, OnInit } from '@angular/core';
import { Route } from '@angular/compiler/src/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-guides',
  templateUrl: './guides.page.html',
  styleUrls: ['./guides.page.scss'],
})
export class GuidesPage implements OnInit {

  listings = [{title: 'Preparing your Pet for a Pet Stay',routeName:""},
  {title: 'Pet Stay Packing List',routeName:""},
  {title: 'RSPCA Safe Property Guide',routeName:""},
  {title: 'House Sitting Welcome Guide & Guest Rules',routeName:""}]
  constructor(public router: Router) { }

  ngOnInit() {
  }

  goToCMSPage(pageName){
    this.router.navigate(["/cms"], {
      queryParams: { title: pageName },
    });
  }

}
