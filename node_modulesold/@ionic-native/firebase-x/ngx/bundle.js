'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var tslib = require('tslib');
var core$1 = require('@angular/core');
var core = require('@ionic-native/core');
require('rxjs');

var FirebaseX = /** @class */ (function (_super) {
    tslib.__extends(FirebaseX, _super);
    function FirebaseX() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    FirebaseX.prototype.getToken = function () { return core.cordova(this, "getToken", {}, arguments); };
    FirebaseX.prototype.getId = function () { return core.cordova(this, "getId", {}, arguments); };
    FirebaseX.prototype.getCurrentUser = function () { return core.cordova(this, "getCurrentUser", {}, arguments); };
    FirebaseX.prototype.reloadCurrentUser = function () { return core.cordova(this, "reloadCurrentUser", {}, arguments); };
    FirebaseX.prototype.onTokenRefresh = function () { return core.cordova(this, "onTokenRefresh", { "observable": true }, arguments); };
    FirebaseX.prototype.getAPNSToken = function () { return core.cordova(this, "getAPNSToken", {}, arguments); };
    FirebaseX.prototype.onApnsTokenReceived = function () { return core.cordova(this, "onApnsTokenReceived", { "observable": true }, arguments); };
    FirebaseX.prototype.onMessageReceived = function () { return core.cordova(this, "onMessageReceived", { "observable": true }, arguments); };
    FirebaseX.prototype.grantPermission = function () { return core.cordova(this, "grantPermission", { "platforms": ["iOS"] }, arguments); };
    FirebaseX.prototype.hasPermission = function () { return core.cordova(this, "hasPermission", {}, arguments); };
    FirebaseX.prototype.unregister = function () { return core.cordova(this, "unregister", {}, arguments); };
    FirebaseX.prototype.setBadgeNumber = function (badgeNumber) { return core.cordova(this, "setBadgeNumber", {}, arguments); };
    FirebaseX.prototype.getBadgeNumber = function () { return core.cordova(this, "getBadgeNumber", {}, arguments); };
    FirebaseX.prototype.clearAllNotifications = function () { return core.cordova(this, "clearAllNotifications", { "platforms": ["Android"] }, arguments); };
    FirebaseX.prototype.subscribe = function (topic) { return core.cordova(this, "subscribe", {}, arguments); };
    FirebaseX.prototype.unsubscribe = function (topic) { return core.cordova(this, "unsubscribe", {}, arguments); };
    FirebaseX.prototype.isAutoInitEnabled = function () { return core.cordova(this, "isAutoInitEnabled", {}, arguments); };
    FirebaseX.prototype.setAutoInitEnabled = function (enabled) { return core.cordova(this, "setAutoInitEnabled", {}, arguments); };
    FirebaseX.prototype.createChannel = function (channelOptions) { return core.cordova(this, "createChannel", {}, arguments); };
    FirebaseX.prototype.setDefaultChannel = function (channelOptions) { return core.cordova(this, "setDefaultChannel", {}, arguments); };
    FirebaseX.prototype.deleteChannel = function (channelID) { return core.cordova(this, "deleteChannel", {}, arguments); };
    FirebaseX.prototype.listChannels = function () { return core.cordova(this, "listChannels", {}, arguments); };
    FirebaseX.prototype.setAnalyticsCollectionEnabled = function (enabled) { return core.cordova(this, "setAnalyticsCollectionEnabled", {}, arguments); };
    FirebaseX.prototype.setCrashlyticsCollectionEnabled = function (enabled) { return core.cordova(this, "setCrashlyticsCollectionEnabled", {}, arguments); };
    FirebaseX.prototype.setPerformanceCollectionEnabled = function (enabled) { return core.cordova(this, "setPerformanceCollectionEnabled", {}, arguments); };
    FirebaseX.prototype.logEvent = function (type, data) { return core.cordova(this, "logEvent", {}, arguments); };
    FirebaseX.prototype.setScreenName = function (name) { return core.cordova(this, "setScreenName", {}, arguments); };
    FirebaseX.prototype.setUserId = function (userId) { return core.cordova(this, "setUserId", {}, arguments); };
    FirebaseX.prototype.setUserProperty = function (name, value) { return core.cordova(this, "setUserProperty", {}, arguments); };
    FirebaseX.prototype.setCrashlyticsUserId = function (userId) { return core.cordova(this, "setCrashlyticsUserId", {}, arguments); };
    FirebaseX.prototype.sendCrash = function () { return core.cordova(this, "sendCrash", {}, arguments); };
    FirebaseX.prototype.logMessage = function (message) { return core.cordova(this, "logMessage", {}, arguments); };
    FirebaseX.prototype.logError = function (error, stackTrace) { return core.cordova(this, "logError", {}, arguments); };
    FirebaseX.prototype.verifyPhoneNumber = function (phoneNumber, timeOutDuration, fakeVerificationCode) { return core.cordova(this, "verifyPhoneNumber", { "callbackOrder": "reverse" }, arguments); };
    FirebaseX.prototype.setLanguageCode = function (lang) { return core.cordova(this, "setLanguageCode", {}, arguments); };
    FirebaseX.prototype.signInWithCredential = function (credential) { return core.cordova(this, "signInWithCredential", {}, arguments); };
    FirebaseX.prototype.createUserWithEmailAndPassword = function (email, password) { return core.cordova(this, "createUserWithEmailAndPassword", {}, arguments); };
    FirebaseX.prototype.signInUserWithEmailAndPassword = function (email, password) { return core.cordova(this, "signInUserWithEmailAndPassword", {}, arguments); };
    FirebaseX.prototype.signInUserWithCustomToken = function (customToken) { return core.cordova(this, "signInUserWithCustomToken", {}, arguments); };
    FirebaseX.prototype.signInUserAnonymously = function () { return core.cordova(this, "signInUserAnonymously", {}, arguments); };
    FirebaseX.prototype.authenticateUserWithGoogle = function (clientId) { return core.cordova(this, "authenticateUserWithGoogle", {}, arguments); };
    FirebaseX.prototype.authenticateUserWithApple = function (locale) { return core.cordova(this, "authenticateUserWithApple", { "callbackOrder": "reverse" }, arguments); };
    FirebaseX.prototype.linkUserWithCredential = function (credential, success, error) { return core.cordova(this, "linkUserWithCredential", {}, arguments); };
    FirebaseX.prototype.reauthenticateWithCredential = function (credential, success, error) { return core.cordova(this, "reauthenticateWithCredential", {}, arguments); };
    FirebaseX.prototype.isUserSignedIn = function () { return core.cordova(this, "isUserSignedIn", {}, arguments); };
    FirebaseX.prototype.signOutUser = function () { return core.cordova(this, "signOutUser", {}, arguments); };
    FirebaseX.prototype.updateUserProfile = function (profile) { return core.cordova(this, "updateUserProfile", {}, arguments); };
    FirebaseX.prototype.updateUserEmail = function (email) { return core.cordova(this, "updateUserEmail", {}, arguments); };
    FirebaseX.prototype.sendUserEmailVerification = function () { return core.cordova(this, "sendUserEmailVerification", {}, arguments); };
    FirebaseX.prototype.updateUserPassword = function (password) { return core.cordova(this, "updateUserPassword", {}, arguments); };
    FirebaseX.prototype.sendUserPasswordResetEmail = function (email) { return core.cordova(this, "sendUserPasswordResetEmail", {}, arguments); };
    FirebaseX.prototype.deleteUser = function () { return core.cordova(this, "deleteUser", {}, arguments); };
    FirebaseX.prototype.registerAuthStateChangeListener = function (fn) { return core.cordova(this, "registerAuthStateChangeListener", {}, arguments); };
    FirebaseX.prototype.fetch = function (cacheExpirationSeconds) { return core.cordova(this, "fetch", {}, arguments); };
    FirebaseX.prototype.activateFetched = function () { return core.cordova(this, "activateFetched", {}, arguments); };
    FirebaseX.prototype.getValue = function (key) { return core.cordova(this, "getValue", {}, arguments); };
    FirebaseX.prototype.getByteArray = function (key) { return core.cordova(this, "getByteArray", {}, arguments); };
    FirebaseX.prototype.getInfo = function () { return core.cordova(this, "getInfo", {}, arguments); };
    FirebaseX.prototype.setConfigSettings = function (settings) { return core.cordova(this, "setConfigSettings", {}, arguments); };
    FirebaseX.prototype.setDefaults = function (settings) { return core.cordova(this, "setDefaults", {}, arguments); };
    FirebaseX.prototype.startTrace = function (name) { return core.cordova(this, "startTrace", {}, arguments); };
    FirebaseX.prototype.incrementCounter = function (name) { return core.cordova(this, "incrementCounter", {}, arguments); };
    FirebaseX.prototype.stopTrace = function (name) { return core.cordova(this, "stopTrace", {}, arguments); };
    FirebaseX.prototype.addDocumentToFirestoreCollection = function (document, collection, success, error) { return core.cordova(this, "addDocumentToFirestoreCollection", {}, arguments); };
    FirebaseX.prototype.setDocumentInFirestoreCollection = function (documentId, document, collection, success, error) { return core.cordova(this, "setDocumentInFirestoreCollection", {}, arguments); };
    FirebaseX.prototype.updateDocumentInFirestoreCollection = function (documentId, document, collection, success, error) { return core.cordova(this, "updateDocumentInFirestoreCollection", {}, arguments); };
    FirebaseX.prototype.deleteDocumentFromFirestoreCollection = function (documentId, collection, success, error) { return core.cordova(this, "deleteDocumentFromFirestoreCollection", {}, arguments); };
    FirebaseX.prototype.fetchDocumentInFirestoreCollection = function (documentId, collection, success, error) { return core.cordova(this, "fetchDocumentInFirestoreCollection", {}, arguments); };
    FirebaseX.prototype.fetchFirestoreCollection = function (collection, success, error) { return core.cordova(this, "fetchFirestoreCollection", {}, arguments); };
    FirebaseX.pluginName = "FirebaseX";
    FirebaseX.plugin = "cordova-plugin-firebasex";
    FirebaseX.pluginRef = "FirebasePlugin";
    FirebaseX.repo = "https://github.com/dpa99c/cordova-plugin-firebasex";
    FirebaseX.platforms = ["Android", "iOS"];
    FirebaseX.decorators = [
        { type: core$1.Injectable }
    ];
    return FirebaseX;
}(core.IonicNativePlugin));

exports.FirebaseX = FirebaseX;
