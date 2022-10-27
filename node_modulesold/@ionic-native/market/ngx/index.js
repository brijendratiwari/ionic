import { __extends } from "tslib";
import { Injectable } from '@angular/core';
import { IonicNativePlugin, cordova } from '@ionic-native/core';
var Market = /** @class */ (function (_super) {
    __extends(Market, _super);
    function Market() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Market.prototype.open = function (appId) { return cordova(this, "open", { "callbackStyle": "object", "successName": "success", "errorName": "failure" }, arguments); };
    Market.prototype.search = function (keyword) { return cordova(this, "search", { "callbackStyle": "object", "successName": "success", "errorName": "failure", "platforms": ["Android"] }, arguments); };
    Market.pluginName = "Market";
    Market.plugin = "cordova-plugin-market";
    Market.pluginRef = "cordova.plugins.market";
    Market.repo = "https://github.com/xmartlabs/cordova-plugin-market";
    Market.platforms = ["Android", "iOS"];
    Market.decorators = [
        { type: Injectable }
    ];
    return Market;
}(IonicNativePlugin));
export { Market };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9zcmMvQGlvbmljLW5hdGl2ZS9wbHVnaW5zL21hcmtldC9uZ3gvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDM0MsT0FBTyw4QkFBc0MsTUFBTSxvQkFBb0IsQ0FBQzs7SUEwQjVDLDBCQUFpQjs7OztJQVczQyxxQkFBSSxhQUFDLEtBQWE7SUFlbEIsdUJBQU0sYUFBQyxPQUFlOzs7Ozs7O2dCQTNCdkIsVUFBVTs7aUJBMUJYO0VBMkI0QixpQkFBaUI7U0FBaEMsTUFBTSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IENvcmRvdmEsIElvbmljTmF0aXZlUGx1Z2luLCBQbHVnaW4gfSBmcm9tICdAaW9uaWMtbmF0aXZlL2NvcmUnO1xuLyoqXG4gKiBAbmFtZSBNYXJrZXRcbiAqIEBkZXNjcmlwdGlvblxuICogT3BlbnMgYW4gYXBwJ3MgcGFnZSBpbiB0aGUgbWFya2V0IHBsYWNlIChHb29nbGUgUGxheSwgQXBwIFN0b3JlKVxuICpcbiAqIEB1c2FnZVxuICogYGBgdHlwZXNjcmlwdFxuICogaW1wb3J0IHsgTWFya2V0IH0gZnJvbSAnQGlvbmljLW5hdGl2ZS9tYXJrZXQvbmd4JztcbiAqXG4gKiBjb25zdHJ1Y3Rvcihwcml2YXRlIG1hcmtldDogTWFya2V0KSB7IH1cbiAqXG4gKiAuLi5cbiAqXG4gKiB0aGlzLm1hcmtldC5vcGVuKCd5b3VyLnBhY2thZ2UubmFtZScpO1xuICpcbiAqIGBgYFxuICovXG5AUGx1Z2luKHtcbiAgcGx1Z2luTmFtZTogJ01hcmtldCcsXG4gIHBsdWdpbjogJ2NvcmRvdmEtcGx1Z2luLW1hcmtldCcsXG4gIHBsdWdpblJlZjogJ2NvcmRvdmEucGx1Z2lucy5tYXJrZXQnLFxuICByZXBvOiAnaHR0cHM6Ly9naXRodWIuY29tL3htYXJ0bGFicy9jb3Jkb3ZhLXBsdWdpbi1tYXJrZXQnLFxuICBwbGF0Zm9ybXM6IFsnQW5kcm9pZCcsICdpT1MnXSxcbn0pXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgTWFya2V0IGV4dGVuZHMgSW9uaWNOYXRpdmVQbHVnaW4ge1xuICAvKipcbiAgICogT3BlbnMgYW4gYXBwIGluIEdvb2dsZSBQbGF5IC8gQXBwIFN0b3JlXG4gICAqIEBwYXJhbSBhcHBJZCB7c3RyaW5nfSBQYWNrYWdlIG5hbWVcbiAgICogQHJldHVybiB7UHJvbWlzZTxhbnk+fVxuICAgKi9cbiAgQENvcmRvdmEoe1xuICAgIGNhbGxiYWNrU3R5bGU6ICdvYmplY3QnLFxuICAgIHN1Y2Nlc3NOYW1lOiAnc3VjY2VzcycsXG4gICAgZXJyb3JOYW1lOiAnZmFpbHVyZScsXG4gIH0pXG4gIG9wZW4oYXBwSWQ6IHN0cmluZyk6IFByb21pc2U8YW55PiB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgLyoqXG4gICAqIFNlYXJjaCBhcHBzIGJ5IGtleXdvcmRcbiAgICogQHBhcmFtIGtleXdvcmQge3N0cmluZ30gS2V5d29yZFxuICAgKiBAcmV0dXJuIHtQcm9taXNlPGFueT59XG4gICAqL1xuICBAQ29yZG92YSh7XG4gICAgY2FsbGJhY2tTdHlsZTogJ29iamVjdCcsXG4gICAgc3VjY2Vzc05hbWU6ICdzdWNjZXNzJyxcbiAgICBlcnJvck5hbWU6ICdmYWlsdXJlJyxcbiAgICBwbGF0Zm9ybXM6IFsnQW5kcm9pZCddLFxuICB9KVxuICBzZWFyY2goa2V5d29yZDogc3RyaW5nKTogUHJvbWlzZTxhbnk+IHtcbiAgICByZXR1cm47XG4gIH1cbn1cbiJdfQ==