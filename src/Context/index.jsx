import { useContext, createContext, useState, useEffect, useCallback } from "react";
import axios from 'axios'

const StateContext = createContext()

export const StateContextProvider = ({ children }) => {
    const [weather, setWeather] = useState({})
    const [values, setValues] = useState([])
    const [place, setPlace] = useState('Jaffna') // Changed from Chennai to Jaffna
    const [thisLocation, setLocation] = useState('')
    const [suggestions, setSuggestions] = useState([])
    const [loadingSuggestions, setLoadingSuggestions] = useState(false)

    // Fetch weather data
    const fetchWeather = async () => {
        const options = {
            method: 'GET',
            url: 'https://visual-crossing-weather.p.rapidapi.com/forecast',
            params: {
                aggregateHours: '24',
                location: place,
                contentType: 'json',
                unitGroup: 'metric',
                shortColumnNames: 0,
            },
            headers: {
                'X-RapidAPI-Key': import.meta.env.VITE_API_KEY,
                'X-RapidAPI-Host': 'visual-crossing-weather.p.rapidapi.com'
            }
        }

        try {
            const response = await axios.request(options);
            console.log('Weather Data:', response.data)
            const thisData = Object.values(response.data.locations)[0]
            setLocation(thisData.address)
            setValues(thisData.values)
            setWeather(thisData.values[0])
        } catch (e) {
            console.error('Weather API Error:', e);
            alert('This place does not exist or weather data is not available')
        }
    }

    // Fetch location suggestions using Visual Crossing API
    const fetchSuggestions = useCallback(async (query) => {
        if (!query || query.length < 2) {
            setSuggestions([])
            setLoadingSuggestions(false)
            return
        }

        setLoadingSuggestions(true)
        
        try {
            // First try Visual Crossing API for suggestions
            const options = {
                method: 'GET',
                url: 'https://visual-crossing-weather.p.rapidapi.com/forecast',
                params: {
                    aggregateHours: '24',
                    location: query,
                    contentType: 'json',
                    unitGroup: 'metric',
                    shortColumnNames: 0,
                },
                headers: {
                    'X-RapidAPI-Key': import.meta.env.VITE_API_KEY,
                    'X-RapidAPI-Host': 'visual-crossing-weather.p.rapidapi.com'
                }
            }

            const response = await axios.request(options);
            console.log('Suggestions API Response:', response.data)

            // Extract locations from the response
            const locations = response.data.locations ? Object.values(response.data.locations) : []
            
            if (locations.length > 0) {
                const formattedSuggestions = locations.map(location => ({
                    name: location.address.split(',')[0].trim(),
                    state: location.address.split(',')[1] ? location.address.split(',')[1].trim() : '',
                    country: location.address.split(',').pop().trim(),
                    lat: location.latitude,
                    lon: location.longitude,
                    fullAddress: location.address
                }))
                setSuggestions(formattedSuggestions.slice(0, 8))
            } else {
                // If no locations found, use comprehensive mock data
                setSuggestions(getComprehensiveMockSuggestions(query))
            }
        } catch (error) {
            console.log('Visual Crossing API failed, using mock data:', error)
            // Fallback to comprehensive mock data
            setSuggestions(getComprehensiveMockSuggestions(query))
        } finally {
            setLoadingSuggestions(false)
        }
    }, [])

    // Comprehensive mock suggestions data for fallback
    const getComprehensiveMockSuggestions = useCallback((query) => {
        const allLocations = [
            // Sri Lankan Cities (Priority)
            { name: "Jaffna", state: "Northern Province", country: "Sri Lanka", lat: 9.6615, lon: 80.0255, fullAddress: "Jaffna, Northern Province, Sri Lanka" },
            { name: "Colombo", state: "Western Province", country: "Sri Lanka", lat: 6.9271, lon: 79.8612, fullAddress: "Colombo, Western Province, Sri Lanka" },
            { name: "Kandy", state: "Central Province", country: "Sri Lanka", lat: 7.2906, lon: 80.6337, fullAddress: "Kandy, Central Province, Sri Lanka" },
            { name: "Galle", state: "Southern Province", country: "Sri Lanka", lat: 6.0535, lon: 80.2210, fullAddress: "Galle, Southern Province, Sri Lanka" },
            { name: "Trincomalee", state: "Eastern Province", country: "Sri Lanka", lat: 8.5874, lon: 81.2152, fullAddress: "Trincomalee, Eastern Province, Sri Lanka" },
            { name: "Anuradhapura", state: "North Central Province", country: "Sri Lanka", lat: 8.3114, lon: 80.4037, fullAddress: "Anuradhapura, North Central Province, Sri Lanka" },
            { name: "Negombo", state: "Western Province", country: "Sri Lanka", lat: 7.2086, lon: 79.8357, fullAddress: "Negombo, Western Province, Sri Lanka" },
            { name: "Batticaloa", state: "Eastern Province", country: "Sri Lanka", lat: 7.7167, lon: 81.7000, fullAddress: "Batticaloa, Eastern Province, Sri Lanka" },
            
            // Indian Cities
            { name: "Chennai", state: "Tamil Nadu", country: "India", lat: 13.0827, lon: 80.2707, fullAddress: "Chennai, Tamil Nadu, India" },
            { name: "Coimbatore", state: "Tamil Nadu", country: "India", lat: 11.0168, lon: 76.9558, fullAddress: "Coimbatore, Tamil Nadu, India" },
            { name: "Madurai", state: "Tamil Nadu", country: "India", lat: 9.9252, lon: 78.1198, fullAddress: "Madurai, Tamil Nadu, India" },
            { name: "Trichy", state: "Tamil Nadu", country: "India", lat: 10.7905, lon: 78.7047, fullAddress: "Trichy, Tamil Nadu, India" },
            { name: "Salem", state: "Tamil Nadu", country: "India", lat: 11.6643, lon: 78.1460, fullAddress: "Salem, Tamil Nadu, India" },
            { name: "Bangalore", state: "Karnataka", country: "India", lat: 12.9716, lon: 77.5946, fullAddress: "Bangalore, Karnataka, India" },
            { name: "Mumbai", state: "Maharashtra", country: "India", lat: 19.0760, lon: 72.8777, fullAddress: "Mumbai, Maharashtra, India" },
            { name: "Delhi", state: "Delhi", country: "India", lat: 28.7041, lon: 77.1025, fullAddress: "Delhi, India" },
            
            // International Cities
            { name: "London", state: "England", country: "United Kingdom", lat: 51.5074, lon: -0.1278, fullAddress: "London, England, United Kingdom" },
            { name: "New York", state: "New York", country: "United States", lat: 40.7128, lon: -74.0060, fullAddress: "New York, New York, United States" },
            { name: "Tokyo", state: "Tokyo", country: "Japan", lat: 35.6762, lon: 139.6503, fullAddress: "Tokyo, Japan" },
            { name: "Sydney", state: "NSW", country: "Australia", lat: -33.8688, lon: 151.2093, fullAddress: "Sydney, NSW, Australia" },
            { name: "Paris", state: "Île-de-France", country: "France", lat: 48.8566, lon: 2.3522, fullAddress: "Paris, Île-de-France, France" },
            { name: "Dubai", state: "Dubai", country: "UAE", lat: 25.2048, lon: 55.2708, fullAddress: "Dubai, UAE" },
            { name: "Singapore", state: "Singapore", country: "Singapore", lat: 1.3521, lon: 103.8198, fullAddress: "Singapore" },
            { name: "Toronto", state: "Ontario", country: "Canada", lat: 43.6532, lon: -79.3832, fullAddress: "Toronto, Ontario, Canada" }
        ]

        const queryLower = query.toLowerCase()
        
        const filtered = allLocations.filter(location => 
            location.name.toLowerCase().includes(queryLower) ||
            location.state.toLowerCase().includes(queryLower) ||
            location.country.toLowerCase().includes(queryLower) ||
            location.fullAddress.toLowerCase().includes(queryLower)
        )

        return filtered.slice(0, 8)
    }, [])

    useEffect(() => {
        fetchWeather()
    }, [place])

    return (
        <StateContext.Provider value={{
            weather,
            setPlace,
            values,
            thisLocation,
            place,
            suggestions,
            setSuggestions,
            fetchSuggestions,
            loadingSuggestions
        }}>
            {children}
        </StateContext.Provider>
    )
}

export const useStateContext = () => useContext(StateContext)