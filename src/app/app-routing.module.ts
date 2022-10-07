import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { Storage } from '@ionic/storage';
import { BookingCostComponent } from './booking-cost/booking-cost.component';

const routes: Routes = [
  { path: '', redirectTo: '', pathMatch: 'full' },
  { path: 'home', loadChildren: () => import('./home/home.module').then(m => m.HomePageModule) },
  { path: 'list', loadChildren: () => import('./list/list.module').then(m => m.ListPageModule) },
  { path: 'login', loadChildren: () => import('./login/login.module').then(m => m.LoginPageModule) },
  {
    path: 'welcome',
    loadChildren: () => import('./welcome/welcome.module').then(m => m.WelcomePageModule)
  },
  {
    path: 'signup-user',
    loadChildren: () => import('./signup-user/signup-user.module').then(m => m.SignupUserPageModule)
  },
  {
    path: 'reset-password',
    loadChildren: () => import('./reset-password/reset-password.module').then(m => m.ResetPasswordPageModule)
  },
  {
    path: 'basic-info',
    loadChildren: () => import('./profile/basic-info/basic-info.module').then(m => m.BasicInfoPageModule)
  },
  {
    path: 'profile-photo-upload',
    loadChildren: () => import('./profile/profile-photo-upload/profile-photo-upload.module').then(m => m.ProfilePhotoUploadPageModule)
    // loadChildren:
    //   './profile/profile-photo-upload/profile-photo-upload.module#ProfilePhotoUploadPageModule',
  },
  {
    path: 'profile-email-verify',
    loadChildren: () => import('./profile/profile-email-verify/profile-email-verify.module').then(m => m.ProfileEmailVerifyPageModule)
    // loadChildren:
    //   './profile/profile-email-verify/profile-email-verify.module#ProfileEmailVerifyPageModule',
  },
  {
    path: 'profile-mobile-verify',
    loadChildren: () => import('./profile/profile-mobile-verify/profile-mobile-verify.module').then(m => m.ProfileMobileVerifyPageModule)
    // loadChildren:
    //   './profile/profile-mobile-verify/profile-mobile-verify.module#ProfileMobileVerifyPageModule',
  },
  {
    path: 'get-started',
    loadChildren: () => import('./get-started/get-started.module').then(m => m.GetStartedPageModule)
    // loadChildren: './get-started/get-started.module#GetStartedPageModule',
  },
  {
    path: 'explore',
    loadChildren: () => import('./explore/explore.module').then(m => m.ExplorePageModule)
    // loadChildren: './explore/explore.module#ExplorePageModule',
  },
  {
    path: 'pet-sitter-detail/:userId',
    loadChildren: () => import('./pet-sitter-detail/pet-sitter-detail.module').then(m => m.PetSitterDetailPageModule)
    // loadChildren:
    //   './pet-sitter-detail/pet-sitter-detail.module#PetSitterDetailPageModule',
  },
  {
    path: 'profile-menu',
    loadChildren: () => import('./profile-menu/profile-menu.module').then(m => m.ProfileMenuPageModule)
    // loadChildren: './profile-menu/profile-menu.module#ProfileMenuPageModule',
  },
  {
    path: 'terms-and-condition',
    loadChildren: () => import('./terms-and-condition/terms-and-condition.module').then(m => m.TermsAndConditionPageModule)
    // loadChildren:
    //   './terms-and-condition/terms-and-condition.module#TermsAndConditionPageModule',
  },
  {
    path: 'privacy-policy',
    loadChildren: () => import('./privacy-policy/privacy-policy.module').then(m => m.PrivacyPolicyPageModule)
    // loadChildren:
    //   './privacy-policy/privacy-policy.module#PrivacyPolicyPageModule',
  },
  { path: 'pet', 
  loadChildren: () => import('./pet/pet.module').then(m => m.PetPageModule)
//   loadChildren: './pet/pet.module#PetPageModule' 
    },
  {
    path: 'pet-add',
    loadChildren: () => import('./pet-add/pet-add.module').then(m => m.PetAddPageModule)
    // loadChildren: './pet-add/pet-add.module#PetAddPageModule',
  },
  {
    path: 'pet-update/:petid',
    loadChildren: () => import('./pet-update/pet-update.module').then(m => m.PetUpdatePageModule)
    // loadChildren: './pet-update/pet-update.module#PetUpdatePageModule',
  },
  {
    path: 'pet-view/:petId',
    loadChildren: () => import('./pet-view/pet-view.module').then(m => m.PetViewPageModule)
    // loadChildren: './pet-view/pet-view.module#PetViewPageModule',
  },
  {
    path: 'listing',
    loadChildren: () => import('./myListing/listing/listing.module').then(m => m.ListingPageModule)
    // loadChildren: './myListing/listing/listing.module#ListingPageModule',
  },
  {
    path: 'listing-basic-information',
    loadChildren: () => import('./myListing/listing-basic-information/listing-basic-information.module').then(m => m.ListingBasicInformationPageModule)
    // loadChildren:
    //   './myListing/listing-basic-information/listing-basic-information.module#ListingBasicInformationPageModule',
  },
  {
    path: 'listing-photos',
    loadChildren: () => import('./myListing/listing-photos/listing-photos.module').then(m => m.ListingPhotosPageModule)
    // loadChildren:
    //   './myListing/listing-photos/listing-photos.module#ListingPhotosPageModule',
  },
  {
    path: 'listing-services',
    loadChildren: () => import('./myListing/listing-services/listing-services.module').then(m => m.ListingServicesPageModule)
    // loadChildren:
    //   './myListing/listing-services/listing-services.module#ListingServicesPageModule',
  },
  {
    path: 'home-description',
    loadChildren: () => import('./myListing/home-description/home-description.module').then(m => m.HomeDescriptionPageModule)
    // loadChildren:
    //   './myListing/home-description/home-description.module#HomeDescriptionPageModule',
  },
  {
    path: 'skills',
    loadChildren: () => import('./myListing/skills/skills.module').then(m => m.SkillsPageModule)
    // loadChildren: './myListing/skills/skills.module#SkillsPageModule',
  },
  {
    path: 'payout-prefrence',
    loadChildren: () => import('./myListing/payout-prefrence/payout-prefrence.module').then(m => m.PayoutPrefrencePageModule)
    // loadChildren:
    //   './myListing/payout-prefrence/payout-prefrence.module#PayoutPrefrencePageModule',
  },
  {
    path: 'availability',
    loadChildren: () => import('./myListing/availability/availability.module').then(m => m.AvailabilityPageModule)
    // loadChildren:
    //   './myListing/availability/availability.module#AvailabilityPageModule',
  },
  {
    path: 'search-sitter-map',
    loadChildren: () => import('./search-sitter-map/search-sitter-map.module').then(m => m.SearchSitterMapPageModule)
    // loadChildren:
    //   './search-sitter-map/search-sitter-map.module#SearchSitterMapPageModule',
  },
  {
    path: 'map-filter',
    loadChildren: () => import('./map-filter/map-filter.module').then(m => m.MapFilterPageModule)
    // loadChildren: './map-filter/map-filter.module#MapFilterPageModule',
  },
  {
    path: 'check-availability',
    loadChildren: () => import('./check-availability/check-availability.module').then(m => m.CheckAvailabilityPageModule)
    // loadChildren:
    //   './check-availability/check-availability.module#CheckAvailabilityPageModule',
  },
  { path: 'booking-cost', component: BookingCostComponent },
  {
    path: 'messages',
    loadChildren: () => import('./messages/messages.module').then(m => m.MessagesPageModule)
    // loadChildren: () =>
    //   import('./messages/messages.module').then((m) => m.MessagesPageModule),
  },
  {
    path: 'message-detail',
    loadChildren: () => import('./message-detail/message-detail.module').then(m => m.MessageDetailPageModule)
    // loadChildren:
    //   './message-detail/message-detail.module#MessageDetailPageModule',
  },
  { path: 'cms', 
    loadChildren: () => import('./cms/cms.module').then(m => m.CMSPageModule)
    //   loadChildren: './cms/cms.module#CMSPageModule' 
    },
  {
    path: 'about-us',
    loadChildren: () =>  import('./about-us/about-us.module').then(m => m.AboutUsPageModule)
    // loadChildren: './about-us/about-us.module#AboutUsPageModule',
  },
  { path: 'jobs', 
    loadChildren: () =>  import('./jobs/jobs.module').then(m => m.JobsPageModule)
    // loadChildren: './jobs/jobs.module#JobsPageModule'
    },
  {
    path: 'view-jobs',
    loadChildren: () =>  import('./view-jobs/view-jobs.module').then(m => m.ViewJobsPageModule)
    // loadChildren: './view-jobs/view-jobs.module#ViewJobsPageModule',
  },
  {
    path: 'job-applications',
    loadChildren: () =>  import('./job-applications/job-applications.module').then(m => m.JobApplicationsPageModule)
    // loadChildren:
    //   './job-applications/job-applications.module#JobApplicationsPageModule',
  },
  {
    path: 'help', 
    loadChildren: () =>  import('./help/help.module').then(m => m.HelpPageModule)
        // loadChildren: './help/help.module#HelpPageModule'
},
  {
    path: 'transaction-history',
    loadChildren: () =>  import('./transaction-history/transaction-history.module').then(m => m.TransactionHistoryPageModule)
    // loadChildren:
    //   './transaction-history/transaction-history.module#TransactionHistoryPageModule',
  },
  {
    path: 'invite-friend',
    loadChildren: () =>  import('./invite-friend/invite-friend.module').then(m => m.InviteFriendPageModule)
    // loadChildren: './invite-friend/invite-friend.module#InviteFriendPageModule',
  },
  {
    path: 'notification',
    loadChildren: () =>  import('./notification/notification.module').then(m => m.NotificationPageModule)
    // loadChildren: './notification/notification.module#NotificationPageModule',
  },
  {
    path: 'payment-method',
    loadChildren: () =>  import('./payment-method/payment-method.module').then(m => m.PaymentMethodPageModule)
    // loadChildren:
    //   './payment-method/payment-method.module#PaymentMethodPageModule',
  },
  {
    path: 'reference',
    loadChildren: () =>  import('./reference/reference.module').then(m => m.ReferencePageModule)
    // loadChildren: './reference/reference.module#ReferencePageModule',
  },
  {
    path: 'favourite-sitter',
    loadChildren: () =>  import('./favourite-sitter/favourite-sitter.module').then(m => m.FavouriteSitterPageModule)
//     loadChildren:
//       './favourite-sitter/favourite-sitter.module#FavouriteSitterPageModule',
  },
  {
    path: 'account-setting',
    loadChildren: () =>  import('./account-setting/account-setting.module').then(m => m.AccountSettingPageModule)
    // loadChildren:
    //   './account-setting/account-setting.module#AccountSettingPageModule',
  },
  {
    path: 'profile-setup',
    loadChildren: () =>  import('./profile-setup/profile-setup.module').then(m => m.ProfileSetupPageModule)
    // loadChildren: './profile-setup/profile-setup.module#ProfileSetupPageModule',
  },
  {
    path: 'live-url/:liveUrl',
    loadChildren: () =>  import('./live-url/live-url.module').then(m => m.LiveUrlPageModule)
    // loadChildren: './live-url/live-url.module#LiveUrlPageModule',
  },
  {
    path: 'why-join',
    loadChildren: () =>  import('./why-join/why-join.module').then(m => m.WhyJoinPageModule)
    // loadChildren: './why-join/why-join.module#WhyJoinPageModule',
  },
  {
    path: 'recent-job-listing',
    loadChildren: () =>  import('./recent-job-listing/recent-job-listing.module').then(m => m.RecentJobListingPageModule)
    // loadChildren:
    //   './recent-job-listing/recent-job-listing.module#RecentJobListingPageModule',
  },
  {
    path: 'check-internet-connection',
    loadChildren: () =>  import('./check-internet-connection/check-internet-connection.module').then(m => m.CheckInternetConnectionPageModule)
    // loadChildren:
    //   './check-internet-connection/check-internet-connection.module#CheckInternetConnectionPageModule',
  },
  {
    path: 'booking-authorize/:id',
    loadChildren: () =>  import('./booking-authorize/booking-authorize.module').then(m => m.BookingAuthorizePageModule)
    // loadChildren:
    //   './booking-authorize/booking-authorize.module#BookingAuthorizePageModule',
  },
  {
    path: 'contact-other-sitter',
    loadChildren: () =>  import('./contact-other-sitter/contact-other-sitter.module').then(m => m.ContactOtherSitterPageModule)
    // loadChildren:
    //   './contact-other-sitter/contact-other-sitter.module#ContactOtherSitterPageModule',
  },
  {
    path: 'location-map',
    loadChildren: () =>  import('./location-map/location-map.module').then(m => m.LocationMapPageModule)
    // loadChildren: './location-map/location-map.module#LocationMapPageModule',
  },
  { path: 'wallet', loadChildren: () =>  import('./wallet/wallet.module').then(m => m.WalletPageModule),
  // loadChildren: './wallet/wallet.module#WalletPageModule' 
  },
  {
    path: 'addmoney',
    loadChildren: () =>  import('./addmoney/addmoney.module').then(m => m.AddmoneyPageModule)
    // loadChildren: './addmoney/addmoney.module#AddmoneyPageModule',
  },
  {
    path: 'withdrawal',
    loadChildren: () =>  import('./withdrawal/withdrawal.module').then(m => m.WithdrawalPageModule)
    // loadChildren: './withdrawal/withdrawal.module#WithdrawalPageModule',
  },
  {
    path: 'wallet-detail-transaction',
    loadChildren: () =>  import('./wallet-detail-transaction/wallet-detail-transaction.module').then(m => m.WalletDetailTransactionPageModule)
    // loadChildren:
    //   './wallet-detail-transaction/wallet-detail-transaction.module#WalletDetailTransactionPageModule',
  },
  {
    path: 'dashboard',
    loadChildren: () =>  import('./dashboard/dashboard.module').then(m => m.DashboardPageModule)
    // loadChildren: './dashboard/dashboard.module#DashboardPageModule',
  },
  { path: 'guides', 
  loadChildren: () =>  import('./guides/guides.module').then(m => m.GuidesPageModule)
  // loadChildren: './guides/guides.module#GuidesPageModule' 
},
  {
    path: 'directory-listing-details',
    loadChildren: () =>  import('./directory-listing-details/directory-listing-details.module').then(m => m.ListingCategoryDetailsPageModule)
    // loadChildren:
    //   './directory-listing-details/directory-listing-details.module#ListingCategoryDetailsPageModule',
  },
  {
    path: 'feedback',
    loadChildren: () =>  import('./feedback/feedback.module').then(m => m.FeedbackPageModule)
    // loadChildren: './feedback/feedback.module#FeedbackPageModule',
  },
  {
    path: 'directory-listing-map',
    loadChildren: () =>  import('./directory-listing-map/directory-listing-map.module').then(m => m.DirectoryListingMapPageModule)
    // loadChildren:
    //   './directory-listing-map/directory-listing-map.module#DirectoryListingMapPageModule',
  },
  { path: 'blog',
  loadChildren: () =>  import('./blog/blog.module').then(m => m.BlogPageModule)
    // loadChildren: './blog/blog.module#BlogPageModule' 
  },
  {
    path: 'blog-details',
    loadChildren: () =>  import('./blog-details/blog-details.module').then(m => m.BlogDetailsPageModule)
    // loadChildren: './blog-details/blog-details.module#BlogDetailsPageModule',
  },
  {
    path: 'help-article',
    loadChildren: () =>  import('./help-article/help-article.module').then(m => m.HelpArticlePageModule)
    // loadChildren: './help-article/help-article.module#HelpArticlePageModule',
  },
  {
    path: 'errorpage',
    loadChildren: () =>  import('./errorpage/errorpage.module').then(m => m.ErrorpagePageModule)
    // loadChildren: './errorpage/errorpage.module#ErrorpagePageModule',
  },
  {
    path: 'bank-details',
    loadChildren: () =>  import('./bank-details/bank-details.module').then(m => m.BankDetailsPageModule)
    // loadChildren: './bank-details/bank-details.module#BankDetailsPageModule',
  },
  {
    path: 'job-posted-success',
    loadChildren: () =>  import('./job-posted-success/job-posted-success.module').then(m => m.JobPostedSuccessPageModule)
    // loadChildren:
    //   './job-posted-success/job-posted-success.module#JobPostedSuccessPageModule',
  },
  {
    path: 'reminders-list',
    loadChildren: () =>  import('./reminders-list/reminders-list.module').then(m => m.RemindersListPageModule)
    // loadChildren:
    //   './reminders-list/reminders-list.module#RemindersListPageModule',
  },
  {
    path: 'jobs-tab',
    loadChildren: () =>  import('./jobs-tab/jobs-tab.module').then(m => m.JobsTabPageModule)
    // loadChildren: './jobs-tab/jobs-tab.module#JobsTabPageModule',
  },
  {
    path: 'forceupdate',
    loadChildren: () =>  import('./forceupdate/forceupdate.module').then(m => m.ForceupdatePageModule)
    // loadChildren: './forceupdate/forceupdate.module#ForceupdatePageModule',
  },
  {
    path: 'add-reminders',
    loadChildren: () =>  import('./add-reminders/add-reminders.module').then(m => m.AddRemindersPageModule)
    // loadChildren: './add-reminders/add-reminders.module#AddRemindersPageModule',
  },
  {
    path: 'directory-listing',
    loadChildren: () =>  import('./directory-listing/directory-listing.module').then(m => m.DirectoryListingPageModule)
    // loadChildren:
    //   './directory-listing/directory-listing.module#DirectoryListingPageModule',
  },
  {
    path: 'sitter-performace',
    loadChildren: () =>  import('./sitter-performace/sitter-performace.module').then(m => m.SitterPerformacePageModule)
    // loadChildren:
    //   './sitter-performace/sitter-performace.module#SitterPerformacePageModule',
  },
  {
    path: 'post-a-spot',
    loadChildren: () =>  import('./add-listing-directory/post-a-spot/post-a-spot.module').then(m => m.PostASpotPageModule)
    // loadChildren:
    //   './add-listing-directory/post-a-spot/post-a-spot.module#PostASpotPageModule',
  },
  {
    path: 'add-directory-listing',
    loadChildren: () =>  import('./add-listing-directory/add-directory-listing/add-directory-listing.module').then(m => m.AddDirectoryListingPageModule)
    // loadChildren:
    //   './add-listing-directory/add-directory-listing/add-directory-listing.module#AddDirectoryListingPageModule',
  },
  {
    path: 'app-maintainiance',
    loadChildren: () =>  import('./app-maintainiance/app-maintainiance.module').then(m => m.AppMaintainiancePageModule)
    // loadChildren:
    //   './app-maintainiance/app-maintainiance.module#AppMaintainiancePageModule',
  },
  {
    path: 'referrals-history',
    loadChildren: () =>  import('./referrals-history/referrals-history.module').then(m => m.ReferralsHistoryPageModule)
    // loadChildren:
    //   './referrals-history/referrals-history.module#ReferralsHistoryPageModule',
  },
  {
    path: 'its-match',
    loadChildren: () =>  import('./its-match/its-match.module').then(m => m.ItsMatchPageModule)
    // loadChildren: './its-match/its-match.module#ItsMatchPageModule',
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {
  constructor(protected storage: Storage) {}
}
