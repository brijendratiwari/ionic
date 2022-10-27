'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var tslib = require('tslib');
var core$1 = require('@angular/core');
var core = require('@ionic-native/core');

var Appsflyer = /** @class */ (function (_super) {
    tslib.__extends(Appsflyer, _super);
    function Appsflyer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Appsflyer.prototype.initSdk = function (options) { return core.cordova(this, "initSdk", {}, arguments); };
    Appsflyer.prototype.logEvent = function (eventName, eventValues) { return core.cordova(this, "logEvent", {}, arguments); };
    Appsflyer.prototype.setAppUserId = function (customerUserId) { return core.cordova(this, "setAppUserId", { "sync": true }, arguments); };
    Appsflyer.prototype.Stop = function (isStopTracking) { return core.cordova(this, "Stop", { "sync": true }, arguments); };
    Appsflyer.prototype.registerOnAppOpenAttribution = function () { return core.cordova(this, "registerOnAppOpenAttribution", {}, arguments); };
    Appsflyer.prototype.enableUninstallTracking = function (token) { return core.cordova(this, "enableUninstallTracking", {}, arguments); };
    Appsflyer.prototype.updateServerUninstallToken = function (token) { return core.cordova(this, "updateServerUninstallToken", { "sync": true }, arguments); };
    Appsflyer.prototype.registerUninstall = function (token) { return core.cordova(this, "registerUninstall", { "sync": true }, arguments); };
    Appsflyer.prototype.getAppsFlyerUID = function () { return core.cordova(this, "getAppsFlyerUID", {}, arguments); };
    Appsflyer.prototype.anonymizeUser = function (disable) { return core.cordova(this, "anonymizeUser", { "sync": true }, arguments); };
    Appsflyer.prototype.setAppInviteOneLinkID = function (oneLinkId) { return core.cordova(this, "setAppInviteOneLinkID", { "sync": true }, arguments); };
    Appsflyer.prototype.generateInviteLink = function (options) { return core.cordova(this, "generateInviteLink", {}, arguments); };
    Appsflyer.prototype.logCrossPromotionImpression = function (appId, campaign) { return core.cordova(this, "logCrossPromotionImpression", { "sync": true }, arguments); };
    Appsflyer.prototype.logCrossPromotionAndOpenStore = function (appId, campaign, options) { return core.cordova(this, "logCrossPromotionAndOpenStore", { "sync": true }, arguments); };
    Appsflyer.pluginName = "Appsflyer";
    Appsflyer.plugin = "cordova-plugin-appsflyer-sdk";
    Appsflyer.pluginRef = "window.plugins.appsFlyer";
    Appsflyer.repo = "https://github.com/AppsFlyerSDK/cordova-plugin-appsflyer-sdk";
    Appsflyer.platforms = ["iOS", "Android"];
    Appsflyer.install = "Add to config.xml like stated on github and then start";
    Appsflyer.decorators = [
        { type: core$1.Injectable }
    ];
    return Appsflyer;
}(core.IonicNativePlugin));

exports.Appsflyer = Appsflyer;
