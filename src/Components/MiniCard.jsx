/* eslint-disable react/prop-types */
import React from "react";

const MiniCard = ({ dt, temp, iconCode, timezone, condition }) => {
  const getWeatherIconUrl = (code) =>
    code ? `https://openweathermap.org/img/wn/${code}@2x.png` : "";

  const getAnimationClass = (code = "") => {
    if (code.startsWith("01")) return "icon-sun";
    if (["02", "03", "04"].some((prefix) => code.startsWith(prefix))) return "icon-cloud";
    if (["09", "10"].some((prefix) => code.startsWith(prefix))) return "icon-rain";
    if (code.startsWith("11")) return "icon-storm";
    if (code.startsWith("13")) return "icon-snow";
    if (code.startsWith("50")) return "icon-fog";
    return "icon-cloud";
  };

  const getWeekday = (unixDt, timezoneOffset = 0) => {
    const utcDate = new Date((unixDt + timezoneOffset) * 1000);
    return utcDate.toLocaleDateString("en-US", { weekday: "long", timeZone: "UTC" });
  };

  const animationClass = getAnimationClass(iconCode);

  return (
    <div className="glassCard forecastCard w-[11rem] min-h-[12.5rem] h-auto p-4 flex flex-col justify-between">
      <div className="text-center font-semibold text-[1.05rem] tracking-wide">
        {getWeekday(dt, timezone)}
      </div>

      <hr className="my-2 border-white/40" />

      <div className="w-full flex justify-center items-center flex-1">
        {iconCode && (
          <img
            src={getWeatherIconUrl(iconCode)}
            alt="forecast icon"
            className={`w-[5rem] h-[5rem] object-contain drop-shadow-2xl ${animationClass}`}
          />
        )}
      </div>

      <div className="text-center font-bold text-[1.9rem] weather-temp-glow">
        {Math.round(temp)}&deg;C
      </div>

      <div className="text-center text-xs opacity-80 mt-1">
        {condition} {iconCode?.endsWith("n") ? "(Night)" : "(Day)"}
      </div>
    </div>
  );
};

export default MiniCard;