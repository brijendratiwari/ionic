import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { PetcloudApiService } from '../api/petcloud-api.service';

@Component({
  selector: 'app-socailshare',
  templateUrl: './socailshare.component.html',
  styleUrls: ['./socailshare.component.scss'],
})


export class SocailshareComponent implements OnInit {
  public link: any;
  public petImage: any;
  public shareType: any = "";
  public description: any = ""
  public shareURL: any = ""
  constructor(public modal: ModalController,
    public api: PetcloudApiService,
    public navParams: NavParams,
  ) {

    this.link = navParams.get("link");
    if (navParams.get("shareType") == "View Jobs") {
      this.petImage = navParams.get("petImage");
      this.description = navParams.get("description");
      this.shareURL = navParams.get("shareURL");
    } else if (navParams.get("shareType") == "directory-listing-map") {
      this.description = navParams.get("description");
    }
  }

  ngOnInit() {
  }

  closeModal() {
    this.modal.dismiss()
  }

  async share(param) {
    if (param == "fb") {
      if (this.shareType == "View Jobs") {

      
        this.api.shareViaFb(this.description, this.petImage, this.shareURL);
      } else if (this.shareType == "directory-listing-map") {
        this.api.shareViaFb(this.description, null, this.shareURL);
      }

      else {
        this.api.shareViaTwitter(this.description, null, this.shareURL);
      }

    } else if (param == "twitter") {
      if (this.shareType == "View Jobs") {
        this.api.shareViaTwitter(this.description, null, this.shareURL);
      } else if (this.shareType == "directory-listing-map") {
        this.api.shareViaTwitter(this.description, null, this.shareURL);
      } else {
        this.api.shareViaTwitter(this.description, null, this.shareURL);
      }
    } else if (param == "email") {
      if (this.shareType == "View Jobs") {
        this.sendEmail("", "", "Job on PetCloud", this.description + this.shareURL);
      } else if (this.shareType == "directory-listing-map") {
        this.sendEmail("", "", "Listing", this.description);
      } else {
        this.sendEmail("", "", "Pet Sitter", this.link);
      }
    }
    else if (param == "copy") {
      if (this.shareType == "View Jobs") {
        let message = this.description + this.shareURL;
        this.api.shareViaClipBoard(message);
      }
      else if (this.shareType == "directory-listing-map") {
        let message = this.description;
        this.api.shareViaClipBoard(message);
      }
      else {
        this.api.shareViaClipBoard(this.link);
      }
    }
  }

  public async sendEmail(to, cc, subject, body) {
    this.api.sendEmailtoAccounts(to,cc,subject,body)
  }
}

