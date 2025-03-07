import { NextResponse } from "next/server";
import connectDB from "@/config/db"; // MongoDB connection
import User from "@/models/User"; // User model
import { isValidObjectId } from "mongoose";

// Handle POST request from Make.com Webhook
export async function POST(req) {
  try {
    // Connect to MongoDB
    await connectDB();

    // Get data from the Make.com webhook
    const data = await req.json();
    console.log("Received data:", data);

    // Destructure the event and user data from the webhook payload
    const { event, data: user } = data; // Adjust based on the Make.com webhook structure
    console.log("Event type:", event);
    console.log("User data:", user);

    // Validate incoming data
    if (!event || !user || !user.id || !user.email) {
      console.error("Invalid payload:", data);
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    // Handle user creation, update, or deletion based on event type
    if (event === "clerk/user.created") {
      // Create a new user in the database
      await User.create({
        _id: user.id,
        name: user.name,
        email: user.email,
        imageUrl: user.imageUrl,
        cartItems: user.cartItems || [], // Assuming the cartItems field exists
      });
    } else if (event === "clerk/user.updated") {
      // Validate user ID
      if (!isValidObjectId(user.id)) {
        console.error("Invalid user ID:", user.id);
        return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });
      }
      // Update an existing user in the database
      await User.findByIdAndUpdate(
        user.id,
        {
          name: user.name,
          email: user.email,
          imageUrl: user.imageUrl,
          cartItems: user.cartItems,
        },
        { new: true }
      );
    } else if (event === "clerk/user.deleted") {
      // Validate user ID
      if (!isValidObjectId(user.id)) {
        console.error("Invalid user ID:", user.id);
        return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });
      }
      // Delete the user from the database
      await User.findByIdAndDelete(user.id);
    } else {
      console.error("Invalid event type:", event);
      return NextResponse.json(
        { message: "Invalid event type" },
        { status: 400 }
      );
    }

    // Return a success response
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error processing POST webhook:", error);
    // Return an error response in case of failure
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }
}

// Handle GET request (testing endpoint)
export async function GET() {
  return NextResponse.json({ message: "Make.com Webhook is Active!" });
}

// Handle PUT request for any specific operations you might need (if applicable)
export async function PUT(req) {
  try {
    // Connect to MongoDB
    await connectDB();

    // Get the updated user data from the request body
    const userData = await req.json();
    console.log("Received PUT data:", userData);

    // Validate user ID
    if (!isValidObjectId(userData.id)) {
      console.error("Invalid user ID:", userData.id);
      return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });
    }

    // Update the user in the database (based on your use case)
    const updatedUser = await User.findByIdAndUpdate(
      userData.id,
      { ...userData }, // Update with provided user data
      { new: true }
    );

    // Return the updated user as a response
    return NextResponse.json({ success: true, updatedUser });
  } catch (error) {
    console.error("Error processing PUT request:", error);
    // Return an error response in case of failure
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
