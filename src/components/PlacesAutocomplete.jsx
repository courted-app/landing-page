import { useEffect, useRef, useState } from 'react'

const API_KEY = import.meta.env.VITE_GOOGLE_PLACES_API_KEY || ''
const PLACES_API_URL = 'https://places.googleapis.com/v1/places:searchText'

const PlacesAutocomplete = ({ value, onChange, onPlaceSelect, placeholder, className, required }) => {
  const inputRef = useRef(null)
  const containerRef = useRef(null)
  const [inputValue, setInputValue] = useState(value || '')
  const [suggestions, setSuggestions] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const debounceTimer = useRef(null)

  useEffect(() => {
    setInputValue(value || '')
  }, [value])

  // Debounced search function
  const searchPlaces = async (query) => {
    if (!query || query.trim().length < 2) {
      setSuggestions([])
      setShowSuggestions(false)
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch(PLACES_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Goog-Api-Key': API_KEY,
          'X-Goog-FieldMask': 'places.displayName,places.formattedAddress,places.addressComponents'
        },
        body: JSON.stringify({
          textQuery: query
        })
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      // Limit to first 3 suggestions
      setSuggestions((data.places || []).slice(0, 3))
      setShowSuggestions(true)
    } catch (error) {
      console.error('Error searching places:', error)
      setSuggestions([])
      setShowSuggestions(false)
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (e) => {
    const text = e.target.value
    setInputValue(text)
    onChange(e)

    // Clear existing timer
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current)
    }

    // Debounce API calls
    debounceTimer.current = setTimeout(() => {
      searchPlaces(text)
    }, 300)
  }

  const handleSelectPlace = async (place) => {
    const displayName = place.displayName?.text || place.formattedAddress || ''
    const formattedAddress = place.formattedAddress || ''
    
    // Extract city and country from address components
    let city = ''
    let country = ''
    
    if (place.addressComponents && place.addressComponents.length > 0) {
      // Use addressComponents if available
      place.addressComponents.forEach(component => {
        const types = component.types || []
        
        if (types.includes('locality')) {
          city = component.longText || component.shortText || ''
        } else if (types.includes('administrative_area_level_1') && !city) {
          // Use state/province if city not found
          city = component.longText || component.shortText || ''
        } else if (types.includes('country')) {
          country = component.longText || component.shortText || ''
        }
      })
    }
    
    // If we don't have city/country from addressComponents, parse from formattedAddress
    if (!city || !country) {
      if (formattedAddress) {
        // Parse formatted address: "Street, City State ZIP, Country"
        const parts = formattedAddress.split(',').map(p => p.trim())
        
        if (parts.length >= 2) {
          // Last part is usually country
          if (!country) {
            country = parts[parts.length - 1] || ''
          }
          
          // Second-to-last part contains city, state, and possibly postal code
          if (!city && parts.length >= 2) {
            const cityPart = parts[parts.length - 2] || ''
            // Try to extract city name by removing state/province abbreviations and postal codes
            // Examples: "Sydney NSW 2000" -> "Sydney", "Surry Hills NSW 2010" -> "Surry Hills"
            // Remove postal code (digits at the end)
            let cleanCity = cityPart.replace(/\s+\d+$/, '')
            // Remove state/province abbreviations (2-3 uppercase letters at the end)
            cleanCity = cleanCity.replace(/\s+[A-Z]{2,3}$/, '')
            city = cleanCity.trim() || cityPart
            
            // If still empty, use the whole second-to-last part
            if (!city) {
              city = cityPart
            }
          }
        }
      }
    }
    
    // Debug logging
    console.log('Extracted place data:', { currentClub: displayName || formattedAddress, city, country })

    // Use display name as club name, or formatted address if no display name
    const currentClub = displayName || formattedAddress

    setInputValue(currentClub)
    setShowSuggestions(false)
    setSuggestions([])

    // Update form data
    onChange({ target: { name: 'currentClub', value: currentClub } })
    
    // Callback with extracted data - this will automatically populate city and country
    if (onPlaceSelect) {
      onPlaceSelect({
        currentClub,
        city: city.trim(),
        country: country.trim()
      })
    }
  }

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setShowSuggestions(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current)
      }
    }
  }, [])

  return (
    <div ref={containerRef} style={{ position: 'relative', width: '100%' }}>
      <input
        ref={inputRef}
        type="text"
        name="currentClub"
        value={inputValue}
        onChange={handleInputChange}
        onFocus={() => {
          if (suggestions.length > 0) {
            setShowSuggestions(true)
          }
        }}
        placeholder={placeholder}
        className={className}
        required={required}
        autoComplete="off"
      />
      
      {showSuggestions && suggestions.length > 0 && (
        <div className="places-autocomplete-dropdown">
          {suggestions.map((place, index) => {
            const displayName = place.displayName?.text || ''
            const address = place.formattedAddress || ''
            
            return (
              <div
                key={index}
                className="places-autocomplete-item"
                onClick={() => handleSelectPlace(place)}
              >
                <div className="places-autocomplete-name">{displayName}</div>
                {address && (
                  <div className="places-autocomplete-address">{address}</div>
                )}
              </div>
            )
          })}
        </div>
      )}
      
      {isLoading && (
        <div className="places-autocomplete-loading">Searching...</div>
      )}
    </div>
  )
}

export default PlacesAutocomplete