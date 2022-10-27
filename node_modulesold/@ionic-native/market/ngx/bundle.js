'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var tslib = require('tslib');
var core$1 = require('@angular/core');
var core = require('@ionic-native/core');

var Market = /** @class */ (function (_super) {
    tslib.__extends(Market, _super);
    function Market() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Market.prototype.open = function (appId) { return core.cordova(this, "open", { "callbackStyle": "object", "successName": "success", "errorName": "failure" }, arguments); };
    Market.prototype.search = function (keyword) { return core.cordova(this, "search", { "callbackStyle": "object", "successName": "success", "errorName": "failure", "platforms": ["Android"] }, arguments); };
    Market.pluginName = "Market";
    Market.plugin = "cordova-plugin-market";
    Market.pluginRef = "cordova.plugins.market";
    Market.repo = "https://github.com/xmartlabs/cordova-plugin-market";
    Market.platforms = ["Android", "iOS"];
    Market.decorators = [
        { type: core$1.Injectable }
    ];
    return Market;
}(core.IonicNativePlugin));

exports.Market = Market;
