import { NextRequest, NextResponse } from "next/server";
import redis from "../../../../lib/redis";

export async function GET(req: NextRequest) {
  const userId = req.nextUrl.pathname.split("/")[3];

  try {
    // Retrieve session data (availability) from Redis
    const sessionData = await redis.get(`availability:${userId}`);

    if (sessionData === null) {
      // If no data is found, return an empty availability object
      const emptyAvailability = {
        availability: [],
        selectedDays: [],
      };

      return NextResponse.json(emptyAvailability);
    } else {
      // If data exists, parse and return it
      return NextResponse.json(JSON.parse(sessionData));
    }
  } catch (error) {
    return NextResponse.json({
      status: 500,
      message: "Error processing session data",
    });
  }
}
