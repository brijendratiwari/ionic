'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var tslib = require('tslib');
var core$1 = require('@angular/core');
var core = require('@ionic-native/core');

var ActionSheet = /** @class */ (function (_super) {
    tslib.__extends(ActionSheet, _super);
    function ActionSheet() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        /**
         * Convenience property to select an Android theme value
         */
        _this.ANDROID_THEMES = {
            THEME_TRADITIONAL: 1,
            THEME_HOLO_DARK: 2,
            THEME_HOLO_LIGHT: 3,
            THEME_DEVICE_DEFAULT_DARK: 4,
            THEME_DEVICE_DEFAULT_LIGHT: 5,
        };
        return _this;
    }
    ActionSheet.prototype.show = function (options) { return core.cordova(this, "show", {}, arguments); };
    ActionSheet.prototype.hide = function (options) { return core.cordova(this, "hide", {}, arguments); };
    ActionSheet.pluginName = "ActionSheet";
    ActionSheet.plugin = "cordova-plugin-actionsheet";
    ActionSheet.pluginRef = "plugins.actionsheet";
    ActionSheet.repo = "https://github.com/EddyVerbruggen/cordova-plugin-actionsheet";
    ActionSheet.platforms = ["Android", "Browser", "iOS", "Windows", "Windows Phone 8"];
    ActionSheet.decorators = [
        { type: core$1.Injectable }
    ];
    return ActionSheet;
}(core.IonicNativePlugin));

exports.ActionSheet = ActionSheet;
