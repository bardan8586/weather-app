import { useEffect, useState } from "react";

import "./App.css";
import SearchSection from "./components/SearchSection";
import CurrentWeather from "./components/CurrentWeather";
import HourlyWeatherItems from "./components/HourlyWeatherItems";
import { weatherCodes } from "./constants";

function App() {
  const API_KEY = import.meta.env.VITE_API_KEY;
  const [currentWeather, setCurrentWeather] = useState({});

  //create state for hourly forecast and pass it to hourlyWeatherItem
  const [hourlyforecast, setHourlyForecast] = useState([]);
  const filterHourlyForecast = (hourlyData) => {
    // console.log(new Date());
    const currentHour = new Date().setMinutes(0, 0, 0);
    // console.log(new Date(), currentHour, "minutes");
    const next24Hours = currentHour + 24 * 60 * 60 * 1000;
    const next24HoursData = hourlyData.filter(({time}) =>{
      const foreCastTime = new Date(time).getTime();
      return foreCastTime >= currentHour && foreCastTime <= next24Hours;
    });
    // console.log(next24HoursData, "next24hoursdata");
    setHourlyForecast(next24HoursData);
  };


  const getWeatherDetails = async (API_URL) => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      console.log(data);

      //from this data get the temperature and description
      const temperature = Math.floor(data.current.temp_c);
      const description = data.current.condition.text;
      const weatherIcon = Object.keys(weatherCodes).find((icon) =>
        weatherCodes[icon].includes(data.current.condition.code)
      );
      console.log(weatherIcon, "weatherIcon");

      setCurrentWeather({ temperature, description, weatherIcon });
      // console.log(data.forecast.forecastday[0].hour, "This is houry data");
      const combineHourlyData = [
        ...data.forecast.forecastday[0].hour,
        ...data.forecast.forecastday[1].hour,
      ];
      // console.log(combineHourlyData, 'combine our data');

      filterHourlyForecast(combineHourlyData);
    } catch (error) {
      console.log(error);
    }
  };

useEffect( () => {
  
  const defaultCity = "Sydney";
  const API_URL = `http://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${defaultCity}&days=2`;
  getWeatherDetails(API_URL, defaultCity);
},[]);

console.log(hourlyforecast, "hourlyForecast");

  return (
    <div className="container">
      {/* This is a search section */}
      <SearchSection getWeatherDetails={getWeatherDetails} />
      {/* Weather section */}
      <div className="weather-section">
        {/* current weather section */}
        <CurrentWeather currentWeather={currentWeather} />
        {/* hourly forecast */}
        <div className="hourly-forecast">
          <ul className="weather-list">
            {hourlyforecast.map((hourlyWeather) => (

            <HourlyWeatherItems 
            key={hourlyWeather.time_epoch}
            hourlyWeather={hourlyWeather}
             />
          ))}
            
          </ul>
        </div>
      </div>
    </div>
  );
}

export default App;