import { NextRequest, NextResponse } from 'next/server';

const API_KEY = process.env.OPENWEATHER_API_KEY;
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q');
  const lat = searchParams.get('lat');
  const lon = searchParams.get('lon');
  const units = searchParams.get('units') || 'metric';

  if (!API_KEY) {
    return NextResponse.json(
      { error: 'API key not configured. Please set OPENWEATHER_API_KEY environment variable.' },
      { status: 503 }
    );
  }

  let url: string;
  if (lat && lon) {
    url = `${BASE_URL}/weather?lat=${lat}&lon=${lon}&units=${units}&appid=${API_KEY}`;
  } else if (q) {
    url = `${BASE_URL}/weather?q=${encodeURIComponent(q)}&units=${units}&appid=${API_KEY}`;
  } else {
    return NextResponse.json({ error: 'Please provide a city name or coordinates.' }, { status: 400 });
  }

  try {
    const res = await fetch(url, { next: { revalidate: 300 } });
    const data = await res.json();

    if (!res.ok) {
      const message = data.message || 'Failed to fetch weather data';
      return NextResponse.json({ error: message }, { status: res.status });
    }

    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: 'Network error. Please try again.' }, { status: 500 });
  }
}
