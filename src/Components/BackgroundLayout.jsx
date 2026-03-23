import React, { useEffect, useState } from "react";
import { useStateContext } from "../Context";

import Clear from "../assets/images/Clear.jpg";
import Fog from "../assets/images/Fog.jpg";
import Cloudy from "../assets/images/Cloudy.jpg";
import Rainy from "../assets/images/Rainy.jpg";
import Snow from "../assets/images/snow.jpg";
import Stormy from "../assets/images/Stormy.jpg";
import Sunny from "../assets/images/Sunny.jpg";

const BackgroundLayout = () => {
  const { weather } = useStateContext();
  const [image, setImage] = useState(Sunny);
  const [overlayClass, setOverlayClass] = useState("bg-black/20");

  useEffect(() => {
    if (!weather?.conditions && !weather?.icon) return;

    const condition = weather?.conditions?.toLowerCase() || "";
    const iconCode = weather?.icon || "";
    const isNight = iconCode.endsWith("n");

    if (
      condition.includes("thunder") ||
      condition.includes("storm") ||
      iconCode.startsWith("11")
    ) {
      setImage(Stormy);
    } else if (condition.includes("snow") || iconCode.startsWith("13")) {
      setImage(Snow);
    } else if (
      condition.includes("rain") ||
      condition.includes("drizzle") ||
      condition.includes("shower") ||
      iconCode.startsWith("09") ||
      iconCode.startsWith("10")
    ) {
      setImage(Rainy);
    } else if (
      condition.includes("fog") ||
      condition.includes("mist") ||
      condition.includes("haze") ||
      condition.includes("smoke") ||
      condition.includes("dust") ||
      condition.includes("ash") ||
      condition.includes("sand") ||
      iconCode.startsWith("50")
    ) {
      setImage(Fog);
    } else if (
      condition.includes("cloud") ||
      iconCode.startsWith("02") ||
      iconCode.startsWith("03") ||
      iconCode.startsWith("04")
    ) {
      setImage(Cloudy);
    } else if (condition.includes("clear") || iconCode.startsWith("01")) {
      setImage(isNight ? Clear : Sunny);
    } else {
      setImage(Clear);
    }

    if (isNight) {
      setOverlayClass("bg-black/55");
    } else {
      setOverlayClass("bg-black/20");
    }
  }, [weather?.icon, weather?.conditions]);

  return (
    <>
      <img
        key={image}
        src={image}
        alt="weather background"
        className="h-screen w-full fixed left-0 top-0 -z-[10] object-cover transition-all duration-700"
      />
      <div className={`fixed inset-0 -z-[9] transition-all duration-700 ${overlayClass}`}></div>
    </>
  );
};

export default BackgroundLayout;