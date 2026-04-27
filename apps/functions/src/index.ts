import { setGlobalOptions } from "firebase-functions/v2";
import { initializeApp } from "firebase-admin/app";

initializeApp();

setGlobalOptions({ maxInstances: 10 });

// Export functions here
export * from './groqProxy';
export * from './createPayment';
export * from './stripeWebhook';

import { onRequest } from "firebase-functions/v2/https";
export const helloWorld = onRequest((request, response) => {
  response.send("Hello from Brienz AI Guide!");
});
