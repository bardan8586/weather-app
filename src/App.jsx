import { useState } from 'react';
import './App.css'
import CurrentWeather from './components/CurrentWeather';
import HourlyWeatherItem from './components/HourlyWeatherItem';
import SearchSection from './components/SearchSection';
import { weatherCodes } from './constants';

function App() {
  const [currentWeather, setCurrentWeather] = useState({});

  const getWeatherDetails = async (API_URL) => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      console.log("API Response:", data);

      if (!data.current) {
        console.error("Current weather data is missing!");
        return;
      }

      const temperature = Math.floor(data.current.temp_c);
      const description = data.current.condition.text;
      
      // ✅ Fixed: Proper usage of `Object.keys`
      const weatherIcon = Object.keys(weatherCodes)
        .find((icon) => weatherCodes[icon].includes(data.current.condition.code));

      setCurrentWeather({ temperature, description, weatherIcon });

    } catch (error) {
      console.error("Error fetching weather data:", error);
    }
  };

  return (
    <div className="container">
      {/* Search Section */}
      <SearchSection getWeatherDetails={getWeatherDetails} />
      
      <div className="weather-section">
        {/* Current Weather */}
        <CurrentWeather currentWeather={currentWeather} />

        {/* Hourly Forecast */}
        <div className="hourly-forecast">
          <ul className="weather-list">
            <HourlyWeatherItem />
          </ul>
        </div>
      </div>
    </div>
  );
}

export default App;
