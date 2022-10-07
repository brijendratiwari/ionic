import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { Router } from "@angular/router";
import { Platform, ToastController } from "@ionic/angular";
import { PetcloudApiService } from "../api/petcloud-api.service";
import { Storage } from "@ionic/storage";
import { User } from "../model/user";
import { finalize } from 'rxjs/operators';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.page.html",
  styleUrls: ["./dashboard.page.scss"],
})
export class DashboardPage implements OnInit {
  services: any;
  serviceName: any;
  @ViewChild("search") public searchElement: ElementRef;

  options = {
    types: ["(regions)"],
    componentRestrictions: { country: "AU" },
    bounds: null,
    fields: null,
    strictBounds: null,
    origin: null
  };

  constructor(
    public storage: Storage,
    private router: Router,
    public toastCtrl: ToastController,
    public api: PetcloudApiService,
    public platform: Platform,
  ) {
    this.backButton();
  }

  ngOnInit() {
     this.getService();
  }


  getService() {
    this.api.showLoader();
    this.api.getDashboardCategories()
    .pipe(finalize(() => {
      this.api.hideLoader();
    })).subscribe((res: any) => {
        if (res.success) {
          this.services = res.categories;
        }else{
          this.api.showToast("No Categories Available", "3000", "bottom");
        }
    }, (err: any) => {
        this.api.autoLogout(err,"")
    })
  }

  handleAddressChange(address) {
    this.storage.get(PetcloudApiService.USER).then((res: User) => {
      if (res != null) {
        this.router.navigate(["/directory-listing-map"], {
          queryParams: {
            categoryId: "",
            lat: address.geometry.location.lat(),
            lng: address.geometry.location.lng(),
          },
        });
      } else {
        this.router.navigateByUrl("/get-started");
      }
    });
  }

  getSelectedservice(service, index) {
    this.storage.get(PetcloudApiService.USER).then((res: User) => {
      if (res != null) {
        this.serviceName = service.serviceName;

        this.services.forEach((element) => {
          if (element.isSelected == true) {
            element.isSelected = false;
          }
        });
        service.isSelected = true;

        const routerLink = service.routerLink;
        if (service.name == "Pet Services") {
          this.router.navigate(["/home/tabs/sitter-listing"]);
        } else if (routerLink != "") {
          this.api.openExteralLinks(routerLink)
        } else {
          this.router.navigate(["/directory-listing"], {
            queryParams: { serviceName: service.name, serviceId: service.id },
          });
        }
      } else {
        this.router.navigateByUrl("/get-started");
      }
    });
  }

  searchAroundMe() {
    this.storage.get(PetcloudApiService.USER).then((res: User) => {
      if (res != null) {
        this.router.navigate(["/directory-listing-map"], {
          queryParams: { serviceName: "all", lat: "", lng: "", categoryId: "" },
        });
      } else {
        this.router.navigateByUrl("/get-started");
      }
    });
  }

  goToService() {
    this.router.navigate(["/directory-listing"], {
      queryParams: { serviceName: this.serviceName },
    });
  }

  backButton() {
    const that = this;
    let lastTimeBackPress = 0;
    const timePeriodToExit = 2000;
    function onBackKeyDown(e) {
      e.preventDefault();
      e.stopPropagation();
      if (that.router.url == "/home/tabs/sitter-listing") {
        if (new Date().getTime() - lastTimeBackPress < timePeriodToExit) {
          navigator["app"].exitApp();
        } else {
          that.presentToast();
          lastTimeBackPress = new Date().getTime();
        }
      }
    }
    document.addEventListener("backbutton", onBackKeyDown, false);
  }

  async presentToast() {
    const toast = await this.toastCtrl.create({
      message: "Press again to exit.",
      duration: 2000,
    });
    toast.present();
  }

  goPreviousPage(){
    this.router.navigateByUrl("/home/tabs/sitter-listing");
  }
}
