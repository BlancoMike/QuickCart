import { inngest } from "@/inngest/client";
import connectDB from "@/config/db";
import User from "@/models/User";

export const syncUserCreation = inngest.createFunction(
  { id: "sync-user-from-clerk" },
  { event: ["clerk/user.created"] },
  async ({ event }) => {
    await connectDB();
    await User.create(event.data);
  }
);

export const syncUserUpdate = inngest.createFunction(
  { id: "update-user-from-clerk" },
  { event: ["clerk/user.updated"] },
  async ({ event }) => {
    await connectDB();
    await User.findByIdAndUpdate(event.data.id, event.data, { new: true });
  }
);

export const syncUserDelete = inngest.createFunction(
  { id: "delete-user-from-clerk" },
  { event: ["clerk/user.deleted"] },
  async ({ event }) => {
    await connectDB();
    await User.findByIdAndDelete(event.data.id);
  }
);
