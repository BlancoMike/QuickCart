import { Inngest } from "inngest";

export const inngest = new Inngest({
  name: "QuickCart",
  eventKey: process.env.INNGEST_EVENT_KEY,
});
