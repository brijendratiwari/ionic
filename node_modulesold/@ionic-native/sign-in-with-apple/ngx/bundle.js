'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var tslib = require('tslib');
var core$1 = require('@angular/core');
var core = require('@ionic-native/core');

var ASAuthorizationAppleIDRequest = /** @class */ (function () {
    function ASAuthorizationAppleIDRequest() {
    }
    ASAuthorizationAppleIDRequest.ASAuthorizationScopeFullName = 0;
    ASAuthorizationAppleIDRequest.ASAuthorizationScopeEmail = 1;
    return ASAuthorizationAppleIDRequest;
}());
var SignInWithApple = /** @class */ (function (_super) {
    tslib.__extends(SignInWithApple, _super);
    function SignInWithApple() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    SignInWithApple.prototype.signin = function (options) {
        if (options === void 0) { options = {}; }
        return core.cordova(this, "signin", {}, arguments);
    };
    SignInWithApple.pluginName = "Sign in with Apple";
    SignInWithApple.plugin = "cordova-plugin-sign-in-with-apple";
    SignInWithApple.pluginRef = "cordova.plugins.SignInWithApple";
    SignInWithApple.repo = "https://github.com/twogate/cordova-plugin-sign-in-with-apple";
    SignInWithApple.platforms = ["iOS"];
    SignInWithApple.decorators = [
        { type: core$1.Injectable }
    ];
    return SignInWithApple;
}(core.IonicNativePlugin));

exports.ASAuthorizationAppleIDRequest = ASAuthorizationAppleIDRequest;
exports.SignInWithApple = SignInWithApple;
