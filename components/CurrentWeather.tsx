'use client';

import { WeatherData, TemperatureUnit } from '@/types/weather';
import { getWeatherEmoji, formatTemp, formatWindSpeed, formatTime, getWindDirection } from '@/utils/weather';

interface CurrentWeatherProps {
  data: WeatherData;
  unit: TemperatureUnit;
}

export default function CurrentWeather({ data, unit }: CurrentWeatherProps) {
  const weather = data.weather[0];
  const emoji = getWeatherEmoji(weather?.id ?? 800, weather?.icon ?? '');
  const now = new Date();

  return (
    <div className="weather-card">
      <div className="current-weather">
        <div className="location-info">
          <h2>{data.name}</h2>
          <div className="country">{data.sys.country}</div>
          <div className="date-time">
            {now.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
          <div className="date-time">{now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</div>
        </div>
        <div className="temp-display">
          <div className="weather-icon">{emoji}</div>
          <div className="temperature">{formatTemp(data.main.temp, unit)}</div>
          <div className="feels-like">Feels like {formatTemp(data.main.feels_like, unit)}</div>
          <div className="description">{weather?.description ?? 'Unknown'}</div>
        </div>
      </div>

      <div className="weather-details">
        <div className="detail-item">
          <div className="detail-icon">🌡️</div>
          <div className="detail-label">High / Low</div>
          <div className="detail-value">
            {formatTemp(data.main.temp_max, unit)} / {formatTemp(data.main.temp_min, unit)}
          </div>
        </div>
        <div className="detail-item">
          <div className="detail-icon">💧</div>
          <div className="detail-label">Humidity</div>
          <div className="detail-value">{data.main.humidity}%</div>
        </div>
        <div className="detail-item">
          <div className="detail-icon">💨</div>
          <div className="detail-label">Wind</div>
          <div className="detail-value">
            {formatWindSpeed(data.wind.speed, unit)} {getWindDirection(data.wind.deg)}
          </div>
        </div>
        <div className="detail-item">
          <div className="detail-icon">🔵</div>
          <div className="detail-label">Pressure</div>
          <div className="detail-value">{data.main.pressure} hPa</div>
        </div>
        <div className="detail-item">
          <div className="detail-icon">👁️</div>
          <div className="detail-label">Visibility</div>
          <div className="detail-value">{(data.visibility / 1000).toFixed(1)} km</div>
        </div>
        <div className="detail-item">
          <div className="detail-icon">☁️</div>
          <div className="detail-label">Cloud Cover</div>
          <div className="detail-value">{data.clouds.all}%</div>
        </div>
        <div className="detail-item">
          <div className="detail-icon">🌅</div>
          <div className="detail-label">Sunrise</div>
          <div className="detail-value">{formatTime(data.sys.sunrise)}</div>
        </div>
        <div className="detail-item">
          <div className="detail-icon">🌇</div>
          <div className="detail-label">Sunset</div>
          <div className="detail-value">{formatTime(data.sys.sunset)}</div>
        </div>
      </div>
    </div>
  );
}
