import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
// import { SmsRetriever } from '@ionic-native/sms-retriever/ngx';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { BookingCostComponent } from './booking-cost/booking-cost.component';
import { PetDetailsComponent } from './pet-details/pet-details.component';
import { SearchJobFilterComponent } from './search-job-filter/search-job-filter.component';
import { GoogleAddressAutoCompleteComponent } from './google-address-auto-complete/google-address-auto-complete.component';
import { LeaveaReviewComponent } from './messages/leavea-review/leavea-review.component';
import { NotificationSettingComponent } from './notification-setting/notification-setting.component';
import { VerificationpendingComponent } from './verificationpending/verificationpending.component';
import { ListingCategoryComponent } from './listing-category/listing-category.component';
import { SocailshareComponent } from './socailshare/socailshare.component';
import { AddCardDetailsComponent } from './add-card-details/add-card-details.component';
import { AuthorizationCongratsModelComponent } from './authorization-congrats-model/authorization-congrats-model.component';
import { JobDetailComponent } from './view-jobs/job-detail/job-detail.component';
import { KeysPipe } from './pipes/keys.pipe';
import { MessageFilterComponent } from './messages/message-filter/message-filter.component';
import { ToDateObjPipe } from './pipe/to-date-obj.pipe';
import { InfomodelComponent } from './components/infomodel/infomodel.component';
import { SigninWindowComponent } from './signin-window/signin-window.component';
import { SitterSearchFilterComponent } from './sitter-search-filter/sitter-search-filter.component';
import { FeedbackEmailFormComponent } from './feedback-email-form/feedback-email-form.component';
import { ViewImageModelComponent } from './view-image-model/view-image-model.component';
import { ChatscreenComponent } from './chatscreen/chatscreen.component';
import { environment } from 'src/environments/environment';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FileOpener } from '@ionic-native/file-opener/ngx';
import { AppVersion } from '@ionic-native/app-version/ngx';
import { DatePipe } from '@angular/common';
import { Appsflyer } from '@ionic-native/appsflyer/ngx';
import {
  FileTransfer,
  FileTransferObject,
} from '@ionic-native/file-transfer/ngx';
import { Market } from '@ionic-native/market/ngx';
import { BackgroundMode } from '@ionic-native/background-mode/ngx';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { Badge } from '@ionic-native/badge/ngx';
import { AuthenticationService } from './services/authentication.service';
import { Diagnostic } from '@ionic-native/diagnostic/ngx';
import { OpenNativeSettings } from '@ionic-native/open-native-settings/ngx';
import { SignInWithApple } from '@ionic-native/sign-in-with-apple/ngx';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { CameraService } from './camera-service.service';
import { MessageDetailPageModule } from './message-detail/message-detail.module';
import { MapFilterPageModule } from './map-filter/map-filter.module';
import { GooglePlaceModule } from 'ngx-google-places-autocomplete';
import { AngularFireModule } from 'angularfire2';
import {
  AngularFirestoreModule,
  FirestoreSettingsToken,
} from 'angularfire2/firestore';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { SuperTabsModule } from '@ionic-super-tabs/angular';
import { CalendarModule } from 'ion2-calendar';
import { IonicStorageModule } from '@ionic/storage';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { IonicRatingModule } from 'ionic4-rating';
import { RlTagInputModule } from 'angular2-tag-input';
import { Device } from '@ionic-native/device/ngx';
import { IonicHeaderParallaxModule } from 'ionic-header-parallax';
import { FirebaseX } from '@ionic-native/firebase-x/ngx';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Camera } from '@ionic-native/camera/ngx';
import { File } from "@ionic-native/File/ngx";
import { Geolocation } from "@ionic-native/geolocation/ngx";
import { Clipboard } from '@ionic-native/clipboard/ngx';
import { MediaCapture } from '@ionic-native/media-capture/ngx';
import { Stripe } from '@ionic-native/stripe/ngx';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { RemoteChatScreenComponent } from './remote-chat-screen/remote-chat-screen.component';
import { PreAcceptBookingComponent } from './components/pre-accept-booking/pre-accept-booking.component';
import { StripeBookingCheckoutComponent } from './stripe-booking-checkout/stripe-booking-checkout.component';

import { Deeplinks } from '@ionic-native/deeplinks/ngx';
const config: SocketIoConfig = { url: environment.socketUrl, options: {} };

@NgModule({
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  declarations: [
    AppComponent,
    BookingCostComponent,
    PetDetailsComponent,
    SearchJobFilterComponent,
    GoogleAddressAutoCompleteComponent,
    LeaveaReviewComponent,
    NotificationSettingComponent,
    VerificationpendingComponent,
    ListingCategoryComponent,
    SocailshareComponent,
    AddCardDetailsComponent,
    AuthorizationCongratsModelComponent,
    JobDetailComponent,
    KeysPipe,
    MessageFilterComponent,
    ToDateObjPipe,
    InfomodelComponent,
    SigninWindowComponent,
    SitterSearchFilterComponent,
    FeedbackEmailFormComponent,
    ViewImageModelComponent,
    ChatscreenComponent,
    RemoteChatScreenComponent,
    PreAcceptBookingComponent,
    StripeBookingCheckoutComponent
  ],
  entryComponents: [
    PetDetailsComponent,
    SearchJobFilterComponent,
    GoogleAddressAutoCompleteComponent,
    VerificationpendingComponent,
    NotificationSettingComponent,
    LeaveaReviewComponent,
    ListingCategoryComponent,
    SocailshareComponent,
    AddCardDetailsComponent,
    AuthorizationCongratsModelComponent,
    MessageFilterComponent,
    JobDetailComponent,
    InfomodelComponent,
    SigninWindowComponent,
    SitterSearchFilterComponent,
    FeedbackEmailFormComponent,
    ViewImageModelComponent,
    ChatscreenComponent,
    RemoteChatScreenComponent,
    PreAcceptBookingComponent,
    StripeBookingCheckoutComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    IonicModule.forRoot({
      mode: 'md',
    }),
    AngularFireModule.initializeApp(environment.firebase),
    SocketIoModule.forRoot(config),
    AngularFirestoreModule,
    AngularFireDatabaseModule,
    SuperTabsModule.forRoot(),
    CalendarModule.forRoot(),
    HttpClientModule,
    AppRoutingModule,
    IonicStorageModule.forRoot(),
    ReactiveFormsModule,
    GooglePlaceModule,
    MapFilterPageModule,
    FormsModule,
    IonicRatingModule,
    RlTagInputModule,
    IonicHeaderParallaxModule,
    MessageDetailPageModule,
  ],
  providers: [
    StatusBar,
    Stripe,
    Deeplinks,
    // SmsRetriever,
    RlTagInputModule,
    IonicRatingModule,
    SplashScreen,
    Geolocation,
    DatePipe,
    SocialSharing,
    FirebaseX,
    Appsflyer,
    Camera,
    FileTransferObject,
    FileTransfer,
    File,
    FileOpener,
    AppVersion,
    Market,
    BackgroundMode,
    AndroidPermissions,
    Badge,
    Device,
    AuthenticationService,
    Diagnostic,
    OpenNativeSettings,
    SignInWithApple,
    InAppBrowser,
    CameraService,
    Clipboard,
    MediaCapture,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    { provide: FirestoreSettingsToken, useValue: {} },
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
