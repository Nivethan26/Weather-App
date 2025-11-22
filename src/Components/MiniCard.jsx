import React, { useEffect, useState } from 'react'
import sun from '../assets/icons/sun.png'
import cloud from '../assets/icons/cloud.png'
import fog from '../assets/icons/fog.png'
import rain from '../assets/icons/rain.png'
import snow from '../assets/icons/snow.png'
import storm from '../assets/icons/storm.png'
import wind from '../assets/icons/windy.png'

const MiniCard = ({ time, temp, iconString, index }) => {
  const [icon, setIcon] = useState(cloud)
  const [animatedTemp, setAnimatedTemp] = useState(0)

  useEffect(() => {
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
      } else {
        setIcon(cloud)
      }
    }
  }, [iconString])

  // Animate temperature
  useEffect(() => {
    if (temp) {
      const targetTemp = Math.round(temp)
      let current = 0
      const increment = targetTemp / 15
      
      const timer = setInterval(() => {
        current += increment
        if (current >= targetTemp) {
          setAnimatedTemp(targetTemp)
          clearInterval(timer)
        } else {
          setAnimatedTemp(Math.round(current))
        }
      }, 80)
      
      return () => clearInterval(timer)
    }
  }, [temp])

  const dayName = new Date(time).toLocaleDateString('en', { weekday: 'short' })
  const date = new Date(time).getDate()
  const month = new Date(time).toLocaleDateString('en', { month: 'short' })

  return (
    <div 
      className='mini-card group'
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      {/* Date Header */}
      <div className='text-center mb-4'>
        <p className='font-bold text-white text-sm mb-1'>{dayName}</p>
        <p className='text-gray-400 text-xs'>{date} {month}</p>
      </div>
      
      {/* Weather Icon */}
      <div className='my-4 flex justify-center transform transition-all duration-500 group-hover:scale-110'>
        <img 
          src={icon} 
          alt="weather icon" 
          className='w-12 h-12 weather-icon' 
        />
      </div>
      
      {/* Temperature */}
      <div className='text-center'>
        <p className='font-bold text-white text-xl mb-2'>
          {animatedTemp}°
        </p>
        {/* Temperature Bar */}
        <div className="w-full bg-white/10 rounded-full h-1.5 overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full transition-all duration-1000 ease-out"
            style={{ width: `${Math.min((animatedTemp / 40) * 100, 100)}%` }}
          ></div>
        </div>
      </div>
    </div>
  )
}

export default MiniCard