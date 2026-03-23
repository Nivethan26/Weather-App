import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import searchIcon from "../assets/icons/search.svg";
import { useStateContext } from "../Context";

const CitySearch = () => {
  const [input, setInput] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const wrapperRef = useRef(null);

  const { setPlace } = useStateContext();
  const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY;

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (!input.trim()) {
        setSuggestions([]);
        return;
      }

      setLoading(true);
      try {
        const response = await axios.get(
          "https://api.openweathermap.org/geo/1.0/direct",
          {
            params: {
              q: input,
              limit: 5,
              appid: apiKey,
            },
          }
        );

        const uniqueSuggestions = response.data.reduce((acc, current) => {
          const exists = acc.find(
            (item) =>
              item.name === current.name &&
              item.country === current.country &&
              item.state === current.state
          );

          return exists ? acc : [...acc, current];
        }, []);

        setSuggestions(uniqueSuggestions);
      } catch (error) {
        console.error("Failed to fetch suggestions:", error);
      } finally {
        setLoading(false);
      }
    };

    const debounceTimer = setTimeout(() => {
      if (input.trim() && showSuggestions) {
        fetchSuggestions();
      }
    }, 400);

    return () => clearTimeout(debounceTimer);
  }, [input, apiKey, showSuggestions]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectCity = (city) => {
    setPlace({
      name: city.name,
      state: city.state || "",
      country: city.country,
      lat: city.lat,
      lon: city.lon,
    });

    setInput("");
    setShowSuggestions(false);
    setActiveIndex(-1);
  };

  const handleKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (activeIndex < suggestions.length - 1) {
        setActiveIndex((prev) => prev + 1);
      }
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (activeIndex > 0) {
        setActiveIndex((prev) => prev - 1);
      }
    } else if (e.key === "Enter") {
      e.preventDefault();

      if (activeIndex >= 0 && activeIndex < suggestions.length) {
        selectCity(suggestions[activeIndex]);
      } else if (input.trim()) {
        setPlace(input.trim());
        setInput("");
        setShowSuggestions(false);
      }
    } else if (e.key === "Escape") {
      setShowSuggestions(false);
      setActiveIndex(-1);
    }
  };

  const handleChange = (e) => {
    setInput(e.target.value);
    setShowSuggestions(true);
    setActiveIndex(-1);

    if (!e.target.value.trim()) {
      setSuggestions([]);
    }
  };

  return (
    <div ref={wrapperRef} className="relative w-[15rem]">
      <div className="bg-white overflow-hidden shadow-2xl rounded flex items-center p-2 gap-2 w-full z-20 relative">
        <img src={searchIcon} alt="search" className="w-[1.5rem] h-[1.5rem]" />
        <input
          type="text"
          placeholder="Search city"
          className="focus:outline-none w-full text-[#212121] text-lg"
          value={input}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onFocus={() => setShowSuggestions(true)}
        />
      </div>

      {showSuggestions && input.trim() && (
        <div className="absolute top-[110%] left-0 w-full bg-white rounded-md shadow-lg z-50 overflow-hidden text-[#212121]">
          {loading ? (
            <div className="p-3 text-sm text-gray-500 text-center">Loading...</div>
          ) : suggestions.length > 0 ? (
            <ul className="max-h-60 overflow-y-auto">
              {suggestions.map((suggestion, index) => (
                <li
                  key={`${suggestion.lat}-${suggestion.lon}`}
                  className={`p-3 cursor-pointer border-b border-gray-100 last:border-0 transition-colors ${
                    index === activeIndex ? "bg-blue-100" : "hover:bg-gray-100"
                  }`}
                  onClick={() => selectCity(suggestion)}
                >
                  <p className="font-medium text-base">{suggestion.name}</p>
                  <p className="text-xs text-gray-500">
                    {suggestion.state ? `${suggestion.state}, ` : ""}
                    {suggestion.country}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <div className="p-3 text-sm text-gray-500 text-center">
              No results found
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CitySearch;