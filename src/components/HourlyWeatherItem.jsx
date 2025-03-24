import { weatherCodes } from "../constants";

const HourlyWeatherItem = ({hourlyWeather}) => {
  console.log(hourlyWeather, "hourlyWeather");
  const temperature = Math.floor(hourlyWeather.temp_c);
  const time = hourlyWeather.time.split(" ")[1];
  const weatherIcon = Object.keys(weatherCodes).find((icon) =>
    weatherCodes[icon].includes(hourlyWeather.condition.code)
  );
  
  return (
    <li className="weather-item">
      <p className="time">{time}</p>
      <img src={`icons/${weatherIcon}.svg`} className="weather-icon" />
      <p className="temperature">{temperature}°C</p>
    </li>
  );
};

export default HourlyWeatherItem;