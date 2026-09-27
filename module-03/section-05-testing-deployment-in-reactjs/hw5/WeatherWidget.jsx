import React, { useEffect, useState } from "react";

function WeatherWidget() {
  const [weather, setWeather] = useState("");

  useEffect(() => {
    fetch("https://api.weather.example.com/today")
      .then((res) => res.json())
      .then((data) => setWeather(data.description));
  }, []);

  return <div>{weather}</div>;
}

export default WeatherWidget;
