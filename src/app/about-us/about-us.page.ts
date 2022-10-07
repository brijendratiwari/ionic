import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-about-us',
  templateUrl: './about-us.page.html',
  styleUrls: ['./about-us.page.scss'],
})
export class AboutUsPage implements OnInit {

  constructor(public router: Router) { }

  ngOnInit() {
  }

  goToCMSPage(pageName) {

    if (pageName == "blog") {
      this.router.navigate(["/blog"]);
    } else if (pageName == "RSPCA Partnership" || pageName == "Social Impact"  ||
     pageName == "How It Works" ||
     pageName =="News & Media" 
     || pageName == "Terms Of Service" 
     || pageName == "Privacy" 
     || pageName == "Services & Prices"
     || pageName == "Pet Owner Reviews"
     ) {
      this.router.navigate(["/cms"], {
        queryParams: { title: pageName },
      });
    }


  }

}
