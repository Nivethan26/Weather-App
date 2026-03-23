/* eslint-disable react/prop-types */
import React from "react";
import "../index.css";

const WeatherCard = ({
  temperature,
  windspeed,
  humidity,
  place,
  heatIndex,
  iconCode,
  conditions,
  timezone,
}) => {
  const getCityDateTime = (timezoneOffset = 0) => {
    const now = new Date();
    const utc = now.getTime() + now.getTimezoneOffset() * 60000;
    const cityDate = new Date(utc + timezoneOffset * 1000);

    return {
      date: cityDate.toLocaleDateString("en-US", {
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "numeric",
      }),
      time: cityDate.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }),
    };
  };

  const { date, time } = getCityDateTime(timezone);

  const getWeatherIconUrl = (code) =>
    code ? `https://openweathermap.org/img/wn/${code}@4x.png` : "";

  const getAnimationClass = (code = "") => {
    if (code.startsWith("01")) return "icon-sun";
    if (["02", "03", "04"].some((prefix) => code.startsWith(prefix))) return "icon-cloud";
    if (["09", "10"].some((prefix) => code.startsWith(prefix))) return "icon-rain";
    if (code.startsWith("11")) return "icon-storm";
    if (code.startsWith("13")) return "icon-snow";
    if (code.startsWith("50")) return "icon-fog";
    return "icon-cloud";
  };

  const animationClass = getAnimationClass(iconCode);

  return (
    <div className="glassCard mainWeatherCard w-[23rem] min-w-[23rem] min-h-[31rem] h-auto p-5 flex flex-col justify-between">
      <div className="flex w-full justify-center items-center gap-4 mt-10 mb-5">
        {iconCode && (
          <img
            src={getWeatherIconUrl(iconCode)}
            alt="weather_icon"
            className={`w-24 h-24 object-contain drop-shadow-2xl ${animationClass}`}
          />
        )}

        <p className="font-bold text-5xl flex justify-center items-center weather-temp-glow">
          {temperature !== undefined ? `${Math.round(temperature)} °C` : "N/A"}
        </p>
      </div>

      <div className="font-bold text-center text-2xl tracking-wide">{place}</div>

      <div className="w-full flex justify-between items-center mt-5">
        <p className="flex-1 text-center p-2">{date}</p>
        <p className="flex-1 text-center p-2">{time}</p>
      </div>

      <div className="w-full flex justify-between items-center mt-5 gap-4">
        <div className="flex-1 text-center p-3 font-bold bg-white/20 shadow rounded-xl weatherStatCard">
          Wind Speed
          <p className="font-normal mt-2">
            {windspeed !== undefined ? `${windspeed} m/s` : "N/A"}
          </p>
        </div>

        <div className="flex-1 text-center p-3 font-bold bg-white/20 shadow rounded-xl weatherStatCard">
          Humidity
          <p className="font-normal mt-2">
            {humidity !== undefined ? `${humidity}%` : "N/A"}
          </p>
        </div>
      </div>

      <div className="w-full p-3 mt-5 flex justify-between items-center">
        <p className="font-semibold text-lg">Feels Like</p>
        <p className="text-lg">
          {heatIndex !== undefined ? `${Math.round(heatIndex)} °C` : "N/A"}
        </p>
      </div>

      <hr className="bg-slate-600 border-white/30" />

      <div className="w-full p-4 flex flex-col justify-center items-center text-center">
        <p className="text-3xl font-semibold tracking-wide">{conditions || "Unknown"}</p>
        {iconCode && (
          <p className="text-sm mt-2 opacity-80">
            {iconCode.endsWith("n") ? "Night" : "Day"} weather
          </p>
        )}
      </div>
    </div>
  );
};

export default WeatherCard;