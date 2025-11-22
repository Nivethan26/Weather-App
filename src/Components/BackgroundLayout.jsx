import React, { useEffect, useState } from 'react'
import { useStateContext } from '../Context'
import Clear from '../assets/images/Clear.jpg'
import Fog from '../assets/images/Fog.jpg'
import Cloudy from '../assets/images/Cloudy.jpg'
import Rainy from '../assets/images/Rainy.jpg'
import Snow from '../assets/images/snow.jpg'
import Stormy from '../assets/images/Stormy.jpg'
import Sunny from '../assets/images/Sunny.jpg'

const BackgroundLayout = () => {
  const { weather } = useStateContext()
  const [image, setImage] = useState(Clear)
  const [currentImage, setCurrentImage] = useState(Clear)
  const [isChanging, setIsChanging] = useState(false)

  useEffect(() => {
    if (weather.conditions) {
      let imageString = weather.conditions
      let newImage = Clear
      
      if (imageString.toLowerCase().includes('clear') || imageString.toLowerCase().includes('sun')) {
        newImage = Sunny
      } else if (imageString.toLowerCase().includes('cloud')) {
        newImage = Cloudy
      } else if (imageString.toLowerCase().includes('rain') || imageString.toLowerCase().includes('shower')) {
        newImage = Rainy
      } else if (imageString.toLowerCase().includes('snow')) {
        newImage = Snow
      } else if (imageString.toLowerCase().includes('fog')) {
        newImage = Fog
      } else if (imageString.toLowerCase().includes('thunder') || imageString.toLowerCase().includes('storm')) {
        newImage = Stormy
      }

      if (newImage !== image) {
        setIsChanging(true)
        setTimeout(() => {
          setImage(newImage)
          setCurrentImage(newImage)
          setIsChanging(false)
        }, 600)
      }
    }
  }, [weather.conditions, image])

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Main Background Image */}
      <img 
        src={currentImage} 
        alt="weather_background" 
        className={`h-full w-full object-cover transition-all duration-700 ${
          isChanging ? 'opacity-0 scale-110' : 'opacity-100 scale-100'
        }`}
      />
      
      {/* Enhanced Overlay for Better Readability */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/50 via-transparent to-black/40"></div>
      
      {/* Subtle Animated Elements */}
      <div className="absolute inset-0">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-white/20 rounded-full animate-float-slow"
            style={{
              left: `${20 + i * 30}%`,
              top: `${10 + i * 25}%`,
              animationDelay: `${i * 2}s`
            }}
          />
        ))}
      </div>
    </div>
  )
}

export default BackgroundLayout