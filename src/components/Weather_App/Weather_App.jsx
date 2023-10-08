import React, { useState, useEffect } from 'react';
import './Weather_App.css';
import clear_icon from '../Assets/clear.png';
import cloud_icon from '../Assets/cloud.png';
import drizzle_icon from '../Assets/drizzle.png';
import humidity_icon from '../Assets/humidity.png';
import search_icon from '../Assets/search.png';
import snow_icon from '../Assets/snow.png';
import wind_icon from '../Assets/wind.png';
import rain_icon from '../Assets/rain.png';

const WeatherApp = () => {
  let api_key = "4bf91b3d01a2b0da18023f805f6de0e7";
  const [wicon, setWicon] = useState(cloud_icon);
  const [temperatureUnit, setTemperatureUnit] = useState("Celsius");
  const [temperature, setTemperature] = useState(0);
  const [location, setLocation] = useState("");
  const [errorMessage, setErrorMessage] = useState(""); // Add error message state

  const toggleTemperatureUnit = () => {
    setTemperatureUnit(prevUnit => (prevUnit === "Celsius" ? "Fahrenheit" : "Celsius"));
  };

  const convertTemperature = (temp) => {
    if (temperatureUnit === "Celsius") {
      return `${temp}°C`;
    } else {
      const fahrenheitTemp = (temp * 9/5) + 32;
      return `${fahrenheitTemp.toFixed(2)}°F`;
    }
  };

  const search = async () => {
    setErrorMessage(""); // Clear any previous error message

    const element = document.getElementsByClassName("cityInput");
    if (element[0].value === "") {
      return;
    }
    let url = `https://api.openweathermap.org/data/2.5/weather?q=${element[0].value}&units=Metric&appid=${api_key}`;
    
    try {
      let response = await fetch(url);

      if (!response.ok) {
        if (response.status === 404) {
          setErrorMessage("City not found"); // Handle 404 Not Found
        } else {
          setErrorMessage("API request failed"); // Handle other non-OK responses as errors
        }
        throw new Error("City not found or API request failed");
      }

      let data = await response.json();

      const humidity = document.getElementsByClassName("humidity-percent");
      const wind = document.getElementsByClassName("wind-rate");

      humidity[0].innerHTML = data.main.humidity + " %";
      wind[0].innerHTML = Math.floor(data.wind.speed) + " km/h";
      setTemperature(data.main.temp);
      setLocation(data.name);

      if (data.weather[0].icon === "01d" || data.weather[0].icon === "01n") {
        setWicon(clear_icon);
      } else if (data.weather[0].icon === "02d" || data.weather[0].icon === "02n") {
        setWicon(cloud_icon);
      } else if (data.weather[0].icon === "03d" || data.weather[0].icon === "03n") {
        setWicon(drizzle_icon);
      } else if (data.weather[0].icon === "04d" || data.weather[0].icon === "04n") {
        setWicon(drizzle_icon);
      } else if (data.weather[0].icon === "09d" || data.weather[0].icon === "09n") {
        setWicon(rain_icon);
      } else if (data.weather[0].icon === "10d" || data.weather[0].icon === "10n") {
        setWicon(rain_icon);
      } else if (data.weather[0].icon === "13d" || data.weather[0].icon === "13n") {
        setWicon(snow_icon);
      } else {
        setWicon(clear_icon);
      }
    } catch (error) {
      // Handle errors here
      console.error(error);
    }
  }

  

  return (
    <div className='container'>
      <div className="top-bar">
        <input type="text" className="cityInput" placeholder="search" />
        <div className="search-icon" onClick={() => { search() }}>
          <img src={search_icon} alt="" />
        </div>
      </div>
      <div className='weather-image'>
        <img src={wicon} alt="" />
      </div>
      {errorMessage ? (
        <div className="error-message">{errorMessage}</div> // Display error message if an error occurred
      ) : (
        <>
          <div className='weather-temp'>{convertTemperature(temperature)}</div>
          <button className="toggle-unit" onClick={toggleTemperatureUnit}>
            Toggle Unit ({temperatureUnit === "Celsius" ? "°C" : "°F"})
          </button>
          <div className='weather-location'>{location}</div>
          <div className='data-container'>
            <div className='element'>
              <img src={humidity_icon} alt="" />
              <div className='data'>
                <div className='humidity-percent'>64%</div>
                <div className="text">Humidity</div>
              </div>
            </div>
            <div className='element'>
              <img src={wind_icon} alt="" />
              <div className='data'>
                <div className='wind-rate'>18 km/h</div>
              </div>
              <div className="text">Wind Speed</div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default WeatherApp;
