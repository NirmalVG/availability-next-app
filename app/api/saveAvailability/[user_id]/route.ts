import { NextRequest, NextResponse } from "next/server";
import redis from "../../../../lib/redis"; // Adjust the import path as necessary

export async function POST(req: NextRequest) {
  const userId = req.nextUrl.pathname.split("/")[3];
  try {
    // Parse the request body to get the updated availability
    const { availability, selectedDays } = await req.json();

    // Create the session data object with the new availability
    const sessionData = { availability, selectedDays };

    // Save the availability data to Redis
    await redis.set(`availability:${userId}`, JSON.stringify(sessionData));


    // Return the saved availability directly as a response
    return NextResponse.json({
      message: "Availability saved successfully",
      availability,
      selectedDays,
    });
  } catch (error) {
    return NextResponse.json({
      status: 500,
      message: "Error saving availability data",
    });
  }
}
