import { Component, OnInit } from '@angular/core';
import { NavParams } from '@ionic/angular';
import { PetcloudApiService } from '../../api/petcloud-api.service';

@Component({
  selector: 'app-report-listing',
  templateUrl: './report-listing.component.html',
  styleUrls: ['./report-listing.component.scss'],
})
export class ReportListingComponent implements OnInit {
  selectedIssue: string = "";
  isOtherIssueVisible: boolean = false;
  isSomethingElseSelected: boolean = true;
  constructor(private navParams: NavParams,public api: PetcloudApiService) {
      this.isOtherIssueVisible = false
   }

  ngOnInit() {

  }

  public issues = [{
    id:0,
    title: "It's not a real place to stay",
  },{
    id:1,
    title: "It's a scam"
  },{
    id:2,
    title: "It's offensive"
  },{
    id:3,
    title: "It's something else"
  }];

  public otherIssue = [{
    id:4,
    title:"Something on this page is broken."
  },{
    id:5,
    title:"It doesn't look clean or safe"
  },{
    id:6,
    title:"It's a duplicate listing"
  }];

  closeModal(){
    this.api.dismissModelorAlert();
  }

  getIssueSelected(issue){

    issue.id >= 3 ? this.isOtherIssueVisible = true :  this.isOtherIssueVisible = false
    this.selectedIssue = issue.title
  }

  reportReport() {

    const reportIssue = {
      userId: this.navParams.get("userId"),
      reason:this.selectedIssue
    }
    this.api.showLoader();
    this.api.reportListing(reportIssue).subscribe((response:any)=>{
      this.api.hideLoader();
      this.api.showToast(response.message,3000,"bottom");
      this.closeModal();

    },err=>{
        this.api.autoLogout(err,reportIssue);
    })
  }

}
