import { serve } from "inngest/next";
import { inngest } from "@/inngest/client";
import {
  syncUserCreation,
  syncUserDelete,
  syncUserUpdate,
} from "@/inngest/functions";

// Serve endpoint with proper configuration
export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [syncUserCreation, syncUserDelete, syncUserUpdate],
  signingKey: process.env.INNGEST_SIGNING_KEY,
});
