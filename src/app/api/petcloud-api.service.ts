import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Storage } from "@ionic/storage";
import { AlertController, ToastController, LoadingController, NavController, ModalController, Platform, } from "@ionic/angular";
import { Geolocation } from "@ionic-native/geolocation/ngx";
import { User } from "../model/user";
import { Router } from "@angular/router";
import * as moment from "moment";
import { finalize } from "rxjs/operators";
import { throwError } from 'rxjs';
import { SigninWindowComponent } from '../signin-window/signin-window.component';
import { environment } from "../../environments/environment";
import { InAppBrowser, InAppBrowserOptions } from '@ionic-native/in-app-browser/ngx';
import { Device } from '@ionic-native/device/ngx';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { Clipboard } from '@ionic-native/clipboard/ngx';
import { VerificationpendingComponent } from "../verificationpending/verificationpending.component";
import { FeedbackEmailFormComponent } from "../feedback-email-form/feedback-email-form.component";
import { FirebaseX } from '@ionic-native/firebase-x/ngx';
import { Events } from "../events";

@Injectable({
  providedIn: "root",
})
export class PetcloudApiService {

  private BASE_URL = environment.apiBase;
  public FASTCO_BASEURL = "https://dev.fast.co/api/";
  public FASTCO_KEY = "r4vejz1JBMl5RLZ8YVodgbqy9Xk0Y6OD";
  public isHomeTabsChanged: boolean = false;
  /**
   * Get Mobile Platforms;
   */
  public getPlatform = () => {
    let platform = "";
    if (this.plt.is('ios')) {
      platform = "ios";
    }
    if (this.plt.is('android')) {
      platform = "android";
    }
    if (this.plt.is('mobileweb')) {
      platform = "webmobile";
    }

    return platform
  }

