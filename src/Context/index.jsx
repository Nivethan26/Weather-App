import { useContext, createContext, useState, useEffect } from "react";
import axios from "axios";

const StateContext = createContext();

export const StateContextProvider = ({ children }) => {
  const [weather, setWeather] = useState({});
  const [values, setValues] = useState([]);
  const [place, setPlace] = useState("Jaffna,LK");
  const [thisLocation, setLocation] = useState("");
  const [timezone, setTimezone] = useState(0);

  const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY;

  const fetchWeather = async () => {
    try {
      let currentResponse;
      let forecastResponse;

      if (typeof place === "object" && place !== null && place.lat && place.lon) {
        currentResponse = await axios.get(
          "https://api.openweathermap.org/data/2.5/weather",
          {
            params: {
              lat: place.lat,
              lon: place.lon,
              appid: apiKey,
              units: "metric",
            },
          }
        );

        forecastResponse = await axios.get(
          "https://api.openweathermap.org/data/2.5/forecast",
          {
            params: {
              lat: place.lat,
              lon: place.lon,
              appid: apiKey,
              units: "metric",
            },
          }
        );
      } else {
        currentResponse = await axios.get(
          "https://api.openweathermap.org/data/2.5/weather",
          {
            params: {
              q: place,
              appid: apiKey,
              units: "metric",
            },
          }
        );

        forecastResponse = await axios.get(
          "https://api.openweathermap.org/data/2.5/forecast",
          {
            params: {
              q: place,
              appid: apiKey,
              units: "metric",
            },
          }
        );
      }

      const currentData = currentResponse.data;
      const forecastData = forecastResponse.data;

      setLocation(`${currentData.name}, ${currentData.sys.country}`);
      setTimezone(currentData.timezone);

      const updatedWeather = {
        temp: currentData.main.temp,
        humidity: currentData.main.humidity,
        heatindex: currentData.main.feels_like,
        wspd: currentData.wind.speed,
        conditions: currentData.weather[0].main,
        description: currentData.weather[0].description,
        icon: currentData.weather[0].icon,
        timezone: currentData.timezone,
      };

      setWeather(updatedWeather);

      const noonForecast = forecastData.list.filter((item) =>
        item.dt_txt.includes("12:00:00")
      );

      const finalForecast =
        noonForecast.length > 0 ? noonForecast : forecastData.list.filter((_, index) => index % 8 === 0);

      setValues(finalForecast.slice(0, 6));
    } catch (error) {
      console.error("Weather fetch error:", error);
      alert("This place does not exist or weather data could not be loaded");
    }
  };

  useEffect(() => {
    fetchWeather();
  }, [place]);

  return (
    <StateContext.Provider
      value={{
        weather,
        setPlace,
        values,
        thisLocation,
        place,
        timezone,
      }}
    >
      {children}
    </StateContext.Provider>
  );
};

export const useStateContext = () => useContext(StateContext);
