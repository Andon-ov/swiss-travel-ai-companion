"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.helloWorld = void 0;
const v2_1 = require("firebase-functions/v2");
const app_1 = require("firebase-admin/app");
(0, app_1.initializeApp)();
(0, v2_1.setGlobalOptions)({ maxInstances: 10 });
const https_1 = require("firebase-functions/v2/https");
exports.helloWorld = (0, https_1.onRequest)((request, response) => {
    response.send("Hello from Brienz AI Guide!");
});
//# sourceMappingURL=index.js.map