  /**
   * header for pass content types in request
   */
  public header = {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: localStorage.getItem("token") != null ? "Basic " + btoa(localStorage.getItem("token")).slice(0, -1) + "6" : "",
      source: this.getPlatform(),
    },
    params: new HttpParams(),
  };

  private nonAuthHeader = {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      source: this.getPlatform()
    },
    params: new HttpParams(),
  }

  private firebaseHeaders = {
    token: localStorage.getItem("token") != null ? "Basic " + btoa(localStorage.getItem("token")).slice(0, -1) + "6" : "",
    headers: {
      "Content-Type": "application/json",
      Authorization: "key=AAAAoIFfLLM:APA91bGhQmkL-ErjZ2n-Yd2goLb4k65F4wC25DgHqaLEnEQ_RdMkZs61_THy_rkyDtYqN867CsxYQclQjwbn6ZAqVFUntHgXAa9yrFyZd_N5dtdEewYqmeLv6N_QHQ3g81387nzoLLrf",
    },
    params: new HttpParams(),
  };

  private fileHeader = {
    headers: {
      Authorization:
        localStorage.getItem("token") != null ? "Basic " + btoa(localStorage.getItem("token")).slice(0, -1) + "6" : "",
      source: this.getPlatform()
    },
    params: new HttpParams(),
  };
  // private fileUploadHeader: HttpHeaders = new HttpHeaders();

  // static values for local storage in ionic app
  public static USERTOKEN = "userToken";
  public static USER = "user";
  public static STRIPECARD = "stripeCard";
  public static USERTYPE = "userType";
  public static MINDER = "minder";
  public static OWNER = "owner";
  public static SKIPWELCOME = "skipWelcome";
  public static TOTALPOSTEDJOB = "totalPostedJob";
  public static TRAININGDONE = "trainingDone";
  public FRESHDESK_WEB = "  https://community.petcloud.com.au/portal/en/kb/petcloud";
  public static USERBASICINFO = "userBasicInfo";

  public static app_login_analytics = "app_login";
  public static check_availability_analytics = "check_availability";
  public static pet_sitter_detail_analytics = "pet-sitter-detail";
  public static select_amount_analytics = "select_amount";
  public static job_posted_success = "jobpostedsuccess";//done
  public static job_posted_fail = "jobpostedfail";//done
  public static direct_inquiry = "directinquiry";//done
  public static preauthorized = "preauthorized"// done
  public static meetgreetrequest = "requestmeetgreet"
  public static meetgreetcomplete = "meetgreetcomplete"
  public static meetgreetwell = "meetgreetwell";
  public static bookingcomplete = "bookingcomplete"
  public static makepayment = "makepayment"
  public static usedcoupon = "usedcoupon";//done
  public static chatscreen = "chatscreen"; //done
  public static inapp = "in_app_purchase";
  public static purchase = "purchase";
  public AGREEMENT_LINK = "https://community.petcloud.com.au/portal/en/kb/articles/pet-professional-subcontractor-agreement";


  // Listing cateogy to map page data
  public dashboardSelectedServiceListing: any;

  public isEmailVerified: boolean = false;
  public isPhoneVerified: boolean = false;
  public isBackgroundcheck: boolean = false;
  public isWorkPermitted: boolean = false; // Work for Austrialia
  public isAmimalCare: boolean = false;
  public VERIFIED = "Verified";
  isSaveLoginKeyPress = "";
  email = "";
  password = "";
  public petPlaceholderCDN = "https://cdn.petcloud.com.au/img/pet_placeholder.png"
  public noLocationAccess = "Please turn on your device location and PetCloud location Permission's for better search results around you"

  public options: InAppBrowserOptions = {
    location: 'yes',
    hidden: 'no',
    clearcache: 'yes',
    clearsessioncache: 'yes',
    zoom: 'yes',//Android only
    hardwareback: 'yes',
    mediaPlaybackRequiresUserAction: 'no',
    shouldPauseOnSuspend: 'no', //Android only
    closebuttoncaption: 'Close', //iOS only
    disallowoverscroll: 'no', //iOS only
    toolbar: 'yes', //iOS only
    enableViewportScale: 'no', //iOS only
    allowInlineMediaPlayback: 'no',//iOS only
    presentationstyle: 'pagesheet',//iOS only
    fullscreen: 'yes',//Windows only
  };



  // very important and usefull for listing services constants
  public static PETTYPE = {
    1: "Dog",
    2: "Cat",
    3: "Horse",
    4: "Other(Birds,rats)",
    price: "price",
    "Flat rate for all Pets from": "Flat rate for all Pets from"
  };

  public static LISTINGPET = {
    1: "sits_dogs",
    2: "sits_cats",
    3: "sits_horses",
    4: "sits_misc",
    price: "price",
    "Flat rate for all Pets from": "Flat rate for all Pets from"
  };

  public static JOBSTATUS = {
    0: "Disabled",
    1: "Active",
    2: "Completed",
    3: "Expired",
    4: "Paused",
  };

  public static reminderFrequency(frequencyCode: any) {
    let statusName = "";

    switch (frequencyCode) {
      case "0": {
        statusName = "Weekly";
        break;
      }
      case "1": {
        statusName = "FortNightly";
        break;
      }
      case "2": {
        statusName = "Monthly";
        break;
      }
      case "3": {
        statusName = "Quarterly";
        break;
      }
      case "4": {
        statusName = "Half-Yearly";
        break;
      }
      case "5": {
        statusName = "Yearly";
        break;
      }
      case "6": {
        statusName = "Once Off";
        break;
      }
    }
    return statusName;
  }


  public static remindersType(reminderType: any) {
    let statusName = "";

    switch (reminderType) {
      case "0": {
        statusName = "Grooming";
        break;
      }
      case "1": {
        statusName = "Vaccination";
        break;
      }
      case "2": {
        statusName = "General Check Up";
        break;
      }

      case "3": {
        statusName = "(6-8 weeks age) C3 Vaccination";
        break;
      }
      case "4": {
        statusName = "(10-12 weeks age) C3 Vaccination";
        break;
      }
      case "5": {
        statusName = "(14-16 weeks age) C3 Vaccination";
        break;
      }

      case "6": {
        statusName = "Annual Vaccination Booster";
        break;
      }
      case "7": {
        statusName = "Socialisation";
        break;
      }
      case "8": {
        statusName = "Puppy School";
        break;
      }

      case "9": {
        statusName = "Desexing";
        break;
      }
      case "10": {
        statusName = "Microchip";
        break;
      }
      case "11": {
        statusName = "Council";
        break;
      }

      case "12": {
        statusName = "Teeth Descale";
        break;
      }
      case "13": {
        statusName = "Training";
        break;
      }

      case "14": {
        statusName = "Medication";
        break;
      }
      case "15": {
        statusName = "Flea Control";
        break;
      }

      case "16": {
        statusName = "Birthday Pawty!";
        break;
      }
      case "17": {
        statusName = "Exercise";
        break;
      }

      case "18": {
        statusName = "Gut Worming";
        break;
      }
      case "19": {
        statusName = "Heart Worm";
        break;
      }
    }
    return statusName;
  }
  /**
   * Get short Name
   * @param stateId pass status code like '1' for getting Short State Name
   */
  public static getStateName(stateId: any) {
    let longName = "";
    let shortName = "";

    switch (stateId) {
      case 1: {
        longName = "Australian Capital Territory";
        shortName = "ACT";
        break;
      }
      case 2: {
        longName = "New South Wales";
        shortName = "NSW";
        break;
      }
      case 3: {
        longName = "Northern Territory";
        shortName = "NT";
        break;
      }
      case 4: {
        longName = "Queensland";
        shortName = "QLD";
        break;
      }
      case 5: {
        longName = "South Australia";
        shortName = "SA";
        break;
      }
      case 6: {
        longName = "Victoria";
        shortName = "VIC";
        break;
      }
      case 7: {
        longName = "Western Australia";
        shortName = "WA";
        break;
      }
      case 8: {
        longName = "Tasmania";
        shortName = "TAS";
        break;
      }


      default: {
        longName = "Not specified";
        shortName = "non";
        break;
      }
    }
    return shortName;
    //return longName
  }

  //BackButton
  public lastTimeBackPress = 0;
  public timePeriodToExit = 2000;
  public logoutmsg = "Logging Out, Please login again!";
  public static MAPAPIKEY = "AIzaSyA6PHeobaARhtYsbr5Hu8WiXWWJb0kcelc";
  public IMAGEURL = "https://dev.petcloud.com.au/api/image/uploadimage";
  isCalenderUpdated: boolean = false;

  /* Wallet Available Balance */
  public availableBalance: any;

  constructor(
    private http: HttpClient,
    private storage: Storage,
    public toast: ToastController,
    public alert: AlertController,
    public router: Router,
    private model: ModalController,
    public modal1: ModalController,
    protected loading: LoadingController,
    protected navCtrl: NavController,
    private geoLocation: Geolocation,
    public events: Events,
    public iab: InAppBrowser,
    public plt: Platform,
    public device: Device,
    private firebase: FirebaseX,
    public socialSharing: SocialSharing,
    public clipboard: Clipboard,
    public platform: Platform
  ) {

    this.events.subscribe("token", (data) => {
      console.log("token events data", data)
      if (data) {
        localStorage.setItem("token", data);
        this.header.headers.Authorization = localStorage.getItem("token") != null ? "Basic " + btoa(localStorage.getItem("token")).slice(0, -1) + "6" : "",
          this.header.headers.source = this.getPlatform();
      } else {
        this.header.headers.Authorization = localStorage.getItem("token") != null ? "Basic " + btoa(localStorage.getItem("token")).slice(0, -1) + "6" : "",
          this.header.headers.source = this.getPlatform();
      }
    })

    this.storage.get("isLoggedInKeyPressed").then((isKeyPressed) => {
      this.isSaveLoginKeyPress = isKeyPressed;
      if (isKeyPressed) {
        this.storage.get(PetcloudApiService.USER).then((res: User) => {
          this.email = res.email;
          this.storage.set("email", this.email);
        });
        this.storage.get("password").then((res) => {
          this.password = res;
        });
      }
    });
  }

  getDeviceVerison = () => {
    return this.device.version;
  }


  /**
   * Signup user for create new account on petcloud.
   * @param userData pass User data for signup user Ex. first_name,email,password
   * @return Promise promise of received response
   */
  public signupUser(userData: any) {
    return this.http.post(
      this.BASE_URL + "register/register",
      userData,
      this.header
    );
  }

  /**
   * Login user.
   * @param userData Like email,password
   * @return Promise promise of received response
   */
  public loginUser(userData: any) {
    return this.http.post(this.BASE_URL + "login/login", userData, this.header);
  }

  /**
   * Check App Version
   */
  public checkAPPVersion() {
    return this.http.get(this.BASE_URL + "version");
  }

  /**
   * Update Distance
   * @param travel_distance
   */
  public updateDistance(distance) {
    return this.http.post(
      this.BASE_URL + "listing/updatedistance",
      distance,
      this.header
    );
  }

  /**
   * Fast Co Login user.
   * @param userEmail Like identifier(email)
   * @return Promise promise of received response
   */
  public fastCoLogin(userEmail: any) {
    return this.http.post(this.FASTCO_BASEURL + "invite", userEmail);
  }

  /**
     * Activte deactive Listing
     * Service active Deactive API
  Method : POST
  @param service_id:
  @param is_active : active/deactive
     */
  public serviceactivedeactive(serviceParam: any) {
    return this.http.post(
      this.BASE_URL + "service/serviceactivedeactive",
      serviceParam,
      this.header
    );
  }

  /**
   * Logout User
   * @return Promise of received response
   */
  public logoutUser() {
    return this.http.get(this.BASE_URL + "login/logout", this.header);
  }

  /**
       @param booking_id
       @param paymentId
       @param authorization_id
     */
  public successchargeauthPaypal(paypal: any) {
    return this.http.post(
      this.BASE_URL + "paypal/successchargeauth",
      paypal,
      this.header
    );
  }

  /**
   * function can send request for forgot/reset password
   * @param object of forgot password form { email: "your@email.com", token:'4s6d4a4ae8wd4a64a6s65d4sa65' }
   * @returns Response
   */
  public resetPassword(recoverEmail: any) {
    return this.http.post(
      this.BASE_URL + "login/forgot",
      recoverEmail,
      this.header
    );
  }

  /**
   * Return facebook response for signup with facebook
   * @param token : Token received by Facebook
   * @returns Promise of signup with facebook response
   */
  public signupWithFacebook(token: string, deviceId) {
    return this.http.post(
      this.BASE_URL + "register/facebook?token=" + token,
      deviceId,
    );
  }

  /**
   * Login with facebook
   * @param token Token of facebook after authentic user by facebook.
   * @returns promise of send request.
   */
  public loginWithFacebook(deviceId) {
    return this.http.post(this.BASE_URL + "login/facebook", deviceId);
  }


  /**
   * Return apple login response for signup with facebook
   * @param token : Token received by Facebook
   * @returns Promise of signup with facebook response
   */
  public signupWithApple(token: string, deviceDetails) {
    return this.http.post(
      this.BASE_URL + "register/apple?token=" + token,
      deviceDetails,
    );
  }

  /**
   * Login with facebook
   * @param token Token of facebook after authentic user by facebook.
   * @returns promise of send request.
   */
  public loginWithapple(deviceId) {
    return this.http.post(this.BASE_URL + "login/apple", deviceId);
  }

  public authWithGoogle(userDetail) {
    return this.http.post(this.BASE_URL + "login/google", userDetail);
  }

  public sendPush(token: any) {
    return this.http.post(
      "https://fcm.googleapis.com/fcm/send",
      token,
      this.firebaseHeaders
    );
  }

  /**
   * Return Encoded Token for send in all Authenticated Request after Login user.
   */
  public addTokenInHeader() {
    console.log("localstorage", localStorage.getItem("token"));
    this.header.headers["Authorization"] =
      "Basic " + btoa(localStorage.getItem("token")).slice(0, -1) + "6";

  }

  // Destroy token when 401 error comes in mobile.
  public destroyToken401(uId) {
    return this.http.get(this.BASE_URL + "/destroy/" + uId);
  }

  public updateUserProfile(userData: any) {
    // add Authorization token in header
    // return this.http.post(this.BASE_URL + 'users/update', { 'ProfileForm': userData }, this.header);
    return this.http.post(
      this.BASE_URL + "users/update",
      userData,
      this.header
    );
  }

  /**
   * Get user basic details
   * @returns Promise Promise of received response
   */
  public getUserBasicProfile() {
    // add Authorization token in header
    // this.addTokenInHeader();
    return this.http.post(this.BASE_URL + "app/userdetails", {}, this.header);
  }

  /**
 * connect user with stripe account
 * @returns Promise Promise of received response
 */
  public getConnectionStripe(data) {
    return this.http.post(this.BASE_URL + "account/connected_account", data, this.header);
  }

  /**
   * Send Verification code for mobile number verification
   */
  public sendVerificationCodeForMobile(mobileNumber: any, hashCode: any) {
    return this.http.post(
      this.BASE_URL + "users/sendverifysms?mobile=" + mobileNumber, hashCode,
      this.header
    );
  }

  /**
   * Verify code sent in SMS for verification Mobile number
   */
  public verifyCodeForMobile(code: any) {
    return this.http.get(
      this.BASE_URL + "users/verifysms?code=" + code,
      this.header
    );
  }

  public checkVerification() {
    return this.http.get(this.BASE_URL + "users/verification", this.header);
  }

  public backgroundCheck() {
    return this.http.get(this.BASE_URL + "crime/request", this.header);
  }

  public facebookVerify(Id: any) {
    return this.http.post(
      this.BASE_URL + "users/facebookverify",
      Id,
      this.header
    );
  }

  public uploadBackground(Imageparams) {
    return this.http.post(
      this.BASE_URL + "users/uploaddocument",
      Imageparams,
      this.header
    );
  }

  public uploadImagefile(file) {
    return this.http.post(
      this.BASE_URL + "image/uploadpetimage",
      file,
      this.header
    );
  }

  /**
   * Send verification link in email to verify email
   */
  public sendVerificationCodeToEmail(email: any) {
    return this.http.get(
      this.BASE_URL + "register/resendverify?email=" + email,
      this.header
    );
  }

  public uploadProfilePhoto(imgForm: any) {
    this.fileHeader.headers["Authorization"] =
      "Basic " + btoa(localStorage.getItem("token")).slice(0, -1) + "6";
    return this.http.post(
      this.BASE_URL + "users/upload",
      imgForm,
      this.fileHeader
    );
  }

  /**
   *
   * imageData User Image
   * @params data : Base64 Data
   * @params name : image Name
   */
  public userImageUpload(imageData: any) {
    return this.http.post(
      this.BASE_URL + "users/upload",
      imageData,
      this.header
    );
  }

  /**
  *
  * imageData User Image
  * @params image : Base64 Data
  * @params file_name : image Name
  * @params pageside : front/ back
  */
  public uploadDocumentForBank(imageData: any) {
    return this.http.post(
      this.BASE_URL + "users/bankverification",
      imageData,
      this.header
    );
  }

  /**
   * store geolocation lat long in app storage.
   */
  public getGeoLocation() {
    this.geoLocation.getCurrentPosition().then((resp: any) => {
      localStorage.setItem("lat", resp.coords.latitude);
      localStorage.setItem("lng", resp.coords.longitude);
      // store in app storage.
      this.storage.get(PetcloudApiService.USER).then((user: User) => {
        user.latitude = resp.coords.latitude;
        user.longitude = resp.coords.longitude;
      });
    });

    this.storage.get(PetcloudApiService.USER).then((user: User) => {
      if (
        user.latitude == "" ||
        user.longitude == null ||
        user.longitude == "" ||
        user.longitude == null ||
        user.address == "" ||
        user.address == null
      ) {
        user.latitude = user.latitude == null ? "31.2532" : user.latitude;
        user.longitude = user.longitude == null ? "146.9211" : user.longitude;
        user.address =
          user.address == null || user.address == ""
            ? "Kirribilli"
            : user.address;
        // update user object
        this.storage.set(PetcloudApiService.USER, user);
      }
    });
  }

  /**
   * Get Sitters Profile Details
   */
  public getSittersProfileDetails(userId: any = "643") {
    const header = localStorage.getItem("token") != null ? this.header : this.nonAuthHeader;

    return this.http.post(
      this.BASE_URL + "search/view?id=" + userId,
      {},
      header
    );
  }

  /**
   * Get Terms and condition for Application
   */
  public getTermsAndCondition() {
    return this.http.get(this.BASE_URL + "app/getconditions");
  }

  /**
   * Get Privacy Policy for Application
   */
  public getPrivacyPolicy() {
    return this.http.get(this.BASE_URL + "app/getprivacy");
  }

  /**
   * Get Users Pet list
   * @param id pass user id
   * @returns Promise Response of ajax api request.
   */
  public getPetList(id: any) {
    return this.http.post(this.BASE_URL + "pets/list", { id: id }, this.header);
  }

  /**
   * Save new pet
   * @param petData form of quick add pet
   * @return Promise response of ajax api request
   */
  public savePet(petData: any) {
    const quickPetForm = {
      QuickPetForm: petData,
    };
    return this.http.post(
      this.BASE_URL + "pets/create",
      quickPetForm,
      this.header
    );
  }

  /**
   * Delete Pet
   * @param petId pass pet id
   * @return Promise Response of ajax api request
   */
  public deletePet(petId: any) {
    return this.http.get(
      this.BASE_URL + "pets/delete?id=" + petId,
      this.header
    );
  }

  /**
 * Upload ,Update pet image after added pet basic profile.
   * @param petImageFrm pass petimageform
   * @return Promise response of returned ajax request.
   */
  public uploadPetProfilePhoto(petImageFrm: any, petId: any) {
    this.fileHeader.headers["Authorization"] =
      "Basic " + btoa(localStorage.getItem("token")).slice(0, -1) + "6";
    return this.http.post(
      this.BASE_URL + "pets/upload?id=" + petId,
      petImageFrm,
      this.fileHeader
    );
  }

  /**
   * Update Pet Profile Details
   * @param petFrm Pass Form of Pet petId for pet unique id
   * @return Promise Response of Ajax request.
   */
  public updatePetProfile(petFrm: any, petId: any) {
    return this.http.post(
      this.BASE_URL + "pets/update?id=" + petId,
      petFrm,
      this.header
    );
  }

  /**
   * Get Pet information from api
   * use this as show pet details of get pet details
   * @param petId pass Pet Id
   * @return Promise respons of Ajax Call
   */
  public getPet(petId: any) {
    return this.http.get(this.BASE_URL + "pets/view?id=" + petId, this.header);
  }

  public saveListingHomeDescription(homeDescriptionFrm: any, spaceId: any) {
    homeDescriptionFrm.allergies =
      homeDescriptionFrm.allergies === true ? "1" : "0";
    homeDescriptionFrm.parvo = homeDescriptionFrm.parvo === true ? "1" : "0";
    homeDescriptionFrm.council_regulations =
      homeDescriptionFrm.council_regulations === true ? "1" : "0";
    homeDescriptionFrm.other_animals =
      homeDescriptionFrm.other_animals === true ? "1" : "0";
    homeDescriptionFrm.secure = homeDescriptionFrm.secure === true ? "Y" : "N";
    homeDescriptionFrm.children_location =
      homeDescriptionFrm.children_location === true ? "Y" : "N";
    const homeDescFrm = {
      Spaces: homeDescriptionFrm,
    };
    const URL =
      spaceId == null || spaceId === ""
        ? this.BASE_URL + "listing/updatespace"
        : this.BASE_URL + "listing/updatespace?id=" + spaceId;
    return this.http.post(URL, homeDescFrm, this.header);
  }

  public saveListingBasicInformation(listingFrm: any) {
    return this.http.post(
      this.BASE_URL + "listing/update",
      listingFrm,
      this.header
    );
  }

  /**
   * Get Spaces Information Home Description
   * get Basic Information
   * get Skills
   * get Home Descriptions
   * Get Spaces Images
   * Get Payout Prefrences
   * Get Services
   * Get Availability
   * @return Promise of ajax Request
   */
  public getListingInfo() {
    return this.http.get(this.BASE_URL + "listing/index", this.header);
  }

  /**
   * Update Skill Details
   * @param skillFrm skill form
   */
  public updateSkills(skillFrm: any) {
    // return this.http.post(this.BASE_URL + 'listing/update', skillFrm, this.header);
    return this.http.post(
      this.BASE_URL + "users/updateskills",
      skillFrm,
      this.header
    );
  }

  /**
   * Get All Pet Breeds Names
   * @return Promise Response of Ajax request.
   */
  public getAllPetBreed() {
    return this.http.get(this.BASE_URL + "pets/petbreeds", this.header);
  }

  /**
   * Remove Listing Space Images.
   * @param imageId pass id of Image
   *@return Promise Reposne of Ajax request.
   */
  public deleteSpaceImage(imageId: any) {
    return this.http.get(
      this.BASE_URL + "listing/removephoto?id=" + imageId,
      this.header
    );
  }

  public getBlog(pagination) {
    return this.http.post(
      this.BASE_URL + "blogarticle/list",
      pagination,
      this.header
    );
  }

  public getBookingCalenderList(data) {
    return this.http.post(
      this.BASE_URL + "booking/listdatefilter",
      data,
      this.header
    );
  }

  public getBookingCalenderDetail(Id) {
    return this.http.get(
      this.BASE_URL + "booking/detailed?id=" + Id,
      this.header
    );
  }

  public getBlogDetails(id) {
    return this.http.get(
      this.BASE_URL + "blogarticle/view?id=" + id,
      this.header
    );
  }

  /**
   * Upload Space Image.
   * @param spaceImgData space form
   */
  public uploadSpaceImage(spaceImg: any) {
    return this.http.post(
      this.BASE_URL + "image/uploadlistingimage",
      spaceImg,
      this.header
    );
  }

  /**
   * Update single Listing Service
   * @param serviceId Service id ('id')
   * @param serviceFrm service form Service Object
   * @return Promise Response of Ajax request
   */
  public updateListingService(serviceId: any, serviceFrm: any) {
    return this.http.post(
      this.BASE_URL + "listing/updateservice?id=" + serviceId,
      serviceFrm,
      this.header
    );
  }



  /**
   * Get Availibility of My Listing
   */
  public getAvailibility(currentMonth) {

    return this.http.get(
      this.BASE_URL + "listing/availability?selectedMonth=" + currentMonth,
      this.header
    );
  }

  /**
   * Update availibility of My Listing.
   * @param availFrm availibility form
   */
  public updateAvailability(availFrm: any) {
    return this.http.post(
      this.BASE_URL + "listing/updateavail",
      availFrm,
      this.header
    );
  }

  /**
   * Get Sitters Nearby
   * @param searchForm pass form of search
   */
  public searchInMap(searchForm: any) {
    return this.http.post(
      this.BASE_URL + "search/map",
      searchForm,
      this.header
    );
  }

  /**
   * Get All services Types
   */
  public getAllService() {
    return this.http.get(this.BASE_URL + "listing/allservices", this.header);
  }

  /**
   * @param id id is passed (Message id)
   */
  public bookingAuthorized(id: any) {
    return this.http.post(
      this.BASE_URL + "messages/bookingauthorized",
      id,
      this.header
    );
  }



  public calculatePreCostPrice(availabilityFrm: any): any {
    const BookingReqFrm = {
      BookingRequestForm: availabilityFrm,
    };
    return this.http.post(
      this.BASE_URL + "booking/calculate",
      BookingReqFrm,
      this.header
    );
  }

  public calcuatePetTaxiFare(data: any) {
    return this.http.post(
      this.BASE_URL + "jobs/calculate",
      data,
      this.header
    );
  }

  /**
   * Send Booking Request
   * @param bookingReqFrm Booking Request From object
   */
  public sendBookingRequestForm(bookingReqFrm: any) {
    return this.http.post(
      this.BASE_URL + "booking/requestbooking",
      bookingReqFrm,
      this.header
    );
  }

  /**
   * Get Inbox Messages.
   */
  public getInboxMessage(offset, status, usertype) {
    return this.http.get(
      this.BASE_URL +
      "messages/list?page=" +
      offset +
      "&status=" +
      status +
      "&usertype=" +
      usertype,
      this.header
    );
  }

  /**
   * Get Message Details.
   */
  public getMessageDetails(bookingId) {
    return this.http.get(
      this.BASE_URL + "booking/details?id=" + bookingId,
      this.header
    );
  }

  /** 
   * @param latlong
   * 
   */

  public getSuburb(lat, long) {
    return this.http.get('https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=' + lat + '&longitude=' + long + '&localityLanguage=en');
  }



  /**
   * bookingId:''(BookingID)required
   * reasonList:''required
   * reason:''required
   */
  public cancelBooking(cancelBookingParams) {
    return this.http.post(
      this.BASE_URL + "messages/cancelbooking",
      cancelBookingParams,
      this.header
    );
  }

  /**
   *
   * @param minderId and User Id
   * Faviourate UnFaviourate Sitter
   */
  public sitterfavourite(favParams: any) {
    return this.http.post(
      this.BASE_URL + "space/sitterfavourite",
      favParams,
      this.header
    );
  }

  /**
   * @param id i.e
   * Lets Meet API
   */
  public letsMeet(id) {
    return this.http.post(this.BASE_URL + "messages/letsmeet", id, this.header);
  }

  /**
   * @param none i.e
   * Lets Meet API
   */
  public acceptJob(id) {
    return this.http.get(this.BASE_URL + "messages/accept/" + id, this.header);
  }

  public acceptEnquiry(id) {
    return this.http.get(this.BASE_URL + "booking/accept/" + id, this.header);
  }

  /**
   * createReview
   * @params rate , bookingID, Message.
   */
  public createReview(reviewParams) {
    return this.http.post(
      this.BASE_URL + "reviews/createreview",
      reviewParams,
      this.header
    );
  }

  /**
   * @param id i.e
   * Skip Meet and Greet    */
  public skipmeetandgreet(id) {
    return this.http.get(
      this.BASE_URL + "messages/skipmeetandgreet/" + id,
      this.header
    );
  }

  /**
   * @param id i.e
   * Authorise booking
   */
  public bookingauthorized(id) {
    return this.http.post(
      this.BASE_URL + "messages/bookingauthorized",
      id,
      this.header
    );
  }

  /**
   * Get Booking Full Name
   * @param statusCode pass status code like 'E' for Enquiry Expired
   */
  public getBookingStatusFullName(statusCode: any) {
    let statusName = "";

    switch (statusCode) {
      case "E": {
        statusName = "Enquiry Expired";
        break;
      }
      case "A": {
        statusName = "Booking Authorized";
        break;
      }
      case "MD": {
        statusName = "Booking Meet and Greet Complete";
        break;
      }
      case "C": {
        statusName = "Booking Complete";
        break;
      }
      case "CURR": {
        statusName = "Booking Occurring Now";
        break;
      }
      case "P": {
        statusName = "Booking Pending";
        break;
      }
      case "M": {
        statusName = "Meet and Greet Pending";
        break;
      }
      case "D": {
        statusName = "Enquiry Declined";
        break;
      }
      case "CAN": {
        statusName = "Booking Cancelled";
        break;
      }
      case "PP": {
        statusName = "Pending Payment";
        break;
      }
      case "L": {
        statusName = "Limbo";
        break;
      }
      case "RA": {
        statusName = "Reoccuring Active";
        break;
      }
      case "J": {
        statusName = "Job Application";
        break;
      }
      case "R": {
        statusName = "Refunded";
        break;
      }
      case "NA": {
        statusName = "Not Available";
        break;
      }
      case "NC": {
        statusName = " Not Compatible";
        break;
      }

      default: {
        statusName = "Not specified";
        break;
      }
    }
    return statusName;
  }

  /**
   * Decline Booking form
   * @param bookingCancelForm pass booking cancel form with 'reason' field
   */
  public bookingDecline(bookingCancelForm: any, id: any) {
    return this.http.post(
      this.BASE_URL + "booking/decline?id=" + id,
      bookingCancelForm,
      this.header
    );
  }

  /**
   * Get My Jobs List.
   */
  public getMyJobs() {
    return this.http.get(this.BASE_URL + "jobs/list", this.header);
  }

  /**
   * Same of My Job List with Pagination
   */
  public getJobList(offSet) {
    return this.http.get(
      this.BASE_URL + "jobs/joblist?offset=" + offSet,
      this.header
    );
  }

  /**
   * get Jobs Details
   * @param jobsId Pass job id in query params to get Job Details.
   */
  public jobDetails(jobsId: any) {
    return this.http.get(
      this.BASE_URL + "jobsearch/details?id=" + jobsId,
      this.header
    );
  }

  /**
   * Pause Job (stop job)
   * @param jobsId Pass job id in query params to paus Job.
   */
  public pauseJob(jobsId: any) {
    return this.http.get(
      this.BASE_URL + "jobs/pausejob?id=" + jobsId,
      this.header
    );
  }

  /**
   * Resume Job (restart job)
   * @param jobsId Pass job id in query params to resume Job.
   */
  public resumeJob(jobsId: any) {
    return this.http.get(
      this.BASE_URL + "jobs/resumejob?id=" + jobsId,
      this.header
    );
  }

  /**
   * check total application for requested job.
   * @param limit
   * @param page
   */
  public jobApplications(pagination: any = null) {
    return this.http.post(
      this.BASE_URL + "jobs/applications",
      pagination,
      this.header
    );
  }

  /**
   * search job by locations
   * @param searchMapFrm pass jobsearch map parameters
   */
  public jobSearchMap(searchMapFrm: any) {
    return this.http.post(
      this.BASE_URL + "jobsearch/list",
      searchMapFrm,
      this.header
    );
  }

  /**
   * withdraw job user can withdraw job
   * @param id id
   * @param bookingId bookingid (in our json that is jobId)
   * @return Promise response in promise of withdraw job api.
   */
  public jobWithdraw(id: any, bookingId: any) {
    /*const withdraw = {
            id: id,
            bookingId: bookingId
        };*/
    return this.http.get(
      this.BASE_URL + "jobs/withdraw?id=" + id + "&bookingId=" + bookingId,
      this.header
    );
  }

  /**
   * Decline Job
   * @param id job is
   * @param applicationId applicant id
   */
  public jobDecline(id: any, applicationId: any) {
    return this.http.get(
      this.BASE_URL + "jobs/decline?id=" + id + "&applicantId=" + applicationId,
      this.header
    );
  }

  /** Request to meet and greet after job applied.
   * @return JSON promise of response.
   */
  public requestMeetAndGreet(bookingRequestForm: any) {
    return this.http.post(
      this.BASE_URL + "booking/requestmeet",
      bookingRequestForm,
      this.header
    );
  }

  /**
   * Post a new job
   * @param jobpostingFrm job form parameter
   */
  public createJob(jobpostingFrm: any) {
    return this.http.post(
      this.BASE_URL + "jobs/create",
      jobpostingFrm,
      this.header
    );
  }

  /**
   * Show job details
   * @param jobId pass job id tousers/upload get job details.
   */
  public showJobDetails(jobId: any) {
    return this.http.get(
      this.BASE_URL + "jobs/jobsbyid?id=" + jobId,
      this.header
    );
  }

  public ownerdeclinebooking(bookingID: any, cancelreason) {
    return this.http.post(
      this.BASE_URL + "messages/adeclinebooking/" + bookingID,
      cancelreason,
      this.header
    );
  }

  /**
    get latest Sitter
     * @param longitude 
     * @param latitude 
     * @param distance 
    */
  public getlastestSitter(sitterParams) {
    return this.http.post(
      this.BASE_URL + "reviews/getlateststarsitter",
      sitterParams,
      this.header
    );
  }

  /**
   * Request Reference Send Params
   * @param emails pass emails
   * @param emailbody pass emailbody
   */
  public requestReference(emailParams) {
    return this.http.post(
      this.BASE_URL + "reference/referencerequest",
      emailParams,
      this.header
    );
  }

  /**
   * Filter Search API
   * @param jobId pass jobid
   * @param override pass override
   */
  public filterSearchajax(filterParams) {
    return this.http.post(
      this.BASE_URL + "search/filtersearchajax",
      filterParams,
      this.header
    );
  }

  /**
   * apply job
   * @param jobId pass jobid
   * @param override pass override price (compatetive price).
   */
  public applyJob(jobId: any, override: any) {
    return this.http.get(
      this.BASE_URL + "jobs/apply?id=" + jobId + "&override=" + override,
      this.header
    );
  }

  /**
   *
   * @param BookingId as id. (Query Params)
   */
  public ownerconfirmBooking(bookingID: any) {
    return this.http.get(
      this.BASE_URL + "messages/ownerconfirmbooking/" + bookingID,
      this.header
    );
  }

  /**
   * @param BookingId as id. (Query Params)
   * @reason as Reason (POST)
   */
  public ownerCancelBooking(bookingID: any, reason: any) {
    return this.http.post(
      this.BASE_URL + "messages/ownercancelbooking/" + bookingID,
      reason,
      this.header
    );
  }

  /**
   * @param active as id. (Query Params)
   */
  public listingStatus(status) {
    return this.http.post(
      this.BASE_URL + "listing/listingstatus",
      status,
      this.header
    );
  }

  /**
   * Update user payment details
   * @param userFrm User form with payment fields
   */
  public updatePaypal(userFrm: any) {
    return this.http.post(
      this.BASE_URL + "users/paymentdetails",
      userFrm,
      this.header
    );
  }

  /**
 * Update user payment details
 * @param userFrm User form with payment fields
 */
  public stripeCheckoutSession(data) {
    return this.http.post(
      this.BASE_URL + "wallet/checkoutsession",
      data,
      this.header
    );
  }


  /**
   * Update Stripe Details
   * @param bankFrm Bank form with fields
   */
  public updateStripeDetails(bankFrm: any) {
    return this.http.post(
      this.BASE_URL + "users/payoutpreferences",
      bankFrm,
      this.header
    );
  }

  /**
   * Update Card details in Stripe
   * @param cardFrm card form
   */
  public updateCardInStripe(cardFrm: any) {
    return this.http.post(
      this.BASE_URL + "users/paymentmethods",
      cardFrm,
      this.header
    );
  }

  /**
   * Get Favourite sitters
   * @return Promise response of json data
   */
  public getFavouriteSitter() {
    return this.http.get(
      this.BASE_URL + "dashboard/favouritesitters",
      this.header
    );
  }

  /**
   * Get DashboardListing
   * @return Promise response of json data
   */
  public getDashboardCategories() {
    return this.http.get(this.BASE_URL + "wplistings/categories", this.header);
  }

  handleError(error) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    return throwError(errorMessage);
  }

  public getMapPins(params) {
    return this.http.post(this.BASE_URL + "wplistings/mapspin", params, this.header);
  }

  public bookmarkListing(params) {
    return this.http.post(this.BASE_URL + "wplistings/bookmark", params, this.header);
  }

  /**
 * Get DashboardListing
 * @return Promise response of json data
 */
  public getDashboardListing(params) {
    return this.http.post(this.BASE_URL + "wplistings/listings", params, this.header);
  }

  /**
   * Get Users Notifications List
   * @return Promise response of JSON Data {success:boolean,notifications:[]}
   */
  public getNotificationsList(offset) {
    return this.http.get(
      this.BASE_URL + "messages/notifications?offset=" + offset,
      this.header
    );
  }

  /**
   * Delete Messages
   * @return Promise response of JSON Data {success:boolean,error:null,errorNo:null}
   */
  public deleteMessage(messageId: any) {
    return this.http.get(
      this.BASE_URL + "messages/delete?id=" + messageId,
      this.header
    );
  }

  /**
   * Update Notificaion / Message read status.
   * @return Promise response of JSON Data {success:boolean}
   */
  public updateNotificaionReadStatus(notifId: any) {
    return this.http.get(
      this.BASE_URL + "messages/updatenotification/" + notifId,
      this.header
    );
  }

  /**
   * Change user password
   * @param changePassForm change password form
   */
  public changePassword(changePassForm: any) {
    return this.http.post(
      this.BASE_URL + "users/password",
      changePassForm,
      this.header
    );
  }

  /**
   * Change user password
   * @param CancelAccount for cancel Account
   */
  public cancelAccount(cancelAccountForm: any) {
    return this.http.post(
      this.BASE_URL + "users/cancelaccount",
      cancelAccountForm,
      this.header
    );
  }

  /**
     User Notification
     */
  public userNotification(notificationForm: any) {
    return this.http.post(
      this.BASE_URL + "users/usernotifications",
      notificationForm,
      this.header
    );
  }
  /**
   get Otp 
     */
  public getOtp() {
    return this.http.get(
      this.BASE_URL + "users/otp_authentication",
      this.header
    );
  }
  /**
    Otp Verification
     */
  public otpVerification(data) {
    return this.http.post(
      this.BASE_URL + "users/verify_otp",
      data,
      this.header
    );
  }
  /**
   * Recent Jobs Posted
   * @param longitude pass longitude
   * @param latitude pass latitude
   * @param distance pass distance
   */
  public recentJobPosted(recentJobsParams: any) {
    return this.http.post(
      this.BASE_URL + "jobs/recentjobposted",
      recentJobsParams,
      this.header
    );
  }

  /**
   * @param jobId as Query Params
   * Delete Job
   */
  public deleteJob(jobId: any) {
    return this.http.get(
      this.BASE_URL + "jobs/delete?id=" + jobId,
      this.header
    );
  }

  /**
   * Transaction History list
   * @return Promise Transaction history list in JSON format
   */
  public transactionHistory() {
    return this.http.get(
      this.BASE_URL + "account/transactionhistory",
      this.header
    );
  }

  /**
   * Invite Friend to refer
   * @param inviteFriendFrm invite and refer friend
   */
  public inviteFriend(inviteFriendFrm: any) {
    return this.http.post(
      this.BASE_URL + "referredfriends/invitefriends",
      inviteFriendFrm,
      this.header
    );
  }

  public issueScreenshot(data) {
    return this.http.post(
      this.BASE_URL + "issue/uploadimage",
      data,
      this.header
    );
  }

  /**
   * Save paypal email in data base through API
   */
  public(paypalFrm: any) {
    return this.http.post(
      this.BASE_URL + "account/paypalpaymentdata",
      paypalFrm,
      this.header
    );
  }

  /**
   * Get Count of Posted Job
   */
  postedJobCount = () => {
    this.http.get(this.BASE_URL + "jobs/userpostedjobs", this.header).subscribe(
      (res: any) => {
        console.log("response", res);
        if (res.success) {
          if (res.jobs >= 1) {
            localStorage.setItem(PetcloudApiService.TOTALPOSTEDJOB, res.jobs);
          } else {
            localStorage.setItem(PetcloudApiService.TOTALPOSTEDJOB, "0");
          }
        } else {
          localStorage.setItem(PetcloudApiService.TOTALPOSTEDJOB, "0");
        }
      },
      async (err: any) => {
        localStorage.setItem(PetcloudApiService.TOTALPOSTEDJOB, "0");
      }
    );
  }

  /**
   * Update only User Type
   */
  public updateUserType(userFrm: any) {
    return this.http.post(
      this.BASE_URL + "users/updateuserrole",
      userFrm,
      this.header
    );
  }

  /**
   * Get Recurring Options
   */
  public recurringOptions() {
    return this.http.get(this.BASE_URL + "jobs/recurringoptions", this.header);
  }

  /**
   *
   * Unsuitable Booking
   * @param bookingId  bookingID Query Params
   * @param jobId  jobId Query Params
   * @param declineReason (Optional) POST
   */
  public unsuitableBooking(jobId, bookingId, declineReason) {
    return this.http.post(
      this.BASE_URL +
      "messages/unsuitable?id=" +
      jobId +
      "&bookingId=" +
      bookingId,
      declineReason,
      this.header
    );
  }

  /**
   *
   * Unsuitable Booking
   * @param bookingId  bookingID Query Params
   * @param jobId  jobId Query Params
   */
  public withdrawJob(jobId, bookingId) {
    return this.http.get(
      this.BASE_URL + "jobs/withdraw?id=" + jobId + "&bookingId=" + bookingId,
      this.header
    );
  }

  /**
   * @param bookingID is Query Params
   * date[0][date]:Fri 26 Jul 2019
   * date[0][time]:5:00am
   * location:''(petsittershouse, petownershouse, mutuallocation, other)
   * https://dev.petcloud.com.au/api/messages/meetandgreet/bookingID
   */
  public requestMeetandGreetBooking(bookingID, meetandGreetParams) {
    return this.http.post(
      this.BASE_URL + "messages/meetandgreet/" + bookingID,
      meetandGreetParams,
      this.header
    );
  }

  public addVaccinationAlert(vaccination) {
    return this.http.post(
      this.BASE_URL + "pets/createalert",
      vaccination,
      this.header
    );
  }

  public getVaccinationAlert(id) {
    // pets/getalert?id=
    return this.http.get(this.BASE_URL + "pets/alertlist?id=" + id, this.header);
  }




  public deleteVaccinationRecord(id) {
    return this.http.get(
      this.BASE_URL + "pets/deletealert?id=" + id,
      this.header
    );
  }

  public getUploadedVaccinationRecord(petId) {
    return this.http.get(
      this.BASE_URL + "pets/getvaccination?id=" + petId,
      this.header
    );
  }

  public uploadVaccinationRecord(petId, data) {
    return this.http.post(
      this.BASE_URL + "pets/createvaccination?id=" + petId,
      data,
      this.header
    );
  }

  public uploadInsurancePolicy(petId, data) {
    return this.http.post(
      this.BASE_URL + "pets/createpolicy?id=" + petId,
      data,
      this.header
    );
  }

  public getInsurancePolicy(petId) {
    return this.http.get(
      this.BASE_URL + "pets/getpolicy?id=" + petId,
      this.header
    );
  }

  /**
   * Withdraw Money from Wallet by paypal or bank
   */
  public withdrawMoney(withdraw) {
    return this.http.post(
      this.BASE_URL + "account/paypalpaymentdata",
      withdraw,
      this.header
    );
  }

  public bankDetail() {
    return this.http.get(
      this.BASE_URL + "wallet/ownerdetail",
      this.header
    );
  }

  /**
   * Save paypal email in data base through API
   */
  public savePaypalPaymentData(paypalFrm: any) {
    return this.http.post(
      this.BASE_URL + "account/paypalpaymentdata",
      paypalFrm,
      this.header
    );
  }

  // Owner Charge Booking
  // Get Method Booking Id is Passed..
  public chargeownerbooking(bookingID) {
    return this.http.get(
      this.BASE_URL + "messages/chargeownerbooking/" + bookingID,
      this.header
    );
  }

  public mindermeetngreetdate(bookingDetail) {
    return this.http.post(
      this.BASE_URL + "messages/mindermeetngreetdate",
      bookingDetail,
      this.header
    );
  }
  /**
   * @param amount as query params
   * change booking price..
   */
  editCost(bookingId, amount: any) {
    return this.http.get(
      this.BASE_URL + "booking/editcosts/" + bookingId + "?change=" + amount,
      this.header
    );
  }

  releasePayment(bookingId) {
    return this.http.get(this.BASE_URL + "booking/releasepayment/" + bookingId, this.header);
  }

  /**
   * mindermeetandgreet
   * @param bookingID Query Params
   * @param date = Thu 08 Aug 2019 POST
   * @param time = 5:00am POST
   * @@param location  POST
   */
  public minderMeetandGreet(bookingID, greetingParams) {
    return this.http.post(
      this.BASE_URL + "messages/mindermeetandgreet/" + bookingID,
      greetingParams,
      this.header
    );
  }

  public reviewList(pagination) {
    return this.http.post(
      this.BASE_URL + "reviews/list",
      pagination,
      this.header
    );
  }

  /**
        Parameter:- 
        *@@param lat = '',
        *@param lng = '',
        *@@param location = '',
        *@@param offset = '',
        * @paramlimit = '' 
    */

  public searchSitter(location: any) {
    const header = localStorage.getItem("token") != null ? this.header : this.nonAuthHeader;
    return this.http.post(this.BASE_URL + "search/list", location, header);
  }

  //Click on Awesome meet and greet button
  //Booking Id as Query Param
  public meetandgreetwentwell(bookingID) {
    return this.http.get(
      this.BASE_URL + "booking/meetandgreetwentwell/" + bookingID,
      this.header
    );
  }
  /**
   * cancelreason POST
   * bookingID Query Params
   * Meet and greet not well
   */
  public meetandgreetwentbad(bookingID, cancelReason) {
    return this.http.post(
      this.BASE_URL + "booking/meetandgreetwentbad/" + bookingID,
      cancelReason,
      this.header
    );
  }

  public getSitterFilterDetails() {
    return this.http.get(this.BASE_URL + "search/names", this.header);
  }

  public getBreedName() {
    return this.http.get(this.BASE_URL + "search/breeds", this.header);
  }

  /** Send App Feedback */
  public sendAppFeedback(feedback) {
    return this.http.post(this.BASE_URL + "issue/add", feedback, this.header);
  }

  public getCategoryFilter(param) {
    return this.http.post(this.BASE_URL + "wplistings/listings", param, this.header);
  }

  public getDashboardServices() {
    return this.http.get(this.BASE_URL + "wplistings/categories", this.header);
  }

  public getDashboardListingDetail(listingId) {
    return this.http.get(this.BASE_URL + "wplistings/single_list?listing_id=" + listingId, this.header);
  }

  public listingAddReviews(params) {
    return this.http.post(this.BASE_URL + "wplistings/addreview", params, this.header);
  }

  /** Send App Feedback */
  public policyDetails() {
    return this.http.get(this.BASE_URL + "users/policy", this.nonAuthHeader);
  }

  public getWallet() {
    return this.http.get(this.BASE_URL + "wallet/get", this.header);
  }

  public getWalletTransaction() {
    return this.http.get(this.BASE_URL + "wallet/transaction", this.header);
  }

  public checkfirstPromo() {
    return this.http.get(this.BASE_URL + "wallet/firstpromo", this.header);
  }

  public addCredits(transaction) {
    return this.http.post(
      this.BASE_URL + "wallet/addmoney",
      transaction,
      this.header
    );
  }

  public raiseDispute(transId, disputeParam) {
    return this.http.post(
      this.BASE_URL + "wallet/dispute?id=" + transId,
      disputeParam,
      this.header
    );
  }

  public walletWithdraw(withDrawParam) {
    return this.http.post(
      this.BASE_URL + "wallet/withdrawal",
      withDrawParam,
      this.header
    );
  }

  public getCardList() {
    return this.http.get(this.BASE_URL + "wallet/getcard", this.header);
  }

  public addCardDetail(cardDetail) {
    return this.http.post(
      this.BASE_URL + "wallet/addcard",
      cardDetail,
      this.header
    );
  }

  /* Wallet Delete Card*/
  public deleteCard(cardId) {
    return this.http.post(
      this.BASE_URL + "wallet/deletecard",
      cardId,
      this.header
    );
  }

  /* Wallet Make Default Card*/
  public makeDefaultCard(cardId) {
    return this.http.post(
      this.BASE_URL + "wallet/setdefaultcard",
      cardId,
      this.header
    );
  }

  /*  Bank Payout in Wallet Screen */
  public sendBankPayout(bankValue) {
    return this.http.post(
      this.BASE_URL + "wallet/bankpayout",
      bankValue,
      this.header
    );
  }

  public checkCoupon(couponData) {
    return this.http.post(this.BASE_URL + "wallet/checkcoupon", couponData, this.header);
  }

  /*In addmoney Page*/
  public redeemGiftCard(promoCode) {
    return this.http.get(this.BASE_URL + "wallet/coupon?coupon=" + promoCode, this.header);
  }

  /*  Get Bank Account Last Added */
  public getRecentBank() {
    return this.http.get(this.BASE_URL + "wallet/recentbank", this.header);
  }

  /*  Direct Payment to Bank */
  public directBankPayout(amount) {
    return this.http.post(
      this.BASE_URL + "wallet/directbankpayout",
      amount,
      this.header
    );
  }

  /*  Auto Recharge Wallet */
  public autoRechargeWallet(autoRechargeVal) {
    return this.http.get(
      this.BASE_URL + "wallet/autorecharge?check=" + autoRechargeVal,
      this.header
    );
  }

  /*  Authorize Booking Via Wallet */
  public authorizeBookingViaWallet(messageId) {
    return this.http.post(
      this.BASE_URL + "wallet/authorisebooking", messageId,
      this.header);
  }

  /*  Wallet Check Balance */
  public walletCheckBalance(Id) {
    return this.http.post(
      this.BASE_URL + "wallet/checkwalletbalance", Id,
      this.header);
  }

  /*  Wallet Check Balance Socket */
  public walletCheckBalanceSocket(param) {
    return this.http.post(this.BASE_URL + "wallet/checkwalletbalancesocket", param, this.header);
  }

  /*  Wallet Check Out Socket Balance */
  public walletCheckOutSocket(withDrawParam) {
    return this.http.post(
      this.BASE_URL + "wallet/checkoutsocket",
      withDrawParam,
      this.header
    );
  }

  /* Modify Booking */
  public modifyBooking(requestModifyBooking) {
    return this.http.post(
      this.BASE_URL + "booking/modifybooking", requestModifyBooking,
      this.header
    );
  }

  /* Explore Data API */
  public userExplore(location) {
    const header = localStorage.getItem("token") != null ? this.header : this.nonAuthHeader;
    return this.http.post(this.BASE_URL + "users/exploredata", location, header);
  }

  /* Get Reminders API*/
  public getReminders() {
    return this.http.get(
      this.BASE_URL + "users/reminders",
      this.header
    );
  }

  /* Server Error API.*/
  public serverErrorAPI(error) {
    return this.http.post(
      this.BASE_URL + "error/submit", error,
      this.header
    );
  }

  /* Create Reminder API.*/
  public createReminder(reminderData) {
    return this.http.post(
      this.BASE_URL + "pets/createalert", reminderData,
      this.header
    );
  }

  public getReminderListAlert(pageNo) {
    return this.http.get(
      this.BASE_URL + "pets/petalertlist?page=" + pageNo,
      this.header
    );

  }

  public addChatToPetCloudDB(chatData) {
    return this.http.post(
      this.BASE_URL + "messages/reply/" + chatData.bookingId, chatData,
      this.header
    );
  }

  /*  Wallet Check Balance */
  public addCouponCode(couponCode) {
    return this.http.post(
      this.BASE_URL + "wallet/applyvoucher", couponCode,
      this.header
    );
  }


  /*  Sitter Performance Score API*/
  public dashboardPerformace(serviceId) {
    return this.http.post(
      this.BASE_URL + "dashboard/performance", serviceId,
      this.header
    );
  }

  /*  Report Listing*/
  public reportListing(reportIssue) {
    return this.http.post(
      this.BASE_URL + "listing/reportlisting", reportIssue,
      this.header
    );
  }

  /*  Rate Android and iOS APP*/
  public rateAPP(rate) {
    return this.http.post(
      this.BASE_URL + "users/updateappreview", rate,
      this.header
    );
  }

  /*  Add Pet Report Record */
  public addPetReportRecord(record, bookingId, petId) {
    return this.http.post(
      this.BASE_URL + "reportcard?booking_id=" + bookingId + "&pet_id=" + petId, record,
      this.header
    );
  }


  public getAminities(id) {
    return this.http.get(
      this.BASE_URL + "wplistings/amenities?category=" + id,
      this.header
    );
  }

  public sendFeedbackEmail(feedBackDetails) {
    return this.http.post(
      this.BASE_URL + "feedback", feedBackDetails,
      this.header
    );
  }

  public addDirectoryListing(listingDetails) {
    return this.http.post(
      this.BASE_URL + "wplistings/addlisting", listingDetails,
      this.header
    );
  }

  public async getSuburbName(lat, long) {
    await this.getSuburb(lat, long)
      .subscribe(
        async (response: any) => {
          return response;
        },
        async (err) => {
          await this.autoLogout(err, { lat, long });
        }
      );
  }

  public getRefferalList() {
    return this.http.get(
      this.BASE_URL + "referredfriends/invitelist", this.header)
  }


  /**
  * Calender up to date in availablity screen
  */
  public updateCalendar() {
    return this.http.get(this.BASE_URL + "listing/calendar_uptodate", this.header);
  }

  /**
 * Update calendar availability settings 
 */

  public calenderSettting(data) {
    return this.http.post(
      this.BASE_URL + "listing/calendarsettings", data,
      this.header
    );
  }
  /**
*  get the data of Availability Settings Page.
*/
  public getAvailabilitySettingsData() {
    return this.http.get(this.BASE_URL + "listing/get_settings", this.header);
  }
  /**
*  get  booking details for particular date, month.
*/
  public getBookingDetails(data) {
    return this.http.post(
      this.BASE_URL + "booking/calendar_events", data,
      this.header
    );
  }


  /* Start Helper functions */
  /**
   * Show toast message on screen
   * @param message text message to display in toast
   * @param duration how much time show toast
   * @param position define position like bottom | middle | top
   */
  async showToast(message, duration, position) {
    const toast = await this.toast.create({
      message: message,
      duration: duration,
      position: position,
      color: "dark",
    });
    toast.present();
  }

  /**
   *
   * @param subHeader Text for sub header title
   * @param message Text for show message you want
   * @param buttons array collection for show buttons like "OK" | "Cancel" | "confirm"
   */
  async showAlert(subHeader, message, buttons) {
    const alert = await this.alert.create({
      header: "",
      subHeader: subHeader,
      message: message,
      buttons: buttons,
    });
    await alert.present();
  }

  /**
   * Show loader on any request on any where in application.
   */
  async showLoader() {

    await this.hideLoader()

    const loader = await this.loading.create({
      message: "",
      spinner: "bubbles",
      mode: "md",
      cssClass: "ion-spinner",
      duration: 55000,
      backdropDismiss: true,

    });
    return await loader.present();
  }

  async openExteralLinks(url) {
    const browser = this.iab.create(url, "_system", this.options);
    browser.show()
  }

  /**
   * Hide loader afte completing request on any where in application
   */
  hideLoader() {
    this.loading.getTop().then((loadingPresent) => {
      if (loadingPresent) {
        this.loading.dismiss();
        this.loading.dismiss(true);
      }
    });
  }

  /**
   * Pass a number to return an Array
   * @param num digit of array length of array
   */
  public convertNumberToArray(num: any) {
    return new Array(num);
  }

  /**
   * Global function to find how much steps completed of newly registred user.
   */
  public checkUserProfileSteps(): any {

    if (localStorage.getItem(PetcloudApiService.TOTALPOSTEDJOB) === null) {
      this.postedJobCount();
    }

    return this.storage.get(PetcloudApiService.USER).then(async (userData: User) => {
      const stepList = {
        totalSteps: 0,
        totalCompletedSteps: 0,
        steps: [],
      };

      if (
        userData == null ||
        userData.user_type === null ||
        userData.user_type === ""
      ) {
        this.router.navigateByUrl("/why-join");
      } else {
        if (Number(userData.user_type) === 1) {
          stepList.totalSteps = 5;
        }
        else if (Number(userData.user_type) === 2 || Number(Number(userData.user_type) === 3)) {
          stepList.totalSteps = 5;
        } else {
          stepList.totalSteps = 0;
        }
      }

      if (userData != null) {
        // Create Profile
        if (
          userData.user_type != null &&
          userData.last_name !== "" &&
          userData.address !== "" &&
          userData.street_address !== "" &&
          userData.longitude !== "" &&
          userData.latitude !== "" &&
          userData.gender !== "" &&
          userData.dob !== "" &&
          userData.suburb !== "" &&
          userData.state !== 0 &&
          userData.zipcode !== "" &&
          userData.email !== "" &&
          userData.mobile !== "" &&
          userData.imagename !== ""
        ) {
          stepList.totalCompletedSteps++;
          stepList.steps.push({
            stepIndex: 1,
            stepName: "Create Profile",
            stepRoute: "/basic-info",
            stepStatus: true,
          });
        } else {
          stepList.steps.push({
            stepIndex: 1,
            stepName: "Create Profile",
            stepRoute: "/basic-info",
            stepStatus: false,
          });
        }

        if (Number(userData.user_type) === 1) {
          // Complete Verificaions
          let userEmailVerified: any = await userData.verified;
          if (userEmailVerified != "0" && userData.verify_phoneflag !== "N") {
            stepList.totalCompletedSteps++;
            stepList.steps.push({
              stepIndex: 2,
              stepName: "Complete Verifications",
              stepRoute: "/profile-email-verify",
              stepStatus: true,
            });
          } else {
            stepList.steps.push({
              stepIndex: 2,
              stepName: "Complete Verifications",
              stepRoute: "/profile-email-verify",
              stepStatus: false,
            });
          }
        }

        if (
          Number(userData.user_type) === 2 || Number(userData.user_type) === 3) {
          // Complete Verificaions

          let userEmailVerified: any = await userData.verified;
          if ((userEmailVerified != "0" && userData.verify_phoneflag !== "N") &&
            userData.BackgroundCheck['is_verified'] == this.VERIFIED &&
            userData.righttowork['is_verified'] == this.VERIFIED == true &&
            userData.animalcare['is_verified'] == this.VERIFIED == true
          ) {
            stepList.totalCompletedSteps++;
            stepList.steps.push({
              stepIndex: 2,
              stepName: "Complete Verifications",
              stepRoute: "/profile-email-verify",
              stepStatus: true,
            });
          } else {
            stepList.steps.push({
              stepIndex: 2,
              stepName: "Complete Verifications",
              stepRoute: "/profile-email-verify",
              stepStatus: false,
            });
          }
        }


        // Create Pet's Profile
        if (Number(userData.user_type) === 1) {
          if (userData.petList.length > 0) {
            stepList.totalCompletedSteps++;
            stepList.steps.push({
              stepIndex: 3,
              stepName: "Create Pet's Profile",
              stepRoute: "/pet-add",
              stepStatus: true,
            });
          } else {
            stepList.steps.push({
              stepIndex: 3,
              stepName: "Create Pet's Profile",
              stepRoute: "/pet-add",
              stepStatus: false,
            });
          }
        }

        // Complete Training Course
        if (Number(userData.user_type) === 2 || Number(userData.user_type) === 3) {
          let animalCare: any = userData.animalcare;
          let isVerifed = animalCare.is_verified;
          if (isVerifed == this.VERIFIED) {
            stepList.totalCompletedSteps++;
            stepList.steps.push({
              stepIndex: 4,
              stepName: "Complete Training Course",
              stepRoute: [
                "/live-url",
                "https://www.petcloud.com.au/learning/minding",
              ],
              stepStatus: true,
            });
          } else {
            stepList.steps.push({
              stepIndex: 4,
              stepName: "Complete Training Course",
              stepRoute: [
                "/live-url",
                "https://www.petcloud.com.au/learning/minding",
              ],
              stepStatus: false,
            });
          }
        }
      }


      // Connect Wallet 
      if (Number(userData.user_type) === 1) {

        let isWalletConnected: any = await userData.progress;
        if (isWalletConnected.wallet != 0) {
          stepList.totalCompletedSteps++;
          stepList.steps.push({
            stepIndex: 5,
            stepName: "Add Wallet Credits",
            stepRoute: "/addmoney",
            stepStatus: true,
          });
        } else {
          stepList.steps.push({
            stepIndex: 5,
            stepName: "Add Wallet Credits",
            stepRoute: "/addmoney",
            stepStatus: false,
          });
        }
      }

      // Connect a Credit Card
      // Work fine
      if (
        Number(userData.user_type) === 2 || Number(userData.user_type) === 3
      ) {
        if (
          userData.stripeCardId != null ||
          userData.stripeCustomerId != null
        ) {
          stepList.totalCompletedSteps++;

          stepList.steps.push({
            stepIndex: 6,
            stepName: "Connect Payout Account",
            stepRoute: "/payout-prefrence",
            stepStatus: true,
          });
        } else {
          stepList.steps.push({
            stepIndex: 6,
            stepName: "Connect Payout Account",
            stepRoute: "/payout-prefrence",
            stepStatus: false,
          });
        }
      }

      // Create a Listing
      if (
        Number(userData.user_type) === 2 ||
        Number(userData.user_type) === 3
      ) {
        if (
          (Array.isArray(userData.listing) && userData.listing.length) ||
          (Array.isArray(userData.specialskills) &&
            userData.specialskills.length) ||
          (userData.space === null && userData.spaceImages.length)
        ) {
          stepList.totalCompletedSteps++;
          stepList.steps.push({
            stepIndex: 7,
            stepName: "Create a Listing",
            stepRoute: "/listing",
            stepStatus: true,
          });
        } else {
          stepList.steps.push({
            stepIndex: 7,
            stepName: "Create a Listing",
            stepRoute: "/listing",
            stepStatus: false,
          });
        }
      }


      // Post a Job
      if (Number(userData.user_type) === 1) {
        if (
          Number(localStorage.getItem(PetcloudApiService.TOTALPOSTEDJOB)) > 0
        ) {
          stepList.totalCompletedSteps++;
          stepList.steps.push({
            stepIndex: 10,
            stepName: "Post a Job",
            stepRoute: "/home/tabs/view-job",
            stepStatus: true,
          });
        } else {
          stepList.steps.push({
            stepIndex: 10,
            stepName: "Post a Job",
            stepRoute: "/home/tabs/view-job",
            stepStatus: false,
          });
        }
      }

      return stepList;
    });
  }


  /**
   * Check whether user is new or not
   */
  public async checkIsNewUser() {
    return this.storage
      .get(PetcloudApiService.USER)
      .then(async (userData: User) => {
        if (userData != null) {
          let today = new Date();
          let td = moment(today).format("YYYY-MM-DD");
          if (
            userData.lastCalendarUpdate != null ||
            userData.lastCalendarUpdate != ""
          ) {
            let lastCalenderUpdateDate = moment(
              userData.lastCalendarUpdate
            ).format("YYYY-MM-DD");
            let nextUpdateDate = moment(
              lastCalenderUpdateDate,
              "YYYY-MM-DD"
            ).add(14, "d");
            var day = nextUpdateDate.format("DD");
            var month = nextUpdateDate.format("MM");
            var year = nextUpdateDate.format("YYYY");
          }
          let updateDate = year + "-" + month + "-" + day;

          let returnUrl = "";
          let routeVariable = false;
          if (userData.lastCalendarUpdate != null) {
            await this.calenderUpdate(userData.lastCalendarUpdate, updateDate);
          } else {
            this.isCalenderUpdated = false;
          }

          // Go to Why Join
          if (
            userData != null &&
            (userData.user_type == null || userData.user_type === "")
          ) {
            returnUrl = "/why-join";
          }
          // Basic Info
          else if (userData.mobile == null || userData.mobile == "") {
            returnUrl = "/basic-info";
          }
          // Go to Image Upload.
          else if (userData.imagename == "") {
            returnUrl = "/profile-photo-upload";
          }

          // Go to Verification..
          else if (
            userData.verified == 0 ||
            userData.verify_phoneflag == "N" ||
            !userData.isBackgroundChecked ||
            !userData.isRightToWorkChecked ||
            !userData.isAnimalCareChecked
          ) {
            await this.checkVerification()
              .pipe(finalize(() => { }))
              .subscribe(
                async (res: any) => {
                  this.isEmailVerified = await res.emailVerify.status == "1" ? true : false;
                  this.isPhoneVerified = await res.phoneVerify.verify_phoneflag == "Y" ? true : false;
                  this.isBackgroundcheck = await res.BackgroundCheck.is_verified != "Pending" ? true : false;
                  this.isWorkPermitted = await res.righttowork.is_verified != "Pending" ? true : false;
                  this.isAmimalCare = await res.animalcare.is_verified != "Pending" ? this.isAmimalCare = true : this.isAmimalCare = false;

                  this.storage
                    .get(PetcloudApiService.USER)
                    .then((user: User) => {
                      let background: any = user.BackgroundCheck;
                      let righttowork: any = user.righttowork;
                      let amimalCare: any = user.animalcare;

                      if (this.isPhoneVerified) {
                        user.verify_phoneflag = "Y";
                      }

                      if (this.isEmailVerified) {
                        user.verified = 1;
                      }

                      if (this.isBackgroundcheck) {
                        user.backgroundCheckDocument = true;
                        background.is_verified = "Verified";
                      }

                      if (this.isWorkPermitted) {
                        user.isRightToWorkChecked = true;
                        righttowork.is_verified = "Verified";
                      }

                      if (this.isAmimalCare) {
                        user.isAnimalCareChecked = true;
                        amimalCare.is_verified = "Verified";
                      }

                      this.storage.set(PetcloudApiService.USER, user);
                    });

                  if (
                    this.isEmailVerified &&
                    this.isPhoneVerified &&
                    this.isBackgroundcheck &&
                    this.isWorkPermitted
                  ) {
                    this.storage
                      .get(PetcloudApiService.USER)
                      .then(async (user: User) => {
                        let background: any = user.BackgroundCheck;
                        let righttowork: any = user.righttowork;
                        user.verify_phoneflag = "Y";
                        user.verified = 1;
                        user.backgroundCheckDocument = true;
                        user.isRightToWorkChecked = true;
                        background.is_verified = "Verified";
                        righttowork.is_verified = "Verified";

                        await this.storage.set(PetcloudApiService.USER, user);

                        if (
                          Number(userData.user_type) === 1 ||
                          Number(userData.user_type) === 3
                        ) {
                          if (
                            userData.stripeCustomerId == null &&
                            userData.paypal_email == null
                          ) {
                            this.router.navigate([
                              "/payment-method",
                              { backBtn: true },
                            ]);
                          } else {
                            this.navCtrl.navigateRoot("/home/tabs/sitter-listing");
                          }
                        } else if (
                          Number(userData.user_type) === 2 ||
                          Number(userData.user_type) === 3
                        ) {
                          if (
                            userData.stripeCustomerId == null &&
                            userData.paypal_email == null
                          ) {
                            this.router.navigate([
                              "/payout-prefrence",
                              { backBtn: true },
                            ]);
                          } else {
                            this.navCtrl.navigateRoot("/home/tabs/sitter-listing");
                          }
                        }
                      });
                  } else {
                    this.navCtrl.navigateRoot("/profile-email-verify");
                  }
                },
                (err) => {
                  this.router.navigateByUrl("/home/tabs/sitter-listing");
                }
              );
          }

          // Check Cards For Stipe and paypal..
          else if (
            Number(userData.user_type) === 1 ||
            Number(userData.user_type) === 3
          ) {
            if (
              userData.stripeCustomerId != null ||
              userData.paypal_email != null
            ) {
              if (this.isCalenderUpdated == false) {
                returnUrl = "/availability";
              } else {
                returnUrl = "/home/tabs/sitter-listing";
              }
            } else if (
              userData.stripeCustomerId == null &&
              userData.paypal_email != null
            ) {
              if (this.isCalenderUpdated == false) {
                returnUrl = "/availability";
              } else {
                returnUrl = "/home/tabs/sitter-listing";
              }
            } else if (
              userData.stripeCustomerId != null &&
              userData.paypal_email == null
            ) {
              if (this.isCalenderUpdated == false) {
                returnUrl = "/availability";
              } else {
                returnUrl = "/home/tabs/sitter-listing";
              }
            } else if (
              userData.stripeCustomerId == null &&
              userData.paypal_email == null
            ) {
              returnUrl = "payment-method";
            }

            return returnUrl;
          }

          // Check Card for stripe and Paypal..
          else if (
            Number(userData.user_type) === 2 ||
            Number(userData.user_type) === 3
          ) {
            if (
              userData.stripeCustomerId != null ||
              userData.paypal_email != null
            ) {
              if (this.isCalenderUpdated == false) {
                returnUrl = "/availability";
              } else {
                returnUrl = "/home/tabs/sitter-listing";
              }
            } else if (
              userData.stripeCustomerId == null &&
              userData.paypal_email != null
            ) {
              if (this.isCalenderUpdated == false) {
                returnUrl = "/availability";
              } else {
                returnUrl = "/home/tabs/sitter-listing";
              }
            } else if (
              userData.stripeCustomerId != null &&
              userData.paypal_email == null
            ) {
              if (this.isCalenderUpdated == false) {
                returnUrl = "/availability";
              } else {
                returnUrl = "/home/tabs/sitter-listing";
              }
            } else if (
              userData.stripeCustomerId == null &&
              userData.paypal_email == null
            ) {
              returnUrl = "payout-prefrence";
            }
          }

          // Check Availability..
          else if (
            userData.lastCalendarUpdate == null ||
            userData.lastCalendarUpdate == "" ||
            td > updateDate
          ) {
            returnUrl = "/availability";
          } else {
            returnUrl = "/home/tabs/sitter-listing";
          }
          return returnUrl;
        } else {
        }
      });
  }

  public async autoLogout(err, postData) {
    let userId;
    await this.storage.get(PetcloudApiService.USER).then(
      (user: User) => {
        if (user) {
          userId = user.id;
        }
      });

    if (err.status === 401) {

      await this.storage
        .remove(PetcloudApiService.USERTOKEN)
        .then(async (res: any) => {
          let viewPetJob = localStorage.getItem("viewPetJobs");
          let trainingDone = localStorage.getItem(PetcloudApiService.TRAININGDONE);
          let paymentCardData = "";
          if (this.model) {
            this.model.dismiss();
          }

          this.storage.get(PetcloudApiService.STRIPECARD).then((cardData: any) => {
            if (cardData != null && cardData !== "") {
              paymentCardData = cardData;
            }
          });

          localStorage.setItem("token", "")
          await localStorage.clear();
          this.storage.set("isLoggedInKeyPressed", false);
          this.storage.set("menuType", null);

          viewPetJob == "yes" ? localStorage.setItem("viewPetJobs", "yes") : "";
          trainingDone == "yes"
            ? localStorage.setItem(PetcloudApiService.TRAININGDONE, "yes")
            : "";

          if (paymentCardData != null) {
            this.storage.set(PetcloudApiService.STRIPECARD, paymentCardData);
          }

          if (this.isSaveLoginKeyPress) {
            await this.storage.set("email", this.email);
            await this.storage.set("password", this.password);
          } else {
            await this.storage.set("email", "");
            await this.storage.set("password", "");
          }
          if (this.isSaveLoginKeyPress) {
            this.navCtrl.navigateRoot("/login");
          } else {
            this.navCtrl.navigateRoot("/get-started");
          }

          this.hideLoader();

        });
    } else {
      const apiError = {
        userId,
        errorCode: err.status,
        apiName: err.url,
        postData
      }

      this.serverErrorAPI(apiError).subscribe((res => {
      }), err => {
      })

      //this.showToast("Please try again later.!", "3000", "bottom");
    }
  }


  shareViaFb(message, image, url) {
    this.socialSharing.shareViaFacebook(message, image, url).then(() => {
    }).catch((e) => {
      this.singleAlert("Error", "Facebook is not installed or please update facebook");
    });
  }

  shareViaTwitter(message, image, url) {
    this.socialSharing.shareViaTwitter(message, image, url).then(() => {
    }).catch((e) => {
      this.singleAlert("Error", "Twitter is not installed or please update facebook");
    });
  }

  shareViaClipBoard(message) {
    this.clipboard.copy(message);
    this.showToast('url copy to clipboard, now you can share with your near and dear', 2000, 'bottom');
  }

  shareViaWhatsapp(message, image, url) {
    this.socialSharing.shareViaWhatsApp(message, image, url)
  }

  shareVia(packageName, appName, message, subject, image, url) {
    this.socialSharing.shareVia(packageName, message, subject, image, url).then(() => {

    }).catch((e) => {
      this.singleAlert("Error", appName + " is not installed or please update " + appName);
    })
  }



  calenderUpdate(lastCalenderUpdate, nextUpdateDate) {

    if (lastCalenderUpdate == null || lastCalenderUpdate == "") {
      return (this.isCalenderUpdated = false);
    } else if (lastCalenderUpdate < nextUpdateDate) {
      return (this.isCalenderUpdated = true);
    } else if (lastCalenderUpdate >= nextUpdateDate) {
      return (this.isCalenderUpdated = false);
    }
  }


  public async checkisNewUser(userData) {
    let today = new Date();
    let td = moment(today).format("YYYY-MM-DD");
    if (
      userData.lastCalendarUpdate != null ||
      userData.lastCalendarUpdate != ""
    ) {
      let lastCalenderUpdateDate = moment(userData.lastCalendarUpdate).format(
        "YYYY-MM-DD"
      );
      let nextUpdateDate = moment(lastCalenderUpdateDate, "YYYY-MM-DD").add(
        14,
        "d"
      );
      var day = nextUpdateDate.format("DD");
      var month = nextUpdateDate.format("MM");
      var year = nextUpdateDate.format("YYYY");
    }
    let updateDate = year + "-" + month + "-" + day;

    if (userData.lastCalendarUpdate != null) {
      await this.calenderUpdate(userData.lastCalendarUpdate, updateDate);
    } else {
      this.isCalenderUpdated = false;
    }
    let returnUrl = "";
    if (
      userData != null &&
      (userData.user_type == null || userData.user_type === "")
    ) {
      returnUrl = "/why-join";
    } else if (userData.longitude == null || userData.longitude == "") {
      returnUrl = "/basic-info";

    } else if (userData.imagename == "") {
      returnUrl = "/profile-photo-upload";
    } else if (
      userData.verified == 0 ||
      userData.verify_phoneflag == "N" ||
      userData.verify_phoneflag == "N" ||
      userData.backgroundbadge == false
    ) {
      this.checkVerification()
        .pipe(finalize(() => { }))
        .subscribe(
          (res: any) => {
            this.isEmailVerified = res.emailVerify.status == "1" ? true : false;
            this.isPhoneVerified =
              res.phoneVerify.verify_phoneflag == "Y" ? true : false;
            this.isBackgroundcheck =
              res.BackgroundCheck.is_verified != "Pending" ? true : false;
            this.isWorkPermitted =
              res.righttowork.is_verified != "Pending" ? true : false;
            this.isAmimalCare =
              res.animalcare.is_verified != "Pending" ? true : false;

            this.storage.get(PetcloudApiService.USER).then((user: User) => {
              let background: any = user.BackgroundCheck;
              let righttowork: any = user.righttowork;
              let amimalCare: any = user.animalcare;

              if (this.isPhoneVerified) {
                user.verify_phoneflag = "Y";
              }

              if (this.isEmailVerified) {
                user.verified = 1;
              }

              if (this.isBackgroundcheck) {
                user.backgroundCheckDocument = true;
                background.is_verified = "Verified";
              }

              if (this.isAmimalCare) {
                user.isAnimalCareChecked = true;
                amimalCare.is_verified = "Verified";
              }

              if (this.isWorkPermitted) {
                user.isRightToWorkChecked = true;
                righttowork.is_verified = "Verified";
              }

              this.storage.set(PetcloudApiService.USER, user);
            });

            if (
              this.isEmailVerified &&
              this.isPhoneVerified &&
              this.isBackgroundcheck &&
              this.isWorkPermitted
            ) {
              this.storage.get(PetcloudApiService.USER).then(
                (user: User) => {
                  let background: any = user.BackgroundCheck;
                  let righttowork: any = user.righttowork;
                  user.verify_phoneflag = "Y";
                  user.verified = 1;
                  user.backgroundCheckDocument = true;
                  user.isRightToWorkChecked = true;
                  background.is_verified = "Verified";
                  righttowork.is_verified = "Verified";

                  this.storage.set(PetcloudApiService.USER, user);
                },
                (err) => {
                }
              );
              if (
                Number(userData.user_type) === 1 ||
                Number(userData.user_type) === 3
              ) {
                if (
                  userData.stripeCustomerId != null ||
                  userData.paypal_email != null
                ) {
                  if (this.isCalenderUpdated == false) {
                    this.navCtrl.navigateRoot("/availability");
                  } else {
                    this.navCtrl.navigateRoot("/home/tabs/sitter-listing");
                  }
                } else if (
                  userData.stripeCustomerId == null &&
                  userData.paypal_email != null
                ) {
                  if (this.isCalenderUpdated == false) {
                    this.navCtrl.navigateRoot("/availability");
                  } else {
                    this.navCtrl.navigateRoot("/home/tabs/sitter-listing");
                  }
                } else if (
                  userData.stripeCustomerId != null &&
                  userData.paypal_email == null
                ) {
                  if (this.isCalenderUpdated == false) {
                    this.navCtrl.navigateRoot("/availability");
                  } else {
                    this.navCtrl.navigateRoot("/home/tabs/sitter-listing");
                  }
                } else if (
                  userData.stripeCustomerId == null &&
                  userData.paypal_email == null
                ) {
                  // this.navCtrl.navigateRoot('/payment-method')

                  returnUrl = "/payment-method";

                  //  this.router.navigate(['',{backBtn:true}])
                }
              } else if (
                Number(userData.user_type) === 2 ||
                Number(userData.user_type) === 3
              ) {
                if (
                  userData.stripeCustomerId != null ||
                  userData.paypal_email != null
                ) {
                  if (this.isCalenderUpdated == false) {
                    this.navCtrl.navigateRoot("/availability");
                  } else {
                    this.navCtrl.navigateRoot("/home/tabs/sitter-listing");
                  }
                } else if (
                  userData.stripeCustomerId == null &&
                  userData.paypal_email != null
                ) {
                  if (this.isCalenderUpdated == false) {
                    this.navCtrl.navigateRoot("/availability");
                  } else {
                    this.navCtrl.navigateRoot("/home/tabs/sitter-listing");
                  }
                } else if (
                  userData.stripeCustomerId != null &&
                  userData.paypal_email == null
                ) {
                  if (this.isCalenderUpdated == false) {
                    this.navCtrl.navigateRoot("/availability");
                  } else {
                    this.navCtrl.navigateRoot("/home/tabs/sitter-listing");
                  }
                } else if (
                  userData.stripeCustomerId == null &&
                  userData.paypal_email == null
                ) {
                  this.router.navigate([
                    "/payout-prefrence",
                    { backBtn: true },
                  ]);
                }
              } else if (
                userData.lastCalendarUpdate == null ||
                userData.lastCalendarUpdate == "" ||
                td > updateDate
              ) {
                this.navCtrl.navigateRoot("/availability");
              } else {
                this.navCtrl.navigateRoot("/home/tabs/sitter-listing");
              }
            } else {
              this.router.navigate(["/profile-email-verify"]);
            }
          },
          (err) => {

          }
        );

      // return  returnUrl
    } else if (
      Number(userData.user_type) === 1 ||
      Number(userData.user_type) === 3
    ) {
      await this.addTokenInHeader();

      if (userData.stripeCustomerId != null || userData.paypal_email != null) {
        this.navCtrl.navigateRoot("/home/tabs/sitter-listing");
      } else if (
        userData.stripeCustomerId == null &&
        userData.paypal_email != null
      ) {
        this.navCtrl.navigateRoot("/home/tabs/sitter-listing");
      } else if (
        userData.stripeCustomerId != null &&
        userData.paypal_email == null
      ) {
        this.navCtrl.navigateRoot("/home/tabs/sitter-listing");
      } else if (
        userData.stripeCustomerId == null &&
        userData.paypal_email == null
      ) {
        // this.navCtrl.navigateRoot('/payment-method')
        this.router.navigate(["/payment-method", { backBtn: true }]);
      }
    } else if (
      Number(userData.user_type) === 2 ||
      Number(userData.user_type) === 3
    ) {
      await this.addTokenInHeader();
      if (userData.stripeCustomerId != null || userData.paypal_email != null) {
        if (this.isCalenderUpdated == false) {
          this.navCtrl.navigateRoot("/availability");
        } else {
          this.navCtrl.navigateRoot("/home/tabs/sitter-listing");
        }
        this.navCtrl.navigateRoot("/home/tabs/sitter-listing");
      } else if (
        userData.stripeCustomerId == null &&
        userData.paypal_email != null
      ) {
        if (this.isCalenderUpdated == false) {
          this.navCtrl.navigateRoot("/availability");
        } else {
          this.navCtrl.navigateRoot("/home/tabs/sitter-listing");
        }
      } else if (
        userData.stripeCustomerId != null &&
        userData.paypal_email == null
      ) {
        if (this.isCalenderUpdated == false) {
          this.navCtrl.navigateRoot("/availability");
        } else {
          this.navCtrl.navigateRoot("/home/tabs/sitter-listing");
        }
      } else if (
        userData.stripeCustomerId == null &&
        userData.paypal_email == null
      ) {
        this.router.navigate(["/payout-prefrence", { backBtn: true }]);
      }
    } else if (this.isCalenderUpdated == false) {
      this.navCtrl.navigateRoot("/availability");
    } else {
      this.navCtrl.navigateRoot("/home/tabs/sitter-listing");
    }
  }

  getDateTime() {
    var date = new Date();

    let dateStr = moment(date).utc().format('MM/DD/YYYY HH:mm:ss');
    return dateStr;
  }

  public async SignInWindow() {

    const modal = await this.model.create({
      component: SigninWindowComponent,
      animated: true,
      cssClass: "modalCss",
      backdropDismiss: false,
    });
    modal.onDidDismiss().then((data: any) => { });
    return await modal.present();

  }

  async sendEmailtoAccounts(to, cc, subject, body) {

    const modal = await this.model.create({
      component: FeedbackEmailFormComponent,
      animated: true,
      componentProps: {
        to,
        cc,
        subject,
        body
      },
    });
    modal.onDidDismiss().then((data: any) => {

    });
    return await modal.present();
  }

  public isVerificationPendingModel() {
    let righttowork;
    let isanimalCare;
    let verificationResponse: any;

    this.checkVerification()
      .pipe(
        finalize(() => {
        })
      ).subscribe(
        async (res: any) => {
          verificationResponse = await res;
          await this.storage.set(PetcloudApiService.USER, res.user)

          this.isEmailVerified = res.emailVerify.status == "1" ? true : false;
          this.isPhoneVerified = res.phoneVerify.verify_phoneflag == "Y" ? true : false;
          this.isBackgroundcheck = res.BackgroundCheck.is_verified == "Verified" ? true : false;
          righttowork = res.righttowork.is_verified == "Verified" ? true : false;
          isanimalCare = res.animalcare.is_verified == "Verified" ? true : false;


          this.storage.get(PetcloudApiService.USER).then(async (user: User) => {
            let background: any = await user.BackgroundCheck;
            let righttowork: any = await user.righttowork;
            let animalcare: any = await user.animalcare;

            if (this.isPhoneVerified) {
              user.verify_phoneflag = "Y"
            }

            if (this.isEmailVerified) {
              user.verified = 1
            }

            if (this.isBackgroundcheck == true) {
              background.is_verified = "Verified";
              user.backgroundCheckDocument = true;
            }

            if (righttowork == true) {
              user.isRightToWorkChecked = true;
              righttowork.is_verified = "Verified";
            }

            if (isanimalCare == true) {
              user.isAnimalCareChecked = true;
              animalcare.is_verified = "Verified";
            }

            this.storage.set(PetcloudApiService.USER, user);
            this.storage.get("menuType").then(async (menuType) => {
              // console.log("+++++++++++++++++++++++++++++++")
              if (menuType != null) {
                if (menuType == "sitter") {
                  if (res.emailVerify.status == 0 || res.phoneVerify.verify_phoneflag == "N"
                    || res.BackgroundCheck.is_verified != this.VERIFIED) {
                    this.verificationModel();
                  }
                } else {

                  if (res.emailVerify.status == 0 || res.phoneVerify.verify_phoneflag == "N") {
                    this.verificationModel();
                  }
                }
              } else {
                // this.router.navigateByUrl("/get-started");
              }
            });
          });
        },
        (err) => {
          this.autoLogout(err, "");
        }
      );
  }

  public dismissModelorAlert() {

    this.model.getTop().then((modelPresent) => {
      if (modelPresent) {
        this.model.dismiss();
        this.model.dismiss(true);
      }
    });

    this.alert.getTop().then((alertPresent) => {
      if (alertPresent) {
        this.alert.dismiss();
        this.alert.dismiss(true);
      }
    });
  }

  public async verificationModel() {
    const modal = await this.modal1.create({
      component: VerificationpendingComponent,
      animated: true,
      cssClass: "modalCss",
      componentProps: {},
    });
    modal.onDidDismiss().then((data: any) => { });
    return await modal.present();
  }



  async singleAlert(subHeader, message) {
    const alert = await this.alert.create({
      header: "",
      subHeader,
      message,
      buttons: ["OK"],
    });

    await alert.present();
  }

  async getFirebaseToken() {

    const deviceId = {
      androidId: "",
      iPhoneId: ""
    }

    await this.platform.ready();
    await this.firebase.getToken().then((token) => {
      if (this.plt.is("android")) {
        deviceId.androidId = token;
        localStorage.setItem("fcmToken", deviceId.androidId);
      } else if (this.plt.is("ios")) {
        deviceId.iPhoneId = token;
        localStorage.setItem("fcmToken", deviceId.iPhoneId);
      }
    })

    return deviceId;

  }

  generateRandomId(length) {
    var result = "";
    var characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  public getIoToken() {
    return this.http.get(this.BASE_URL + 'users/getioconnectiontoken', this.header);
  }

  validURL(str) {
    var pattern = new RegExp('^(https?:\\/\\/)?' + // protocol
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
      '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
      '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
      '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator
    return !!pattern.test(str);
  }
}
