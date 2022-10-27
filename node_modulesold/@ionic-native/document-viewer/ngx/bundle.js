'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var tslib = require('tslib');
var core = require('@ionic-native/core');
var core$1 = require('@angular/core');

var DocumentViewer = /** @class */ (function (_super) {
    tslib.__extends(DocumentViewer, _super);
    function DocumentViewer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    DocumentViewer.prototype.getSupportInfo = function () { return core.cordova(this, "getSupportInfo", {}, arguments); };
    DocumentViewer.prototype.canViewDocument = function (url, contentType, options, onPossible, onMissingApp, onImpossible, onError) { return core.cordova(this, "canViewDocument", { "sync": true }, arguments); };
    DocumentViewer.prototype.viewDocument = function (url, contentType, options, onShow, onClose, onMissingApp, onError) { return core.cordova(this, "viewDocument", { "sync": true }, arguments); };
    DocumentViewer.pluginName = "Document Viewer";
    DocumentViewer.plugin = "cordova-plugin-document-viewer";
    DocumentViewer.pluginRef = "SitewaertsDocumentViewer";
    DocumentViewer.repo = "https://github.com/sitewaerts/cordova-plugin-document-viewer";
    DocumentViewer.platforms = ["Android", "iOS", "Windows"];
    DocumentViewer.decorators = [
        { type: core$1.Injectable }
    ];
    return DocumentViewer;
}(core.IonicNativePlugin));

exports.DocumentViewer = DocumentViewer;
