import "./App.css";
import { useStateContext } from "./Context";
import { BackgroundLayout, WeatherCard, MiniCard, CitySearch } from "./Components";

function App() {
  const { weather, thisLocation, values, timezone } = useStateContext();

  return (
    <div className="w-full min-h-screen text-white px-8 relative">
      <nav className="w-full p-3 flex justify-between items-center relative z-50">
        <h1 className="font-bold tracking-wide text-3xl">Weather App</h1>
        <CitySearch />
      </nav>

      <BackgroundLayout />

      <main className="w-full flex flex-wrap gap-8 py-4 px-[10%] items-center justify-center relative z-20">
        <WeatherCard
          place={thisLocation}
          windspeed={weather.wspd}
          humidity={weather.humidity}
          temperature={weather.temp}
          heatIndex={weather.heatindex}
          iconCode={weather.icon}
          conditions={weather.conditions}
          timezone={timezone}
        />

        <div className="flex justify-center gap-8 flex-wrap w-[60%]">
          {values?.map((curr) => (
            <MiniCard
              key={curr.dt}
              dt={curr.dt}
              temp={curr.main.temp}
              iconCode={curr.weather[0].icon}
              timezone={timezone}
              condition={curr.weather[0].main}
            />
          ))}
        </div>
      </main>
    </div>
  );
}

export default App;