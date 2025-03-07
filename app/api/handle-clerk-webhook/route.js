import connectDB from "@/config/db";
import User from "@/models/User";

// Handle POST, GET, and PUT requests for Clerk webhooks

// POST request: Process webhook events from Clerk
export async function POST(req) {
  try {
    const { type, data } = await req.json();
    await connectDB();

    // Handle different Clerk webhook events
    if (type === "clerk/user.created") {
      // Create new user
      await User.create(data);
    } else if (type === "clerk/user.updated") {
      // Update existing user
      await User.findByIdAndUpdate(data.id, data, { new: true });
    } else if (type === "clerk/user.deleted") {
      // Delete user
      await User.findByIdAndDelete(data.id);
    } else {
      return new Response(JSON.stringify({ message: "Invalid event type" }), {
        status: 400,
      });
    }

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    console.error("Error processing POST webhook:", error);
    return new Response(
      JSON.stringify({ error: "Webhook processing failed" }),
      { status: 500 }
    );
  }
}

// GET request: Retrieve all users from MongoDB
export async function GET(req) {
  try {
    const users = await User.find({});
    return new Response(JSON.stringify({ users }), { status: 200 });
  } catch (error) {
    console.error("Error fetching user data:", error);
    return new Response(JSON.stringify({ error: "Failed to fetch users" }), {
      status: 500,
    });
  }
}

// PUT request: Update user information based on ID
export async function PUT(req) {
  try {
    const { id, data } = await req.json();
    await connectDB();

    const updatedUser = await User.findByIdAndUpdate(id, data, { new: true });

    if (!updatedUser) {
      return new Response(JSON.stringify({ error: "User not found" }), {
        status: 404,
      });
    }

    return new Response(JSON.stringify({ updatedUser }), { status: 200 });
  } catch (error) {
    console.error("Error processing PUT request:", error);
    return new Response(JSON.stringify({ error: "Failed to update user" }), {
      status: 500,
    });
  }
}
