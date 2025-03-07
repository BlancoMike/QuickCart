import { serve } from "inngest/next";
import { inngest } from "@/inngest/client";
import {
  syncUserCreation,
  syncUserDelete,
  syncUserUpdate,
} from "@/inngest/functions";

// Log incoming requests
export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [syncUserCreation, syncUserDelete, syncUserUpdate],
  signingKey: process.env.INNGEST_SIGNING_KEY,
  onRequest: (req, res) => {
    console.log("Received request:", req.method, req.url);
    console.log("Request body:", req.body);
  },
});
