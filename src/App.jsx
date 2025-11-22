import { useState, useRef, useEffect, useCallback } from 'react'
import './App.css'
import search from './assets/icons/search.svg'
import { useStateContext } from './Context'
import { BackgroundLayout, WeatherCard, MiniCard } from './Components'
import { useDebounce } from './Utils/useDebounce'

function App() {
  const [input, setInput] = useState('')
  const [showSuggestions, setShowSuggestions] = useState(false)
  const { weather, thisLocation, values, place, setPlace, suggestions, fetchSuggestions, loadingSuggestions, setSuggestions } = useStateContext()
  const [isLoading, setIsLoading] = useState(false)
  const inputRef = useRef(null)
  const suggestionsRef = useRef(null)

  const debouncedInput = useDebounce(input, 400)

  // Fetch suggestions when debounced input changes
  useEffect(() => {
    if (debouncedInput && debouncedInput.length >= 2) {
      console.log('Fetching suggestions for:', debouncedInput)
      fetchSuggestions(debouncedInput)
      setShowSuggestions(true)
    } else {
      setSuggestions([])
      setShowSuggestions(false)
    }
  }, [debouncedInput, fetchSuggestions, setSuggestions])

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target)) {
        setShowSuggestions(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const submitCity = useCallback(async (selectedPlace = null) => {
    const cityToSearch = selectedPlace || input
    if (cityToSearch.trim()) {
      setIsLoading(true)
      setPlace(cityToSearch)
      setInput('')
      setShowSuggestions(false)
      setSuggestions([])
      setTimeout(() => {
        setIsLoading(false)
      }, 1200)
    }
  }, [input, setPlace, setSuggestions])

  const handleSearchClick = useCallback(() => {
    inputRef.current?.focus()
    if (input.length >= 2) {
      setShowSuggestions(true)
    }
  }, [input.length])

  const handleSuggestionClick = useCallback((suggestion) => {
    // Use the full address from the suggestion for better accuracy
    const placeName = suggestion.fullAddress || `${suggestion.name}, ${suggestion.state || suggestion.country}`
    setInput(placeName)
    submitCity(placeName)
  }, [submitCity])

  const getCountryFlag = useCallback((countryName) => {
    const flagEmojis = {
      'India': '🇮🇳',
      'United States': '🇺🇸',
      'United Kingdom': '🇬🇧',
      'Japan': '🇯🇵',
      'Australia': '🇦🇺',
      'France': '🇫🇷',
      'UAE': '🇦🇪',
      'Singapore': '🇸🇬',
      'Canada': '🇨🇦',
      'Germany': '🇩🇪',
      'Russia': '🇷🇺',
      'China': '🇨🇳',
      'South Korea': '🇰🇷',
      'Sri Lanka': '🇱🇰', // Added Sri Lanka flag
      'Thailand': '🇹🇭',
      'Malaysia': '🇲🇾',
      'Philippines': '🇵🇭',
      'Indonesia': '🇮🇩',
      'Italy': '🇮🇹',
      'Spain': '🇪🇸',
      'Netherlands': '🇳🇱'
    }
    return flagEmojis[countryName] || '🏴'
  }, [])

  const handleInputChange = useCallback((e) => {
    const value = e.target.value
    setInput(value)
    
    if (value.length >= 2) {
      setShowSuggestions(true)
    } else {
      setShowSuggestions(false)
    }
  }, [])

  // Quick access popular cities - Jaffna first
  const quickAccessCities = useCallback(() => [
    { name: "Jaffna", fullAddress: "Jaffna, Northern Province, Sri Lanka" },
    { name: "Colombo", fullAddress: "Colombo, Western Province, Sri Lanka" },
    { name: "Kandy", fullAddress: "Kandy, Central Province, Sri Lanka" },
    { name: "Chennai", fullAddress: "Chennai, Tamil Nadu, India" },
    { name: "Bangalore", fullAddress: "Bangalore, Karnataka, India" },
    { name: "London", fullAddress: "London, England, United Kingdom" }
  ], [])

  return (
    <div className='w-full min-h-screen text-white px-4 lg:px-8 overflow-hidden relative'>
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-72 h-72 bg-blue-500/5 rounded-full blur-3xl animate-float-slow"></div>
        <div className="absolute bottom-0 right-0 w-72 h-72 bg-purple-500/5 rounded-full blur-3xl animate-float-slow" style={{animationDelay: '2s'}}></div>
      </div>

      <nav className='w-full p-4 lg:p-6 flex flex-col lg:flex-row justify-between items-center gap-4 lg:gap-0 relative z-20'>
        {/* Logo Section */}
        <div className='flex items-center gap-3 w-full lg:w-auto justify-center lg:justify-start'>
          <div className="relative">
            <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl animate-glow">
              <span className="text-white font-bold text-lg lg:text-xl">W</span>
            </div>
            <div className="absolute -top-1 -right-1 w-2 h-2 lg:w-3 lg:h-3 bg-green-400 rounded-full animate-pulse"></div>
          </div>
          <h1 className='font-bold tracking-wide text-2xl lg:text-3xl bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent'>
            WeatherFlow
          </h1>
        </div>
        
        {/* Search Bar Section */}
        <div className="relative w-full lg:w-auto flex justify-center">
          <div className="relative" ref={suggestionsRef}>
            <div 
              className='bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl flex items-center p-3 lg:p-4 gap-3 transition-all duration-500 hover:bg-white/15 hover:scale-105 cursor-text w-full lg:w-96 max-w-lg'
              onClick={handleSearchClick}
            >
              <div className={`p-2 rounded-xl bg-white/10 transition-all duration-300 ${isLoading ? 'animate-pulse' : ''}`}>
                <img src={search} alt="search" className='w-4 h-4 lg:w-5 lg:h-5' />
              </div>
              <input 
                ref={inputRef}
                onKeyUp={(e) => {
                  if (e.key === 'Enter') {
                    submitCity()
                  }
                }} 
                type="text" 
                placeholder='Search any city, state, or country...' 
                className='flex-1 bg-transparent placeholder-gray-300 text-white text-base lg:text-lg focus:outline-none w-full'
                value={input} 
                onChange={handleInputChange}
                onFocus={() => input.length >= 2 && setShowSuggestions(true)}
              />
              {isLoading ? (
                <div className='flex items-center gap-2'>
                  <div className='w-5 h-5 lg:w-6 lg:h-6 border-2 border-white border-t-transparent rounded-full animate-spin'></div>
                </div>
              ) : (
                <button 
                  onClick={() => submitCity()}
                  className="px-3 py-2 lg:px-4 lg:py-2 bg-white/20 rounded-xl text-sm font-medium transition-all duration-300 hover:bg-white/30 hover:scale-105 active:scale-95 whitespace-nowrap"
                  disabled={!input.trim()}
                >
                  Search
                </button>
              )}
            </div>

            {/* Search Suggestions Dropdown */}
            {showSuggestions && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl overflow-hidden shadow-2xl animate-slide-down z-50 max-h-80 w-full">
                {loadingSuggestions ? (
                  <div className="p-4 text-center">
                    <div className="loading-dots flex justify-center space-x-2">
                      <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                      <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                    </div>
                    <p className="text-gray-300 text-sm mt-2">Searching worldwide locations...</p>
                  </div>
                ) : suggestions.length > 0 ? (
                  <>
                    <div className="max-h-60 overflow-y-auto custom-scrollbar">
                      {suggestions.map((suggestion, index) => (
                        <div
                          key={`${suggestion.name}-${suggestion.country}-${index}`}
                          className="p-3 border-b border-white/10 last:border-b-0 transition-all duration-200 hover:bg-white/15 cursor-pointer group suggestion-item"
                          onClick={() => handleSuggestionClick(suggestion)}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="text-lg country-flag">
                                {getCountryFlag(suggestion.country)}
                              </div>
                              <div className="min-w-0 flex-1">
                                <p className="text-white font-medium group-hover:text-blue-200 transition-colors truncate">
                                  {suggestion.name}
                                </p>
                                <p className="text-gray-300 text-sm truncate">
                                  {suggestion.fullAddress || `${suggestion.state && `${suggestion.state}, `}${suggestion.country}`}
                                </p>
                              </div>
                            </div>
                            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex-shrink-0">
                              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    {/* Suggestions Footer */}
                    <div className="p-2 bg-white/5 border-t border-white/10">
                      <p className="text-gray-400 text-xs text-center">
                        {suggestions.length} location{suggestions.length !== 1 ? 's' : ''} found • Powered by Visual Crossing
                      </p>
                    </div>
                  </>
                ) : input.length >= 2 ? (
                  <div className="p-6 text-center">
                    <div className="text-4xl mb-3">🌍</div>
                    <p className="text-gray-400 text-sm mb-2">No locations found for "{input}"</p>
                    <p className="text-gray-500 text-xs mb-4">Try these popular cities:</p>
                    
                    {/* Quick Access Cities */}
                    <div className="flex flex-wrap gap-2 justify-center">
                      {quickAccessCities().map((city, index) => (
                        <button
                          key={index}
                          onClick={() => submitCity(city.fullAddress)}
                          className="px-3 py-1 bg-white/10 rounded-full text-xs text-gray-300 hover:bg-white/20 hover:text-white transition-all duration-200"
                        >
                          {city.name}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : null}
              </div>
            )}
          </div>
        </div>
      </nav>
      
      <BackgroundLayout />
      
      <main className='w-full flex flex-col lg:flex-row gap-8 py-6 lg:py-8 px-4 lg:px-[5%] items-start justify-center relative z-10'>
        <WeatherCard
          place={thisLocation}
          windspeed={weather.wspd}
          humidity={weather.humidity}
          temperature={weather.temp}
          heatIndex={weather.heatindex}
          iconString={weather.conditions}
          conditions={weather.conditions}
          visibility={weather.visibility}
        />

        <div className='flex-1 w-full space-y-6 lg:space-y-8'>
          {/* Forecast Section */}
          <div className='animate-slide-in-right'>
            <div className='flex items-center gap-3 mb-4 lg:mb-6'>
              <div className="w-1 h-6 lg:h-8 bg-gradient-to-b from-blue-400 to-purple-500 rounded-full animate-glow"></div>
              <h2 className='text-xl lg:text-2xl font-bold text-white'>
                6-Day Forecast
              </h2>
            </div>
            
            <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-6 gap-3 lg:gap-4'>
              {values?.slice(1, 7).map((curr, index) => (
                <MiniCard
                  key={curr.datetime}
                  time={curr.datetime}
                  temp={curr.temp}
                  iconString={curr.conditions}
                  index={index}
                />
              ))}
            </div>
          </div>

          {/* Weather Stats Grid */}
          <div className='grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4 animate-fade-in-up'>
            <div className='weather-stat-card group'>
              <div className='text-2xl lg:text-3xl mb-2 lg:mb-3 animate-bounce'>🌡️</div>
              <p className='text-gray-300 text-sm mb-1 lg:mb-2'>Feels Like</p>
              <p className='text-xl lg:text-2xl font-bold text-white'>{weather.heatindex ? Math.round(weather.heatindex) : '--'}°</p>
            </div>
            
            <div className='weather-stat-card group'>
              <div className='text-2xl lg:text-3xl mb-2 lg:mb-3 animate-float'>💨</div>
              <p className='text-gray-300 text-sm mb-1 lg:mb-2'>Wind Speed</p>
              <p className='text-xl lg:text-2xl font-bold text-white'>{weather.wspd ? Math.round(weather.wspd) : '--'} km/h</p>
            </div>
            
            <div className='weather-stat-card group'>
              <div className='text-2xl lg:text-3xl mb-2 lg:mb-3 animate-pulse'>💧</div>
              <p className='text-gray-300 text-sm mb-1 lg:mb-2'>Humidity</p>
              <p className='text-xl lg:text-2xl font-bold text-white'>{weather.humidity ? Math.round(weather.humidity) : '--'}%</p>
            </div>
            
            <div className='weather-stat-card group'>
              <div className='text-2xl lg:text-3xl mb-2 lg:mb-3 animate-glow'>👁️</div>
              <p className='text-gray-300 text-sm mb-1 lg:mb-2'>Visibility</p>
              <p className='text-xl lg:text-2xl font-bold text-white'>{weather.visibility ? Math.round(weather.visibility) : '--'} km</p>
            </div>
          </div>

          {/* Additional Weather Insights */}
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 animate-fade-in-up' style={{animationDelay: '0.2s'}}>
            <div className='advanced-weather-card'>
              <div className='flex items-center gap-3 lg:gap-4'>
                <div className="text-2xl lg:text-3xl animate-spin-slow">🌤️</div>
                <div>
                  <p className='text-gray-300 text-sm'>Weather Condition</p>
                  <p className='text-white font-semibold text-base lg:text-lg capitalize'>{weather.conditions || '--'}</p>
                </div>
              </div>
            </div>
            
            <div className='advanced-weather-card'>
              <div className='flex items-center gap-3 lg:gap-4'>
                <div className="text-2xl lg:text-3xl animate-pulse">📍</div>
                <div>
                  <p className='text-gray-300 text-sm'>Current Location</p>
                  <p className='text-white font-semibold text-base lg:text-lg truncate'>{thisLocation || 'Jaffna, Sri Lanka'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className='relative z-10 text-center py-6 lg:py-8 text-gray-400 text-sm px-4'>
        <div className='flex items-center justify-center gap-2'>
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <p className='text-xs lg:text-sm'>Real-time Weather Data • @2025</p>
        </div>
      </footer>
    </div>
  )
}

export default App