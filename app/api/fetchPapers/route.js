import { NextResponse } from "next/server";

const CORE_API_URL = "https://api.core.ac.uk/v3/search/works"; // Corrected URL
const API_KEY = process.env.NEXT_PUBLIC_CORE_API_KEY; // Store your API Key in `.env.local`

export async function GET(req) {
  try {
    // Extract search query from request URL
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("query");

    if (!query) {
      return NextResponse.json(
        { error: "Query parameter is missing" },
        { status: 400 }
      );
    }

    // Call CORE API
    const response = await fetch(`${CORE_API_URL}?q=${query}`, {
      headers: {
        Authorization: `Bearer ${API_KEY}`, // API Key in header
      },
    });

    if (!response.ok) {
      console.error("CORE API error:", response.status, response.statusText);
      const errorData = await response.json(); // Get the error details
      console.error("CORE API error details:", errorData); // Log details
      return NextResponse.json(
        { error: "Failed to fetch research papers from CORE API" },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log("data: ", data);

    return NextResponse.json({ papers: data.results || [] });
  } catch (error) {
    console.error("Error fetching papers:", error);
    return NextResponse.json(
      { error: "Failed to fetch research papers" },
      { status: 500 }
    );
  }
}
