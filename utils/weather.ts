import { TemperatureUnit } from '@/types/weather';

export function getWeatherEmoji(conditionId: number, icon: string): string {
  const isNight = icon.endsWith('n');

  if (conditionId >= 200 && conditionId < 300) return '⛈️';
  if (conditionId >= 300 && conditionId < 400) return '🌦️';
  if (conditionId >= 500 && conditionId < 600) {
    if (conditionId === 511) return '🌨️';
    if (conditionId >= 502) return '🌧️';
    return '🌧️';
  }
  if (conditionId >= 600 && conditionId < 700) return '❄️';
  if (conditionId >= 700 && conditionId < 800) {
    if (conditionId === 741) return '🌫️';
    if (conditionId === 781) return '🌪️';
    return '🌫️';
  }
  if (conditionId === 800) return isNight ? '🌙' : '☀️';
  if (conditionId === 801) return isNight ? '🌙' : '🌤️';
  if (conditionId === 802) return '⛅';
  if (conditionId === 803 || conditionId === 804) return '☁️';
  return '🌡️';
}

export function formatTemp(temp: number, unit: TemperatureUnit): string {
  const rounded = Math.round(temp);
  return unit === 'metric' ? `${rounded}°C` : `${rounded}°F`;
}

export function formatWindSpeed(speed: number, unit: TemperatureUnit): string {
  if (unit === 'imperial') {
    return `${Math.round(speed)} mph`;
  }
  return `${Math.round(speed)} m/s`;
}

export function getWindDirection(deg: number): string {
  const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  const index = Math.round(deg / 45) % 8;
  return directions[index] ?? 'N';
}

export function formatTime(unixTimestamp: number): string {
  const date = new Date(unixTimestamp * 1000);
  return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
}

export function getUVIndexLabel(uvi: number): string {
  if (uvi <= 2) return 'Low';
  if (uvi <= 5) return 'Moderate';
  if (uvi <= 7) return 'High';
  if (uvi <= 10) return 'Very High';
  return 'Extreme';
}
