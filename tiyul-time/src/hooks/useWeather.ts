import { useEffect, useState } from 'react';

interface Weather {
  tempF: number;
  condition: string;
  emoji: string;
}

const weatherCache = new Map<string, Weather>();

function describe(code: number): { condition: string; emoji: string } {
  if (code === 0) return { condition: 'Clear sky', emoji: '☀️' };
  if (code <= 2) return { condition: 'Mostly clear', emoji: '🌤️' };
  if (code === 3) return { condition: 'Overcast', emoji: '☁️' };
  if (code === 45 || code === 48) return { condition: 'Foggy', emoji: '🌫️' };
  if (code >= 51 && code <= 57) return { condition: 'Drizzle', emoji: '🌦️' };
  if (code >= 61 && code <= 67) return { condition: 'Rain', emoji: '🌧️' };
  if (code >= 71 && code <= 77) return { condition: 'Snow', emoji: '❄️' };
  if (code >= 80 && code <= 82) return { condition: 'Showers', emoji: '🌦️' };
  if (code >= 95) return { condition: 'Thunderstorm', emoji: '⛈️' };
  return { condition: 'Clear sky', emoji: '☀️' };
}

export function useWeather(lat: number, lon: number) {
  const key = `${lat.toFixed(2)},${lon.toFixed(2)}`;
  const [weather, setWeather] = useState<Weather | null>(weatherCache.get(key) ?? null);

  useEffect(() => {
    if (weatherCache.has(key)) {
      setWeather(weatherCache.get(key)!);
      return;
    }
    let cancelled = false;
    fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&temperature_unit=fahrenheit`
    )
      .then((res) => res.json())
      .then((data) => {
        if (cancelled || !data?.current_weather) return;
        const { condition, emoji } = describe(data.current_weather.weathercode);
        const result: Weather = { tempF: Math.round(data.current_weather.temperature), condition, emoji };
        weatherCache.set(key, result);
        setWeather(result);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [key, lat, lon]);

  return weather;
}
