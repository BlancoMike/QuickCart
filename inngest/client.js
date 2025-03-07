import { Inngest } from "inngest";

export const inngest = new Inngest({
  name: "QuickCart",
  id: "quickcart-app", // Add a unique ID for your app
  eventKey: process.env.INNGEST_EVENT_KEY,
});
