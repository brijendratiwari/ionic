import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { MeetandGreetComponentComponent } from '../meetand-greet-component/meetand-greet-component.component';
import { RequestCancellationComponent } from '../request-cancellation/request-cancellation.component';
import { OwnerDeclineBookingComponent } from '../owner-decline-booking/owner-decline-booking.component';
import { FileOpener } from '@ionic-native/file-opener/ngx';
import { DocumentViewer } from '@ionic-native/document-viewer/ngx';
import { File } from '@ionic-native/File/ngx';
import { AlterBookingCostComponent } from '../alter-booking-cost/alter-booking-cost.component';
import { MeetngreetNotSoGreatComponent } from '../meetngreet-not-so-great/meetngreet-not-so-great.component';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { AngularFireStorage } from '@angular/fire/storage';
import { WalletBookingCheckoutComponent } from '../wallet-booking-checkout/wallet-booking-checkout.component';
import { BookingSuccessComponentComponent } from '../booking-success-component/booking-success-component.component';
import { ModifyBookingComponent } from '../modify-booking/modify-booking.component';
import { CallNumber } from '@ionic-native/call-number/ngx';
import { MessageDetailPage } from './message-detail.page';
import { PetReportComponentComponent } from '../pet-report-component/pet-report-component.component';
import { ChatscreenFilesharingPopupComponent } from '../chatscreen-filesharing-popup/chatscreen-filesharing-popup.component';
import { ViewPetReportComponent } from '../view-pet-report/view-pet-report.component';
import { DatePicker } from '@ionic-native/date-picker/ngx';

const routes: Routes = [
  {
    path: '',
    component: MessageDetailPage
  }
];

@NgModule({
  entryComponents: [
    MeetandGreetComponentComponent,
    RequestCancellationComponent,
    MeetngreetNotSoGreatComponent,
    WalletBookingCheckoutComponent,
    BookingSuccessComponentComponent,
    ModifyBookingComponent,
    PetReportComponentComponent,
    ViewPetReportComponent,
    ChatscreenFilesharingPopupComponent,
    OwnerDeclineBookingComponent,
    AlterBookingCostComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes)
  ],
  providers: [
    FileOpener,
    DocumentViewer,
    File,
    CallNumber,
    DatePicker,
    InAppBrowser,
    AngularFireStorage,
  ],
  declarations: [
    MessageDetailPage,
    MeetandGreetComponentComponent,
    MeetngreetNotSoGreatComponent,
    WalletBookingCheckoutComponent,
    BookingSuccessComponentComponent,
    ModifyBookingComponent,
    PetReportComponentComponent,
    ViewPetReportComponent,
    ChatscreenFilesharingPopupComponent,
    RequestCancellationComponent,
    OwnerDeclineBookingComponent,
    AlterBookingCostComponent,
  ],
  schemas: [NO_ERRORS_SCHEMA]
})
export class MessageDetailPageModule { }
