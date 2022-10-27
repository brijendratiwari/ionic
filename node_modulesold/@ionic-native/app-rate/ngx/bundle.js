'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var tslib = require('tslib');
var core$1 = require('@angular/core');
var core = require('@ionic-native/core');

exports.AppRateReviewTypeIos = void 0;
(function (AppRateReviewTypeIos) {
    /**
     * Write review directly in your application (iOS 10.3+), limited to 3 prompts per year.
     * Will fallback to 'AppStoreReview' for other iOS versions
     */
    AppRateReviewTypeIos["InAppReview"] = "InAppReview";
    /**
     * Open the store within the app. Use this option as an alternative to inAppReview to avoid the rate action from doing nothing
     */
    AppRateReviewTypeIos["AppStoreReview"] = "AppStoreReview";
    /**
     * Open the store using the openUrl preference (defaults to InAppBrowser). Be advised that WKWebView might not open the app store links
     */
    AppRateReviewTypeIos["InAppBrowser"] = "InAppBrowser";
})(exports.AppRateReviewTypeIos || (exports.AppRateReviewTypeIos = {}));
exports.AppRateReviewTypeAndroid = void 0;
(function (AppRateReviewTypeAndroid) {
    /**
     * Write review directly in your application. Will fallback to InAppBrowser if not available
     */
    AppRateReviewTypeAndroid["InAppReview"] = "InAppReview";
    /**
     *  Open the store using the openUrl preference (defaults to InAppBrowser)
     */
    AppRateReviewTypeAndroid["InAppBrowser"] = "InAppBrowser";
})(exports.AppRateReviewTypeAndroid || (exports.AppRateReviewTypeAndroid = {}));
exports.AppRatePromptType = void 0;
(function (AppRatePromptType) {
    /**
     * Prompt asking to rate the app.
     */
    AppRatePromptType["AppRatingPrompt"] = "AppRatingPrompt";
    /**
     * Prompt asking to rate the app within the store.
     */
    AppRatePromptType["StoreRatingPrompt"] = "StoreRatingPrompt";
    /**
     * Prompt asking to give feedback.
     */
    AppRatePromptType["FeedbackPrompt"] = "FeedbackPrompt";
})(exports.AppRatePromptType || (exports.AppRatePromptType = {}));
var AppRate = /** @class */ (function (_super) {
    tslib.__extends(AppRate, _super);
    function AppRate() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    AppRate.prototype.setPreferences = function (pref) { return core.cordova(this, "setPreferences", {}, arguments); };
    AppRate.prototype.getPreferences = function () { return core.cordova(this, "getPreferences", {}, arguments); };
    AppRate.prototype.promptForRating = function (immediately) { return core.cordova(this, "promptForRating", {}, arguments); };
    AppRate.prototype.navigateToAppStore = function () { return core.cordova(this, "navigateToAppStore", {}, arguments); };
    Object.defineProperty(AppRate.prototype, "preferences", {
        get: function () { return core.cordovaPropertyGet(this, "preferences"); },
        set: function (value) { core.cordovaPropertySet(this, "preferences", value); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(AppRate.prototype, "locales", {
        get: function () { return core.cordovaPropertyGet(this, "locales"); },
        set: function (value) { core.cordovaPropertySet(this, "locales", value); },
        enumerable: false,
        configurable: true
    });
    AppRate.pluginName = "AppRate";
    AppRate.plugin = "cordova-plugin-apprate";
    AppRate.pluginRef = "AppRate";
    AppRate.repo = "https://github.com/pushandplay/cordova-plugin-apprate";
    AppRate.platforms = ["Android", "BlackBerry 10", "iOS", "Windows"];
    AppRate.decorators = [
        { type: core$1.Injectable }
    ];
    return AppRate;
}(core.IonicNativePlugin));

exports.AppRate = AppRate;
