'use client';

import { useState, useCallback } from 'react';
import SearchForm from '@/components/SearchForm';
import CurrentWeather from '@/components/CurrentWeather';
import Forecast from '@/components/Forecast';
import { WeatherData, ForecastData } from '@/types/weather';

export default function Home() {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [forecastData, setForecastData] = useState<ForecastData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [unit, setUnit] = useState<'metric' | 'imperial'>('metric');

  const fetchWeather = useCallback(async (query: string) => {
    setLoading(true);
    setError(null);
    try {
      const [weatherRes, forecastRes] = await Promise.all([
        fetch(`/api/weather?q=${encodeURIComponent(query)}&units=${unit}`),
        fetch(`/api/forecast?q=${encodeURIComponent(query)}&units=${unit}`),
      ]);

      if (!weatherRes.ok) {
        const data = await weatherRes.json();
        throw new Error(data.error || 'Failed to fetch weather data');
      }
      if (!forecastRes.ok) {
        const data = await forecastRes.json();
        throw new Error(data.error || 'Failed to fetch forecast data');
      }

      const weather: WeatherData = await weatherRes.json();
      const forecast: ForecastData = await forecastRes.json();

      setWeatherData(weather);
      setForecastData(forecast);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
      setWeatherData(null);
      setForecastData(null);
    } finally {
      setLoading(false);
    }
  }, [unit]);

  const fetchByCoords = useCallback(async (lat: number, lon: number) => {
    setLoading(true);
    setError(null);
    try {
      const [weatherRes, forecastRes] = await Promise.all([
        fetch(`/api/weather?lat=${lat}&lon=${lon}&units=${unit}`),
        fetch(`/api/forecast?lat=${lat}&lon=${lon}&units=${unit}`),
      ]);

      if (!weatherRes.ok) {
        const data = await weatherRes.json();
        throw new Error(data.error || 'Failed to fetch weather data');
      }
      if (!forecastRes.ok) {
        const data = await forecastRes.json();
        throw new Error(data.error || 'Failed to fetch forecast data');
      }

      const weather: WeatherData = await weatherRes.json();
      const forecast: ForecastData = await forecastRes.json();

      setWeatherData(weather);
      setForecastData(forecast);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
      setWeatherData(null);
      setForecastData(null);
    } finally {
      setLoading(false);
    }
  }, [unit]);

  const handleUnitChange = (newUnit: 'metric' | 'imperial') => {
    setUnit(newUnit);
    if (weatherData) {
      const query = `${weatherData.name},${weatherData.sys.country}`;
      setTimeout(() => fetchWeather(query), 0);
    }
  };

  return (
    <main className="container">
      <div className="header">
        <h1>⛅ Weather Forecast</h1>
        <p>Real-time weather data and 5-day forecast</p>
      </div>

      <div className="api-note">
        <strong>Note:</strong> This app uses the{' '}
        <a href="https://openweathermap.org/api" target="_blank" rel="noopener noreferrer">
          OpenWeatherMap API
        </a>. Set your <code>OPENWEATHER_API_KEY</code> environment variable to enable live data.
        Get a free key at{' '}
        <a href="https://home.openweathermap.org/users/sign_up" target="_blank" rel="noopener noreferrer">
          openweathermap.org
        </a>.
      </div>

      <SearchForm onSearch={fetchWeather} onLocate={fetchByCoords} loading={loading} />

      {error && (
        <div className="error-message">
          ⚠️ {error}
        </div>
      )}

      {loading && (
        <div className="loading">
          <div className="spinner" />
          <p>Fetching weather data...</p>
        </div>
      )}

      {!loading && !error && !weatherData && (
        <div className="welcome">
          <div className="welcome-icon">🌍</div>
          <h2>Search for a location</h2>
          <p>Enter a city name or use your current location to get real-time weather information and a 5-day forecast.</p>
        </div>
      )}

      {!loading && weatherData && (
        <>
          <div className="unit-toggle">
            <button
              className={`unit-btn${unit === 'metric' ? ' active' : ''}`}
              onClick={() => handleUnitChange('metric')}
            >
              °C
            </button>
            <button
              className={`unit-btn${unit === 'imperial' ? ' active' : ''}`}
              onClick={() => handleUnitChange('imperial')}
            >
              °F
            </button>
          </div>
          <CurrentWeather data={weatherData} unit={unit} />
          {forecastData && <Forecast data={forecastData} unit={unit} />}
        </>
      )}
    </main>
  );
}
