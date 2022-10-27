'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var tslib = require('tslib');
var core$1 = require('@angular/core');
var core = require('@ionic-native/core');

var GooglePlus = /** @class */ (function (_super) {
    tslib.__extends(GooglePlus, _super);
    function GooglePlus() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    GooglePlus.prototype.login = function (options) { return core.cordova(this, "login", { "successIndex": 1, "errorIndex": 2 }, arguments); };
    GooglePlus.prototype.trySilentLogin = function (options) { return core.cordova(this, "trySilentLogin", {}, arguments); };
    GooglePlus.prototype.logout = function () { return core.cordova(this, "logout", {}, arguments); };
    GooglePlus.prototype.disconnect = function () { return core.cordova(this, "disconnect", {}, arguments); };
    GooglePlus.prototype.getSigningCertificateFingerprint = function () { return core.cordova(this, "getSigningCertificateFingerprint", {}, arguments); };
    GooglePlus.pluginName = "GooglePlus";
    GooglePlus.plugin = "cordova-plugin-googleplus";
    GooglePlus.pluginRef = "window.plugins.googleplus";
    GooglePlus.repo = "https://github.com/EddyVerbruggen/cordova-plugin-googleplus";
    GooglePlus.install = "ionic cordova plugin add cordova-plugin-googleplus --variable REVERSED_CLIENT_ID=myreversedclientid";
    GooglePlus.installVariables = ["REVERSED_CLIENT_ID"];
    GooglePlus.platforms = ["Android", "iOS"];
    GooglePlus.decorators = [
        { type: core$1.Injectable }
    ];
    return GooglePlus;
}(core.IonicNativePlugin));

exports.GooglePlus = GooglePlus;
