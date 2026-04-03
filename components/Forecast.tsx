'use client';

import { ForecastData, ForecastItem, TemperatureUnit } from '@/types/weather';
import { getWeatherEmoji, formatTemp } from '@/utils/weather';

interface ForecastProps {
  data: ForecastData;
  unit: TemperatureUnit;
}

interface DailyForecast {
  date: string;
  dayName: string;
  icon: string;
  id: number;
  tempMax: number;
  tempMin: number;
  description: string;
  pop: number;
}

function groupByDay(items: ForecastItem[]): DailyForecast[] {
  const days: Record<string, ForecastItem[]> = {};

  items.forEach((item) => {
    const date = item.dt_txt.split(' ')[0];
    if (!days[date]) {
      days[date] = [];
    }
    days[date].push(item);
  });

  const today = new Date().toISOString().split('T')[0];

  return Object.entries(days)
    .filter(([date]) => date !== today)
    .slice(0, 5)
    .map(([date, dayItems]) => {
      const temps = dayItems.map((i) => i.main.temp);
      const tempMax = Math.max(...temps);
      const tempMin = Math.min(...temps);
      const midday = dayItems.find((i) => i.dt_txt.includes('12:00:00')) ?? dayItems[Math.floor(dayItems.length / 2)];
      const weather = midday.weather[0];
      const pop = Math.max(...dayItems.map((i) => i.pop));

      const d = new Date(date + 'T12:00:00');
      const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });

      return {
        date,
        dayName,
        icon: weather?.icon ?? '',
        id: weather?.id ?? 800,
        tempMax,
        tempMin,
        description: weather?.description ?? '',
        pop,
      };
    });
}

export default function Forecast({ data, unit }: ForecastProps) {
  const dailyForecasts = groupByDay(data.list);

  return (
    <div className="weather-card">
      <div className="forecast-title">5-Day Forecast</div>
      <div className="forecast-grid">
        {dailyForecasts.map((day) => (
          <div key={day.date} className="forecast-item">
            <div className="forecast-day">{day.dayName}</div>
            <div className="forecast-icon">{getWeatherEmoji(day.id, day.icon)}</div>
            <div className="forecast-temps">
              <span className="temp-high">{formatTemp(day.tempMax, unit)}</span>
              <span className="temp-low">{formatTemp(day.tempMin, unit)}</span>
            </div>
            <div className="forecast-desc">{day.description}</div>
            {day.pop > 0 && (
              <div className="forecast-desc">💧 {Math.round(day.pop * 100)}%</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
