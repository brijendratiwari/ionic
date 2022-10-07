import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-job-posted-success',
  templateUrl: './job-posted-success.page.html',
  styleUrls: ['./job-posted-success.page.scss'],
})
export class JobPostedSuccessPage implements OnInit {

  slideOpts = {
    slidesPerView: 'auto',
    spaceBetween: 30,
    centeredSlides: true,
};

  constructor(public router: Router) { }

  ngOnInit() {
  }

  jobPosted(){
    this.router.navigateByUrl("/home/tabs/sitter-listing");
  }

}
