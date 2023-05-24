// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: true,
  apiBase: "https://dev.petcloud.com.au/api/",
  // apiBase: "https://qa.petcloud.com.au/api/",
  socketUrl: "https://messages.petcloud.com.au",
  env: "prod",
  firebase:{
    apiKey: "AIzaSyDoElSXYrk9g17GgHrPxeryBr6VrKvcmFc",
    authDomain: "petcloudionic.firebaseapp.com",
    databaseURL: "https://petcloudionic.firebaseio.com",
    projectId: "petcloudionic",
    storageBucket: "petcloudionic.appspot.com",
    messagingSenderId: "132479912039",
    appId: "1:132479912039:web:01f2da2f63e2510c6c6cc2"
  }
  // apiBase: "https://api.petcloud.com.au/api/",
  // env: "prod",
  // firebase: {
  //   apiKey: "AIzaSyC89vwZN4KjHHoh7oWf1Jzqvm3GNf7x_4Y",
  //   authDomain: "petcloud2020.firebaseapp.com",
  //   databaseURL: "https://petcloud2020.firebaseio.com",
  //   projectId: "petcloud2020",
  //   storageBucket: "petcloud2020.appspot.com",
  //   messagingSenderId: "689365265587",
  //   appId: "1:689365265587:web:d0412411f2698db729d4c6",
  //   measurementId: "G-0F3TP4EEPF",
  // }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
*
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
 