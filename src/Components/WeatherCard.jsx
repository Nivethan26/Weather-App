import React, { useEffect, useState } from 'react'
import { useDate } from '../Utils/useDate'
import sun from '../assets/icons/sun.png'
import cloud from '../assets/icons/cloud.png'
import fog from '../assets/icons/fog.png'
import rain from '../assets/icons/rain.png'
import snow from '../assets/icons/snow.png'
import storm from '../assets/icons/storm.png'
import wind from '../assets/icons/windy.png'

const WeatherCard = ({
  temperature,
  windspeed,
  humidity,
  place,
  heatIndex,
  iconString,
  conditions,
  visibility
}) => {
  const [icon, setIcon] = useState(sun)
  const { time } = useDate()
  const [currentTemp, setCurrentTemp] = useState(0)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
    if (iconString) {
      if (iconString.toLowerCase().includes('cloud')) {
        setIcon(cloud)
      } else if (iconString.toLowerCase().includes('rain')) {
        setIcon(rain)
      } else if (iconString.toLowerCase().includes('clear')) {
        setIcon(sun)
      } else if (iconString.toLowerCase().includes('thunder')) {
        setIcon(storm)
      } else if (iconString.toLowerCase().includes('fog')) {
        setIcon(fog)
      } else if (iconString.toLowerCase().includes('snow')) {
        setIcon(snow)
      } else if (iconString.toLowerCase().includes('wind')) {
        setIcon(wind)
      }
    }
  }, [iconString])

  // Smooth temperature animation
  useEffect(() => {
    if (temperature) {
      const targetTemp = Math.round(temperature)
      let current = 0
      const increment = targetTemp / 20
      
      const timer = setInterval(() => {
        current += increment
        if (current >= targetTemp) {
          setCurrentTemp(targetTemp)
          clearInterval(timer)
        } else {
          setCurrentTemp(Math.round(current))
        }
      }, 60)
      
      return () => clearInterval(timer)
    }
  }, [temperature])

  const getWeatherGradient = () => {
    if (!iconString) return 'from-blue-500/10 to-purple-600/10'
    
    if (iconString.toLowerCase().includes('clear') || iconString.toLowerCase().includes('sun')) {
      return 'from-yellow-400/10 to-orange-500/10'
    } else if (iconString.toLowerCase().includes('cloud')) {
      return 'from-gray-400/10 to-blue-400/10'
    } else if (iconString.toLowerCase().includes('rain')) {
      return 'from-blue-600/10 to-gray-600/10'
    } else if (iconString.toLowerCase().includes('storm')) {
      return 'from-purple-600/10 to-gray-800/10'
    } else if (iconString.toLowerCase().includes('snow')) {
      return 'from-cyan-400/10 to-blue-300/10'
    } else if (iconString.toLowerCase().includes('fog')) {
      return 'from-gray-300/10 to-gray-500/10'
    } else {
      return 'from-blue-500/10 to-purple-600/10'
    }
  }

  return (
    <div className={`weather-card p-8 w-full max-w-md transform transition-all duration-700 ${
      isVisible ? 'animate-fade-in' : 'opacity-0'
    }`}>
      {/* Header Section */}
      <div className='text-center mb-8'>
        <div className='flex items-center justify-center gap-3 mb-4'>
          <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse shadow-lg"></div>
          <h2 className='text-3xl font-bold text-white'>{place || 'Loading...'}</h2>
        </div>
        <p className='text-gray-300 text-lg mb-1'>{time}</p>
        <p className='text-gray-400 text-sm'>
          {new Date().toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </p>
      </div>

      {/* Main Weather Display */}
      <div className={`rounded-2xl p-6 mb-8 bg-gradient-to-br ${getWeatherGradient()} border border-white/10 backdrop-blur-xl transition-all duration-500 hover:border-white/20`}>
        <div className='flex items-center justify-between'>
          <div className='flex flex-col items-center flex-1'>
            <div className="relative">
              <img 
                src={icon} 
                alt="weather_icon" 
                className='w-24 h-24 weather-icon animate-float' 
              />
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-white/10 rounded-full backdrop-blur-sm animate-pulse"></div>
            </div>
            <p className='text-gray-300 text-lg font-medium mt-4 text-center capitalize'>{conditions}</p>
          </div>
          
          <div className='flex-1 text-center'>
            <p className='font-bold text-7xl text-white mb-3 animate-glow'>
              {currentTemp}°
            </p>
            <p className='text-gray-400 text-lg'>
              Feels like {heatIndex ? Math.round(heatIndex) : '--'}°
            </p>
          </div>
        </div>
      </div>

      {/* Weather Details Grid */}
      <div className='grid grid-cols-2 gap-4 mb-6'>
        <div className='bg-white/5 rounded-xl p-4 text-center transition-all duration-300 hover:bg-white/10 hover:scale-105'>
          <div className='text-2xl mb-2 animate-float'>💨</div>
          <p className='text-gray-400 text-sm mb-1'>Wind</p>
          <p className='text-white text-xl font-bold'>{windspeed ? Math.round(windspeed) : '--'} km/h</p>
        </div>
        
        <div className='bg-white/5 rounded-xl p-4 text-center transition-all duration-300 hover:bg-white/10 hover:scale-105'>
          <div className='text-2xl mb-2 animate-pulse'>💧</div>
          <p className='text-gray-400 text-sm mb-1'>Humidity</p>
          <p className='text-white text-xl font-bold'>{humidity ? Math.round(humidity) : '--'}%</p>
        </div>
      </div>

      {/* Additional Info */}
      <div className='space-y-3'>
        <div className='flex justify-between items-center p-4 bg-white/5 rounded-xl transition-all duration-300 hover:bg-white/10'>
          <div className='flex items-center gap-3'>
            <div className="text-xl animate-glow">👁️</div>
            <span className='text-gray-400'>Visibility</span>
          </div>
          <span className='text-white font-semibold text-lg'>{visibility ? Math.round(visibility) : '--'} km</span>
        </div>
        
        <div className='flex justify-between items-center p-4 bg-white/5 rounded-xl transition-all duration-300 hover:bg-white/10'>
          <div className='flex items-center gap-3'>
            <div className="text-xl animate-pulse">🔥</div>
            <span className='text-gray-400'>Heat Index</span>
          </div>
          <span className='text-white font-semibold text-lg'>{heatIndex ? Math.round(heatIndex) : 'N/A'}°C</span>
        </div>
      </div>

      {/* Status Indicator */}
      <div className='mt-6 p-4 bg-gradient-to-r from-green-500/10 to-blue-500/10 rounded-xl border border-green-500/20'>
        <div className='flex items-center justify-center gap-3'>
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
          </div>
          <span className='text-gray-300 text-sm'>Live Weather Data Streaming</span>
        </div>
      </div>
    </div>
  )
}

export default WeatherCard